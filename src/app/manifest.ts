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
        src: "/img/pwa-icon.png",
        sizes: "192x192", // Chrome requires a 192x192 icon. If actual file is 512, this causes a warning, but is required.
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/img/pwa-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/img/banner-splitbill.jpg",
        sizes: "1200x630",
        type: "image/jpg",
        form_factor: "wide",
      },
      {
        src: "/img/banner-splitbill.jpg",
        sizes: "1200x630",
        type: "image/jpg",
      },
    ],
  };
}
