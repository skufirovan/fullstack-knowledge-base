export const ATTACHMENT_RULES = {
  allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp'] as string[],
  maxBytes: 5 * 1024 * 1024,
  cacheControl: 'public, max-age=31536000, immutable',
  expiresInSeconds: 120,
} as const
