// Note: this only works on the server side
export function getNetlifyContext() {
    return process.env.CONTEXT;
}

export function cacheHeaders(maxAgeDays = 365, cacheTags?: string[]): Record<string, string> {
    // As far as the browser is concerned, it must revalidate on every request.
    // However, Netlify CDN is told to keep the content cached for up to maxAgeDays (note: new deployment bust the cache by default).
    // We're also setting cache tags to be able to later purge via API (see: https://www.netlify.com/blog/cache-tags-and-purge-api-on-netlify/)
    const headers = {
        'Cache-Control': 'public, max-age=0, must-revalidate', // Tell browsers to always revalidate
        'Netlify-CDN-Cache-Control': `public, max-age=${maxAgeDays * 86_400}, must-revalidate` // Tells Netlify CDN the max allwed cache duration
    };
    if (cacheTags?.length > 0) headers['Cache-Tag'] = cacheTags.join(',');
    return headers;
}

export const uploadDisabled = import.meta.env.PUBLIC_DISABLE_UPLOADS?.toLowerCase() === 'true';
