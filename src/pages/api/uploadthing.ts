import { createRouteHandler } from 'uploadthing/server';

import { ourFileRouter } from '../../server/uploadthing';

import { UPLOADTHING_TOKEN } from 'astro:env/server';

// Export routes for Next App Router
const handlers = createRouteHandler({
    router: ourFileRouter,
    config: {
        token: UPLOADTHING_TOKEN
    }
});
export { handlers as GET, handlers as POST };
