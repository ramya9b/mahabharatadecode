import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StoryTellerBanner from "@/components/StoryTellerBanner";
import StartReadingBanner from "@/components/StartReadingBanner";
import ExploreCharactersBanner from "@/components/ExploreCharactersBanner";
import CharactersGrid from "@/components/CharactersGrid";
import LifeLessons from "@/components/LifeLessons";
import VideoSection from "@/components/VideoSection";
import DailyWisdom from "@/components/DailyWisdom";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />

      {/* ── Story Teller Feature Banner ── */}
      <StoryTellerBanner />

      {/* ── Start Reading Banner ── */}
      <StartReadingBanner />

      {/* ── Explore Characters Banner ── */}
      <ExploreCharactersBanner />

      {/* ── Full Character Grid ── */}
      <CharactersGrid />

      <LifeLessons />
      <VideoSection />
      <DailyWisdom />
      {/* ── Newsletter banner — homepage ── */}
      <NewsletterSignup variant="banner" source="homepage" />
      <Footer />
    </div>
  );
};

export default Index;
