import { ReactNode } from "react";

import { Navigation } from "@/components/user/navigation";

import ScrollTop from "../../../../components/ui/other/scroll-top";
import FooterSection from "./(home)/_components/sections/footer";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />

      <div className="space-y-20 md:space-y-40">
        <main>{children}</main>
        <FooterSection />
      </div>
      <ScrollTop />
    </>
  );
}
