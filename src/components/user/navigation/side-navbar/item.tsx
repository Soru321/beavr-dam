import { Cycle, motion as m, Variants } from "framer-motion";
import Link from "next/link";

export const itemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

interface ItemProps {
  toggleNav: Cycle;
  item: { title: string; href: string };
}

export function Item({ toggleNav, item: { title, href } }: ItemProps) {
  return (
    <m.li
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-fit whitespace-nowrap text-4xl font-bold text-primary hover:text-primary-dark sm:text-5xl"
    >
      <Link href={href} onClick={() => toggleNav()}>
        {title}
      </Link>
    </m.li>
  );
}
