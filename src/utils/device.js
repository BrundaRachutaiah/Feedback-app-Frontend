export const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId =
      "dev-" +
      Math.random().toString(36).substring(2) +
      Date.now().toString(36);

    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
};
