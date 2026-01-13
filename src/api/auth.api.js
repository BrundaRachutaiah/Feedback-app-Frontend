import api from "./axios";

export const adminLogin = (data) => {
  return api.post("/auth/login", data);
};

export const adminRegister = (data) => {
  return api.post("/auth/register", data);
};
