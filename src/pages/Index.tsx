import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedStories from "@/components/FeaturedStories";
import CharactersGrid from "@/components/CharactersGrid";
import LifeLessons from "@/components/LifeLessons";
import VideoSection from "@/components/VideoSection";
import DailyWisdom from "@/components/DailyWisdom";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedStories />
      <CharactersGrid />
      <LifeLessons />
      <VideoSection />
      <DailyWisdom />
      <Footer />
    </div>
  );
};

export default Index;
