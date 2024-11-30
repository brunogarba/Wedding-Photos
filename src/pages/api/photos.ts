import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { uploadDisabled } from '../../utils';
import { randomUUID } from 'crypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

    const blob = await request.blob();
    const blobStore = getStore('bg_wedding_photos');
    const key = randomUUID();
    await blobStore.set(key, blob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return new Response(
        JSON.stringify({
            message: `Stored image "${key}"`,
            key: key
        })
    );
};

export const GET: APIRoute = async (context) => {
    try {
        const urlParams = new URL(context.url);
        const key = urlParams.searchParams.get('key');
        if (!key) {
            const keyArray = (await getStore('bg_wedding_photos').list()).blobs.map((blob) => blob.key);
            return new Response(JSON.stringify({ keys: keyArray }));
        }

        const blobStore = getStore('bg_wedding_photos');
        const blob = await blobStore.get(key, { type: 'blob' });

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

export const DELETE: APIRoute = async (context) => {
    try {
        const blobStore = await getStore('bg_wedding_photos').list();
        const token = context.request.headers.get('Authorization');
        if (token !== '&sN@vKLgiT3*EEFU') {
            return new Response(
                JSON.stringify({
                    error: 'Unauthorized'
                }),
                { status: 401 }
            );
        }

        const urlParams = new URL(context.url);
        const key = urlParams.searchParams.get('key');
        if (key) {
            await getStore('bg_wedding_photos').delete(key);

            return new Response(
                JSON.stringify({
                    message: `Deleted blob "${key}"`
                })
            );
        } else {
            for (const blob of blobStore.blobs) {
                await getStore('bg_wedding_photos').delete(blob.key);
            }

            return new Response(
                JSON.stringify({
                    message: `Deleted all blobs`
                })
            );
        }
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
