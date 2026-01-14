import { createApp } from "@shopify/app-bridge";

export function initShopifyAppBridge() {
  const params = new URLSearchParams(window.location.search);

  const host = params.get("host");

  if (!host) {
    console.warn("Shopify host param missing");
    return null;
  }

  const app = createApp({
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
    host,
    forceRedirect: true,
  });

  return app;
}