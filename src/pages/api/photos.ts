import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { uploadDisabled } from '../../utils';
import { randomUUID } from 'crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

    const blob = await request.blob();
    console.log(blob);
    const blobStore = getStore('bg_wedding_photos');
    const key = randomUUID();
    await blobStore.set(key, blob);
    console.log(`Stored shape "${key}"`);
    return new Response(
        JSON.stringify({
            message: `Stored shape "${key}"`,
            key: key
        })
    );
};

export const GET: APIRoute = async (context) => {
    try {
        const urlParams = new URL(context.url);
        const key = urlParams.searchParams.get('key');
        if (!key) {
            return new Response('Bad Request', { status: 400 });
        }

        console.log(key);

        const blobStore = getStore('wedding_photos');
        const blob = await blobStore.get(key, { type: 'blob' });

        console.log(blob);

        return new Response(blob);
    } catch (e) {
        console.error(e);
        return new Response(
            JSON.stringify({
                keys: [],
                error: 'Failed listing blobs'
            })
        );
    }
};
