const DailyWisdom = () => {
  return (
    <section id="wisdom" className="section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <div className="section-header">
          <span className="section-label">Daily Wisdom</span>
          <h2 className="section-title">Today's Shloka</h2>
        </div>

        <div className="glass-card p-10 md:p-16 animate-pulse-glow relative">
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-primary/30 rounded-tl-lg" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-primary/30 rounded-br-lg" />

          <p className="font-heading text-xl md:text-2xl text-primary leading-relaxed mb-8">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन
          </p>

          <div className="w-12 h-px bg-primary/30 mx-auto mb-8" />

          <p className="text-foreground text-base md:text-lg leading-relaxed mb-4 italic">
            "You have the right to perform your duty, but you are not entitled to the fruits of your actions."
          </p>

          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            నీ కర్తవ్యం నిర్వహించే హక్కు నీకు ఉంది, కానీ నీ చర్యల ఫలాలపై నీకు హక్కు లేదు.
          </p>

          <span className="text-primary/50 text-[11px] tracking-[0.25em] uppercase">
            — Bhagavad Gita 2.47
          </span>
        </div>
      </div>
    </section>
  );
};

export default DailyWisdom;
