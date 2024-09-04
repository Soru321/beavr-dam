import { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: JSX.Element;
  style?: CSSProperties;
  className?: string | undefined;
}

export default function Container({
  children,
  style,
  className,
}: ContainerProps) {
  return (
    <div
      style={style}
      className={cn(
        "mx-auto h-full w-full max-w-screen-xl overflow-hidden px-4 lg:overflow-visible xl:px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
