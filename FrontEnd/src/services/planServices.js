import api from "./authServices.js";

export const getPlanUsageApi = async (signal) => {
  const response = await api.get("/users/me/usage", { signal });
  return response.data?.data;
};

export const upgradePlanApi = async () => {
  const response = await api.patch("/users/me/upgrade-plan");
  return { ...response.data?.data, token: response.data?.token };
};
