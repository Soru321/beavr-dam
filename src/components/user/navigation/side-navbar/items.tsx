import { Cycle, motion as m, Variants } from 'framer-motion';

import { homeMenu } from '@/data/menu/home';
import { cn } from '@/lib/utils';

import { Item } from './item';

const variants: Variants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

interface ItemsProps {
  isOpen: boolean;
  toggleNav: Cycle;
}

export function Items({ isOpen, toggleNav }: ItemsProps) {
  return (
    <m.ul
      variants={variants}
      className={cn(
        "absolute left-1/2 top-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col gap-4 sm:gap-8",
        isOpen ? "z-50" : "-z-50",
      )}
    >
      {homeMenu.map((item, index) => (
        <Item key={`menu-item-${index}`} toggleNav={toggleNav} item={item} />
      ))}
    </m.ul>
  );
}
