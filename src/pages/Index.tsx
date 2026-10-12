import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import LakeSection from "@/components/LakeSection";
import AreaSection from "@/components/AreaSection";
import DetailsSection from "@/components/DetailsSection";
import FAQSection from "@/components/FAQSection";
import GuestNotesSection from "@/components/GuestNotesSection";
import InquirySection from "@/components/InquirySection";
import MotionProvider from "@/components/board/MotionProvider";
import PatchStrip from "@/components/board/PatchStrip";
import Footer from "@/components/Footer";
import { DIRECT_BOOKING_ENABLED } from "@/lib/features";

const Index = () => {
  return (
    <>
      <Navbar />
      <MotionProvider>
        {/* The whole page is one continuous corkboard. */}
        <main className="bg-corkboard">
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <PatchStrip />
          <LakeSection />
          <AreaSection />
          <DetailsSection />
          <FAQSection />
          <GuestNotesSection />
          {/* While direct booking is off, the enquiry form already lives in
              the hero (see HeroSection) — rendering it again here would be a
              second id="inquire" on the page. */}
          {DIRECT_BOOKING_ENABLED && <InquirySection />}
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
};

export default Index;
