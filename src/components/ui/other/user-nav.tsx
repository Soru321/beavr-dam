"use client";

import {
    LayoutDashboardIcon, LockKeyholeIcon, LogOutIcon, UserRoundCheckIcon, UserRoundIcon
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { signInRoute } from '@/data/routes';
import { changePasswordRoute, dashboardRoute, profileRoute } from '@/data/routes/admin';
import { Role } from '@/lib/types/auth';
import { cn } from '@/lib/utils';

import { Avatar, AvatarImage } from '../avatar';
import { Button, buttonVariants } from '../button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '../dropdown-menu';

export function UserNav() {
  const user = useSession().data?.user;

  return !!user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative size-10 rounded-full">
          <Avatar className="size-8">
            <AvatarImage
              src="/images/user.webp"
              alt={user.name ?? "User Image"}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mt-2 w-56 rounded-lg"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <UserRoundCheckIcon />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={dashboardRoute}>
            <DropdownMenuItem className="space-x-2 rounded-lg">
              <LayoutDashboardIcon className="size-5" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href={profileRoute}>
            <DropdownMenuItem className="space-x-2 rounded-lg">
              <UserRoundIcon className="size-5" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={changePasswordRoute}>
            <DropdownMenuItem className="space-x-2 rounded-lg">
              <LockKeyholeIcon className="size-5" />
              <span>Change Password</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="opacity-0" />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="group space-x-2 rounded-lg bg-red-500 text-secondary hover:cursor-pointer focus:bg-red-600 focus:text-white"
        >
          <LogOutIcon className="transition group-hover:translate-x-1" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href={signInRoute()}
      className={cn("font-bold", buttonVariants({ variant: "secondary" }))}
    >
      <span>Sign In</span>
    </Link>
  );
}
