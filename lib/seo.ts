import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

/**
 * openGraph/twitter blocks built from a page's own title/description (never new
 * copy) plus an image -- the sitewide default unless the page has its own hero.
 */
export function socialMetadata(title: string, description: string, image: string = DEFAULT_OG_IMAGE): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { title, description, images: [{ url: image }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
