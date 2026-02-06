import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Split Bill App",
    short_name: "SplitBill",
    description: "Aplikasi pembagi tagihan yang simpel dan cepat",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7056ec",
    icons: [
      {
        src: "/img/pwa-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/img/pwa-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
