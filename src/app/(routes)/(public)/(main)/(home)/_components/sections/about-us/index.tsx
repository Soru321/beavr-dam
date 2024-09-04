import Container from "@/components/ui/other/container";

import InnerSection1 from "./inner-section-1";
import InnerSection2 from "./inner-section-2";

export default function AboutUsSection() {
  return (
    <section id="about-us" className="bg-primary-dark py-20 xl:py-40">
      <Container>
        <div className="space-y-32">
          <InnerSection1 />
          <InnerSection2 />
        </div>
      </Container>
    </section>
  );
}
