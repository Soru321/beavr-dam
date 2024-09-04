"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

export default SessionProvider;
