import { useEffect } from "react";

export const useDynamicThemeColor = (imgUrl?: string | null) => {
  useEffect(() => {
    const metaTheme = document.getElementById("theme-color-meta");
    if (!metaTheme) return;

    if (!imgUrl) {
      metaTheme.setAttribute("content", "#030305");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = 1;
        canvas.height = 1;
        // Sample the top corner or edge of the image to get the matching vibe color
        context.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = context.getImageData(0, 0, 1, 1).data;

        // Convert RGB to Hex string
        const hex = `#((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)`;
        metaTheme.setAttribute("content", hex);
      } catch (e) {
        // Fallback gracefully if canvas CORS restricts it
        metaTheme.setAttribute("content", "#030305");
      }
    };
  }, [imgUrl]);
};