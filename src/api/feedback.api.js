import api from "./axios";

// Public – Submit Feedback
export const submitFeedback = (shopId, data) => {
  return api.post(`/feedback/${shopId}`, data);
};

// Admin – Get Feedback by Shop
export const getShopFeedback = (shopId) => {
  return api.get(`/shops/${shopId}/feedback`);
};

export const exportFeedbackCSV = (shopId) => {
  return api.get(`/feedback/${shopId}/export`, {
    responseType: "blob",
  });
};