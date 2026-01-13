import api from "./axios";

export const getCouponStats = (shopId) => {
  return api.get(`/analytics/coupon/${shopId}`);
};

export const getGlobalAnalytics = () => {
  return api.get("/analytics/global");
};
