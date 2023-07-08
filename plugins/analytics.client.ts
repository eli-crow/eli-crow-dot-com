declare global {
  interface Window {
    ["ga-disable-G-VJ6EPKW4FM"]: boolean;
    dataLayer: any[];
  }
}

export default defineNuxtPlugin((nuxtContext) => {
  const config = useRuntimeConfig();

  if (!config.public.disableAnalytics && typeof window !== "undefined") {
    window["ga-disable-G-VJ6EPKW4FM"] = true;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID", {
    send_page_view: false,
  });

  gtag("config", "G-VJ6EPKW4FM");
});
