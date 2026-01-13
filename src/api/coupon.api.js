import api from "./axios";

export const getActiveCoupon = (shopId) => {
  return api.get(`/coupons/${shopId}/active`);
};
