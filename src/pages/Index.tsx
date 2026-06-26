import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedStories from "@/components/FeaturedStories";
import ContinueReadingCard from "@/components/ContinueReadingCard";
import SocialProofBar from "@/components/SocialProofBar";
import StoryTellerBanner from "@/components/StoryTellerBanner";
import CharactersGrid from "@/components/CharactersGrid";
import LifeLessons from "@/components/LifeLessons";
import DailyWisdom from "@/components/DailyWisdom";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      {/* ── 1. Hero — cinematic entry ── */}
      <HeroSection />

      {/* ── 2. Stats — verified numbers only ── */}
      <SocialProofBar />

      {/* ── 3. Featured Articles — surface content immediately ── */}
      <FeaturedStories />

      {/* ── 4. Continue Reading — returning visitors ── */}
      <ContinueReadingCard />

      {/* ── 5. Characters — visual exploration ── */}
      <CharactersGrid />

      {/* ── 6. Story Teller — AI feature ── */}
      <StoryTellerBanner />

      {/* ── 7. Daily Wisdom — quick value ── */}
      <DailyWisdom />

      {/* ── 8. Life Lessons — philosophy hook ── */}
      <LifeLessons />

      {/* ── 9. Newsletter ── */}
      <NewsletterSignup variant="banner" source="homepage" />
      <Footer />
    </div>
  );
};

export default Index;
