const values = [
  {
    number: "01",
    title: "Création 3D",
    description:
      "Des objets imaginés et conçus avec une attention particulière aux détails.",
  },
  {
    number: "02",
    title: "Personnalisation",
    description:
      "Une idée particulière ? Nous adaptons nos créations à vos envies.",
  },
  {
    number: "03",
    title: "Made in Tunisia",
    description:
      "Des créations locales pensées pour apporter quelque chose d'unique.",
  },
];

export default function AboutSection() {
  return (
    <section className="overflow-hidden bg-brand-brown px-5 py-24 text-brand-cream lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
            Pourquoi nous ?
          </p>

          <h2 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl">
            Des idées qui prennent forme.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-brand-cream/65">
            De la création 3D aux objets du quotidien, nous imaginons des
            produits originaux, personnalisables et accessibles.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-brand-cream/10 bg-brand-cream/10 sm:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.number}
              className="bg-brand-brown p-7 transition-colors hover:bg-brand-orange"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-brand-cream/40">
                {value.number}
              </span>

              <h3 className="mt-16 text-xl font-extrabold">{value.title}</h3>

              <p className="mt-3 text-sm leading-6 text-brand-cream/60">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
