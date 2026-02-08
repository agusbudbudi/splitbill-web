import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Split Bill App",
    short_name: "SplitBill",
    description: "Aplikasi pembagi tagihan yang simpel dan cepat",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#479fea",
    id: "/",
    prefer_related_applications: false,
    icons: [
      {
        src: "/img/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/img/footer-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/img/pwa-banner.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/img/pwa-banner.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
