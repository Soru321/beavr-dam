import { Variants } from "framer-motion";

export const opacityVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleOpacityVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.1 * custom },
  }),
  exit: { opacity: 0 },
};

export const upOpacityVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { opacity: 0 },
};

export const rightOpacityVariants: Variants = {
  initial: { x: -50, opacity: 0 },
  animate: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.1 * custom, type: "tween" },
  }),
  exit: { opacity: 0 },
};
