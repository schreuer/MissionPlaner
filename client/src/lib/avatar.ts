const DISCORD_CDN_ORIGIN = "https://cdn.discordapp.com";

/**
 * Returns the avatar URL only if it is a safe Discord CDN URL,
 * otherwise returns undefined. This prevents XSS via crafted URLs.
 */
export function safeAvatarUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol === "https:" &&
      parsed.origin === DISCORD_CDN_ORIGIN
    ) {
      return url;
    }
  } catch {
    // not a valid URL
  }
  return undefined;
}
