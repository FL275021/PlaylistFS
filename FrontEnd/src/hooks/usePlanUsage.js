import { useCallback, useEffect, useState } from "react";
import {
  getPlanUsageApi,
  upgradePlanApi,
} from "../services/planServices.js";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "No se pudo completar la solicitud.";

const isValidUsage = (usage) =>
  usage &&
  ["plus", "premium"].includes(usage.plan) &&
  Number.isInteger(usage.used) &&
  usage.used >= 0 &&
  (usage.plan === "premium" ||
    (Number.isInteger(usage.limit) && usage.limit > 0));

export const usePlanUsage = () => {
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");

    try {
      const nextUsage = await getPlanUsageApi(signal);
      if (!isValidUsage(nextUsage)) {
        throw new Error("La API devolvió datos de uso incompletos.");
      }
      setUsage(nextUsage);
      return nextUsage;
    } catch (requestError) {
      if (!signal?.aborted && requestError.name !== "CanceledError") {
        setError(getErrorMessage(requestError));
      }
      return null;
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const upgrade = useCallback(async () => {
    setIsUpgrading(true);
    setError("");

    try {
      const result = await upgradePlanApi();
      if (result?.plan !== "premium") {
        throw new Error("La API no confirmó la mejora al plan Premium.");
      }
      setUsage((currentUsage) =>
        currentUsage
          ? {
              ...currentUsage,
              plan: result.plan,
              limit: null,
              percentageUsed: null,
            }
          : currentUsage,
      );
      await refresh();
      return result.plan;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return null;
    } finally {
      setIsUpgrading(false);
    }
  }, [refresh]);

  return { usage, isLoading, isUpgrading, error, refresh, upgrade };
};
