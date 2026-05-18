import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedStories from "@/components/FeaturedStories";
import CharactersGrid from "@/components/CharactersGrid";
import LifeLessons from "@/components/LifeLessons";
import VideoSection from "@/components/VideoSection";
import DailyWisdom from "@/components/DailyWisdom";
import StoryTellerBanner from "@/components/StoryTellerBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedStories />
      <StoryTellerBanner />
      <CharactersGrid />
      <LifeLessons />
      <VideoSection />
      <DailyWisdom />
      <Footer />
    </div>
  );
};

export default Index;
