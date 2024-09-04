import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers";
import { createCallerFactory } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export const trpcCaller = async () => createCaller(await createContext());
