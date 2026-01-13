import api from "./axios";

/* -------- SINGLE SHOP STATS -------- */
export const getShopStats = (shopId) => {
  if (!shopId) throw new Error("shopId is required");
  return api.get(`/dashboard/shop/${shopId}`);
};

/* -------- BATCH SHOP STATS (ADMIN) -------- */
export const getBatchShopStats = (shopIds) => {
  if (!Array.isArray(shopIds) || shopIds.length === 0) {
    // prevent 404 + infinite calls
    return Promise.resolve({ data: {} });
  }
  return api.post("/dashboard/batch", { shopIds });
};
