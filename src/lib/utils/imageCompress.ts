// Downscales + re-encodes a receipt photo client-side before it's sent to the
// scan API. Camera photos can be 4000px+ / several MB — shrinking them cuts
// upload time and the vision-token cost on every provider (OpenRouter/Groq/Gemini
// all bill roughly per-pixel). 1600px keeps receipt text legible for OCR.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("File is not a valid image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
