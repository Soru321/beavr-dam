import { Tailwind } from "@react-email/components";
import React from "react";

export default function TailwindComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#99c620",
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}
