import { getServerAuthSession } from './auth';

export const createContext = async () => {
  const session = await getServerAuthSession();
  return { session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
