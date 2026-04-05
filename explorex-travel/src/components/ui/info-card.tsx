type InfoCardProps = {
  title: string;
  description: string;
};

export const InfoCard = ({ title, description }: InfoCardProps) => {
  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </article>
  );
};
