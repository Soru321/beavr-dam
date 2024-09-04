import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers";

const handler = (req: Request) => {
  return fetchRequestHandler({
    req,
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST };
