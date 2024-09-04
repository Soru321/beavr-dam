"use client";

import { ChevronFirstIcon, ChevronLastIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useLayoutEffect } from 'react';

import { Button } from '@/components/ui/button';
import { adminMenu } from '@/data/menu/admin';
import { dashboardRoute } from '@/data/routes/admin';
import { useDevice } from '@/lib/hooks/use-device';
import { useSideNavbar } from '@/lib/hooks/use-side-navbar';
import { cn } from '@/lib/utils';

export function SideNavbar() {
  const { isExpanded, toggleExpanded, expand } = useSideNavbar();
  const { isExtraLargeDevice } = useDevice();

  useLayoutEffect(() => {
    if (isExtraLargeDevice) {
      expand();
    }
  }, [isExtraLargeDevice, expand]);

  return (
    <aside
      className={cn(
        "fixed top-0 z-40 h-full min-h-screen shadow-2xl transition xl:sticky xl:h-screen xl:shadow-none",
        isExpanded
          ? "w-80 translate-x-0"
          : "-translate-x-full xl:translate-x-0",
      )}
    >
      <nav className="flex h-full flex-col border-r bg-primary">
        <div className="flex h-20 items-center justify-between px-4">
          <Link href={dashboardRoute}>
            <Image
              src="/images/logo.webp"
              alt="BEAVR DAM"
              width={416}
              height={120}
              priority
              className={cn(
                "overflow-hidden",
                isExpanded ? "w-40" : "w-40 xl:w-0",
              )}
            />
          </Link>
          <Button variant="secondary" size="icon" onClick={toggleExpanded}>
            {isExpanded ? <ChevronFirstIcon /> : <ChevronLastIcon />}
          </Button>
        </div>

        <ul className="flex-1 space-y-4 px-4 py-8">
          {adminMenu.map((item, index) => (
            <Item
              key={`menu-item-${index}`}
              title={item.title}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

interface ItemProps {
  title: string;
  href: string;
  icon: ReactNode;
}

export function Item({ title, href, icon }: ItemProps) {
  const pathname = usePathname();
  const { isExpanded, collapse } = useSideNavbar();
  const { isExtraLargeDevice } = useDevice();

  return (
    <Link
      href={href}
      className="block"
      onClick={() => !isExtraLargeDevice && collapse()}
    >
      <li
        className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium ${
          pathname === href
            ? "bg-white text-primary"
            : "text-white hover:bg-white/80 hover:text-primary"
        }
    `}
      >
        {icon}
        <span
          className={`overflow-hidden whitespace-nowrap transition-all ${
            isExpanded ? "ml-3 w-52" : "ml-3 w-52 xl:ml-0 xl:w-0"
          }`}
        >
          {title}
        </span>

        {!isExpanded && (
          <div className="invisible absolute left-full ml-6 -translate-x-3 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-sm text-white opacity-20 transition-all group-hover:translate-x-0 group-hover:opacity-100 xl:group-hover:visible">
            {title}
          </div>
        )}
      </li>
    </Link>
  );
}
