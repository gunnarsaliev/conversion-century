// Largest image the dashboard uploads in one request: Server Action bodies
// are capped at 4.5 MB (next.config.mjs, Vercel's limit), minus room for the
// rest of the form data.
export const MEDIA_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;
