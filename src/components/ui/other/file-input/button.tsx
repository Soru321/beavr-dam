import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 duration-300 hover:ring-2 hover:ring-white disabled:ring-0"
    >
      {children}
    </button>
  );
}
