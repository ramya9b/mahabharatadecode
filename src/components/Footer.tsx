import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-10 lg:gap-14 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground" style={{ fontFamily: "'Cinzel', serif" }}>M</span>
              </div>
              <span className="text-lg tracking-widest gold-text" style={{ fontFamily: "'Cinzel', serif" }}>MahabharataDecoded</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-8 i18n-safe">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-2.5 max-w-sm">
              <div className="flex-1 flex items-center gap-2.5 glass-card px-4 py-2.5 rounded-full">
                <Mail size={15} className="text-muted-foreground flex-shrink-0" />
                <input type="email" placeholder={t("footer.email_placeholder")}
                  className="bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none w-full" />
              </div>
              <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-base font-semibold hover:bg-gold-light transition-colors tracking-wide btn-i18n i18n-safe">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading text-[13px] tracking-[0.2em] uppercase text-foreground mb-5">{t("footer.explore_label")}</h4>
            <ul className="space-y-3.5">
              <li><Link to="/blog" className="text-muted-foreground text-[16px] hover:text-primary transition-colors i18n-safe">{t("footer.links.featured")}</Link></li>
              <li><Link to="/characters" className="text-muted-foreground text-[16px] hover:text-primary transition-colors i18n-safe">{t("footer.links.characters")}</Link></li>
              <li><a href="/#lessons" className="text-muted-foreground text-[16px] hover:text-primary transition-colors i18n-safe">{t("footer.links.lessons")}</a></li>
              <li><Link to="/wisdom" className="text-muted-foreground text-[16px] hover:text-primary transition-colors i18n-safe">{t("footer.links.wisdom")}</Link></li>
              <li><Link to="/about" className="text-muted-foreground text-[16px] hover:text-primary transition-colors i18n-safe">{t("footer.links.about")}</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading text-[13px] tracking-[0.2em] uppercase text-foreground mb-5">{t("footer.connect_label")}</h4>
            <ul className="space-y-3.5">
              {(["youtube","instagram","twitter","discord"] as const).map(k => (
                <li key={k}><a href="#" className="text-muted-foreground text-[16px] hover:text-primary transition-colors">{t(`footer.links.${k}`)}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-base tracking-wide i18n-safe">{t("footer.copyright")}</p>
          <p className="text-muted-foreground/40 text-base i18n-safe">{t("footer.built_with")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
