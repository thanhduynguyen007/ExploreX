type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PageHero = ({ eyebrow, title, description }: PageHeroProps) => {
  return (
    <section className="rounded-[2rem] bg-[linear-gradient(135deg,#1c1917_0%,#57534e_55%,#f59e0b_100%)] px-6 py-10 text-white shadow-lg sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-100 sm:text-base">{description}</p>
    </section>
  );
};
