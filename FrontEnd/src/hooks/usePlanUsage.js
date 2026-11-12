import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthToken } from "../redux/features/authSlice.js";
import {
  setPlanUpgrading,
  setUsageData,
  setUsageError,
  setUsageLoading,
} from "../redux/features/planUsageSlice.js";
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
  const dispatch = useDispatch();
  const { data: usage, status, error, isUpgrading } = useSelector(
    (state) => state.planUsage,
  );
  const isLoading = status === "loading";

  const refresh = useCallback(async (signal) => {
    dispatch(setUsageLoading());

    try {
      const nextUsage = await getPlanUsageApi(signal);
      if (!isValidUsage(nextUsage)) {
        throw new Error("La API devolvió datos de uso incompletos.");
      }
      dispatch(setUsageData(nextUsage));
      return nextUsage;
    } catch (requestError) {
      if (!signal?.aborted && requestError.name !== "CanceledError") {
        dispatch(setUsageError(getErrorMessage(requestError)));
      }
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const upgrade = useCallback(async () => {
    dispatch(setPlanUpgrading(true));
    dispatch(setUsageError(""));

    try {
      const result = await upgradePlanApi();
      if (result?.plan !== "premium" || typeof result.token !== "string" || !result.token) {
        throw new Error("La API no confirmó el plan Premium y su nuevo token.");
      }
      window.localStorage.setItem("token", result.token);
      dispatch(updateAuthToken(result.token));
      await refresh();
      return result.plan;
    } catch (requestError) {
      dispatch(setUsageError(getErrorMessage(requestError)));
      return null;
    } finally {
      dispatch(setPlanUpgrading(false));
    }
  }, [dispatch, refresh]);

  return { usage, isLoading, isUpgrading, error, refresh, upgrade };
};
