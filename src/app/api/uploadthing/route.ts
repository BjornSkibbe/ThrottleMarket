import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: {
  //   uploadthingId: process.env.UPLOADTHING_APP_ID,
  //   uploadthingSecret: process.env.UPLOADTHING_SECRET,
  // },
});
