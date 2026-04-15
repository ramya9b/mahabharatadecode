import { Link } from "react-router-dom";
import krishnaImg from "@/assets/krishna.jpg";
import karnaImg from "@/assets/karna.jpg";
import arjunaImg from "@/assets/arjuna.jpg";
import draupadiImg from "@/assets/draupadi.jpg";
import bhishmaImg from "@/assets/bhishma.jpg";

const characters = [
  { name: "Krishna", title: "The Divine Strategist", image: krishnaImg, id: "krishna" },
  { name: "Karna",   title: "The Tragic Hero",        image: karnaImg,   id: "karna"   },
  { name: "Arjuna",  title: "The Supreme Archer",     image: arjunaImg,  id: "arjuna"  },
  { name: "Draupadi",title: "The Fire-Born Queen",    image: draupadiImg,id: "draupadi"},
  { name: "Bhishma", title: "The Grand Patriarch",    image: bhishmaImg, id: "bhishma" },
];

const CharactersGrid = () => (
  <section id="characters" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <div className="section-header">
        <span className="section-label">Explore</span>
        <h2 className="section-title">Legendary Characters</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {characters.map((char) => (
          <Link
            key={char.id}
            to={`/characters#char-${char.id}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer hover-lift"
          >
            <img
              src={char.image}
              alt={char.name}
              loading="lazy"
              width={512}
              height={640}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
              <h3 className="font-heading text-base lg:text-lg text-foreground">{char.name}</h3>
              <p className="text-primary/80 text-[11px] tracking-wider mt-1">{char.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          to="/characters"
          className="px-10 py-3.5 rounded-full glass-card text-foreground text-sm font-medium tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
        >
          View Full Character Profiles →
        </Link>
      </div>
    </div>
  </section>
);

export default CharactersGrid;
