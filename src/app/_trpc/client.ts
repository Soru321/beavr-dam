import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "@/server/routers";

export const trpcClient = createTRPCReact<AppRouter>({});
