"use client";

import { useMediaQuery } from "./use-media-query";

export function useDevice() {
  const isSmallDevice = useMediaQuery("only screen and (min-width : 640px)");
  const isMediumDevice = useMediaQuery("only screen and (min-width : 768px)");
  const isLargeDevice = useMediaQuery("only screen and (min-width : 1024px)");
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1280px)",
  );

  return {
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isExtraLargeDevice,
  };
}
