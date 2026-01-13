import api from "./axios";

// Create Shop
export const createShop = (data) => {
  return api.post("/shops", data);
};

// Get Admin Shops
export const getMyShops = () => {
  return api.get("/shops");
};

export const updateShopSettings = (shopId, data) => {
  return api.put(`/shops/${shopId}/settings`, data);
};

export const deleteShop = (shopId) => {
  return api.delete(`/shops/${shopId}`);
}
 