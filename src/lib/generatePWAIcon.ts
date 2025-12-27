/**
 * Generates a personalized PWA icon with couple's initials and photo
 */
export async function generatePersonalizedIcon(
  name1: string,
  name2: string | null,
  photoUrl: string | null,
  size: number = 512
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Get initials
  const initial1 = name1.charAt(0).toUpperCase();
  const initial2 = name2 ? name2.charAt(0).toUpperCase() : "";
  const initials = initial2 ? `${initial1}&${initial2}` : initial1;

  // Draw background with photo or gradient
  if (photoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = photoUrl;
      });

      // Draw image covering the canvas (center crop)
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Add dark overlay for better text visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, size, size);
    } catch {
      // Fallback to gradient if image fails
      drawGradientBackground(ctx, size);
    }
  } else {
    drawGradientBackground(ctx, size);
  }

  // Draw initials
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Adjust font size based on text length
  const fontSize = initials.length > 2 ? size * 0.25 : size * 0.35;
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  
  // Add text shadow for better visibility
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL("image/png");
}

function drawGradientBackground(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#ec4899"); // pink-500
  gradient.addColorStop(1, "#be185d"); // pink-700
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
}

/**
 * Injects a dynamic manifest with personalized icons
 */
export function injectPersonalizedManifest(
  name1: string,
  name2: string | null,
  icon192: string,
  icon512: string
) {
  // Remove existing manifest links
  const existingManifests = document.querySelectorAll('link[rel="manifest"]');
  existingManifests.forEach(el => el.remove());

  const coupleNames = name2 ? `${name1} & ${name2}` : name1;
  
  const manifest = {
    name: coupleNames,
    short_name: coupleNames.length > 12 ? `${name1.split(' ')[0]} & ${name2?.split(' ')[0] || ''}`.trim() : coupleNames,
    description: `Página especial de ${coupleNames}`,
    theme_color: "#ec4899",
    background_color: "#1a1a2e",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };

  const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
  const manifestUrl = URL.createObjectURL(blob);

  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = manifestUrl;
  document.head.appendChild(link);

  // Also update apple-touch-icon
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleIcon) {
    appleIcon.setAttribute("href", icon192);
  }

  return manifestUrl;
}
