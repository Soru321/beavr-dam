import AboutUsSection from "./_components/sections/about-us";
import AnimatedDamSection from "./_components/sections/animated-dam";
import ContactUsSection from "./_components/sections/contact-us";
import HeroSection from "./_components/sections/hero";
import HowToInstallSection from "./_components/sections/how-to-install";
import ProductsSection from "./_components/sections/products";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AnimatedDamSection />
      <AboutUsSection />
      <div className="space-y-20 md:space-y-40">
        <HowToInstallSection />
        <ProductsSection />
        <ContactUsSection />
      </div>
    </div>
  );
}
