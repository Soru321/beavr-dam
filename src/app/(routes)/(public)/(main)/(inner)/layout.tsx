import { ReactNode } from "react";

export default function InnerLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen py-28 xl:py-40">{children}</div>;
}
