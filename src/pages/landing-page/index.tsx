import Navbar from "../../components/components-landing-page/Navbar.tsx";
import Hero from "../../components/components-landing-page/Hero.tsx";
// import Features from "./components/Features.jsx";
import Testimonial from "../../components/components-landing-page/Testimonial.tsx";
import CallToAction from "../../components/components-landing-page/CallToAction.tsx";
import Footer from "../../components/components-landing-page/Footer.tsx";
import CostEstimator from "../../components/components-landing-page/CostEstimator.tsx";
import Introduction from "../../components/components-landing-page/Introduction.tsx";
import Component from "../../components/components-landing-page/BrandSlider.tsx";
import Services from "../../components/components-landing-page/ServiceInfo.tsx";
import PageHead from "@/components/shared/page-head.tsx";

function LandingPage() {
  return (
    <>
      <PageHead title="Tebprint Fulfillment" />
      <Navbar />
      <Hero />
      {/* <Features /> */}
      <Introduction />
      <CostEstimator />
      <Services />
      <Component />
      <Testimonial />
      <CallToAction />
      <Footer />
    </>
  );
}

export default LandingPage;
