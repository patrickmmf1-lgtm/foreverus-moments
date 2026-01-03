interface ManifestData {
  coupleName: string;
  shortName: string;
  photoUrl: string;
  slug: string;
}

/**
 * Injeta um manifest PWA dinâmico no documento
 * Personalizado para cada página de casal
 */
export const injectDynamicManifest = (data: ManifestData): void => {
  const { coupleName, shortName, photoUrl, slug } = data;

  const manifest = {
    name: coupleName,
    short_name: shortName,
    description: `Página de ${coupleName} - PraSempre`,
    start_url: `/p/${slug}`,
    scope: "/",
    display: "standalone",
    background_color: "#0D0D0F",
    theme_color: "#722F37",
    orientation: "portrait",
    icons: [
      {
        src: photoUrl,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: photoUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: photoUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  // Remover manifest existente
  const existingManifest = document.querySelector('link[rel="manifest"]');
  if (existingManifest) {
    existingManifest.remove();
  }

  // Criar e injetar novo manifest
  const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
  const manifestUrl = URL.createObjectURL(blob);

  const link = document.createElement("link");
  link.rel = "manifest";
  link.href = manifestUrl;
  document.head.appendChild(link);

  // Atualizar apple-touch-icon
  updateAppleTouchIcon(photoUrl);

  // Atualizar theme-color
  updateThemeColor("#722F37");

  // Atualizar título da página
  document.title = `${coupleName} - PraSempre`;
};

/**
 * Atualiza o apple-touch-icon para iOS
 */
const updateAppleTouchIcon = (iconUrl: string): void => {
  let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
  
  if (!appleIcon) {
    appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    document.head.appendChild(appleIcon);
  }
  
  appleIcon.href = iconUrl;
};

/**
 * Atualiza a cor do tema
 */
const updateThemeColor = (color: string): void => {
  let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
  
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta");
    themeColorMeta.name = "theme-color";
    document.head.appendChild(themeColorMeta);
  }
  
  themeColorMeta.content = color;
};

/**
 * Remove o manifest dinâmico (útil ao sair da página de instalação)
 */
export const removeDynamicManifest = (): void => {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink && manifestLink.getAttribute("href")?.startsWith("blob:")) {
    URL.revokeObjectURL(manifestLink.getAttribute("href")!);
    manifestLink.remove();
  }
};
