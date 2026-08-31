import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import CategorySection from "@/components/products/CategorySection";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import AboutSection from "@/components/layout/AboutSection";
import ContactCTA from "@/components/layout/ContactCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            {/* Left */}
            <div className="relative z-10">
              <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-brand-orange">
                Oussema 3D
              </p>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] text-brand-brown sm:text-6xl lg:text-7xl">
                Donnez forme à vos{" "}
                <span className="text-brand-orange">idées.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-brand-brown/65">
                Découvrez notre sélection de produits 3D, créations originales
                et bien plus encore.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="rounded-full bg-brand-brown px-7 py-3.5 text-sm font-bold text-brand-cream transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  Découvrir les produits
                </Link>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-brand-brown/20 px-7 py-3.5 text-sm font-bold text-brand-brown transition-all hover:-translate-y-1 hover:bg-brand-peach/40"
                >
                  Nous contacter
                </a>
              </div>

              <div className="mt-12 flex gap-8 border-t border-brand-brown/10 pt-7">
                <div>
                  <p className="text-2xl font-extrabold text-brand-brown">3D</p>
                  <p className="mt-1 text-xs font-medium text-brand-brown/55">
                    Créations
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-brand-brown">
                    +100
                  </p>
                  <p className="mt-1 text-xs font-medium text-brand-brown/55">
                    Produits
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-brand-brown">3</p>
                  <p className="mt-1 text-xs font-medium text-brand-brown/55">
                    Langues
                  </p>
                </div>
              </div>
            </div>

            {/* Right — 3D visual */}
            <div className="relative flex min-h-[500px] items-center justify-center lg:min-h-[620px]">
              <div className="absolute h-[380px] w-[380px] rounded-full bg-brand-peach/50 blur-3xl" />

              <div className="absolute right-[8%] top-[10%] h-24 w-24 rotate-12 rounded-3xl bg-brand-orange shadow-2xl" />

              <div className="absolute bottom-[12%] left-[5%] h-20 w-20 -rotate-12 rounded-full bg-brand-teal shadow-xl" />

              <div className="relative h-[390px] w-[330px] rotate-[-7deg] rounded-[3rem] bg-brand-brown p-5 shadow-2xl sm:h-[450px] sm:w-[380px]">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-[2.3rem] bg-brand-cream p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-brown/50">
                      O3D
                    </span>

                    <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white">
                      3D
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center">
                    <div className="absolute h-48 w-48 rounded-full bg-brand-peach/70 blur-2xl" />

                    <div className="relative h-44 w-44 rotate-12 rounded-[2.5rem] bg-brand-orange shadow-[20px_25px_0px_rgba(61,37,33,0.15)]">
                      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-2xl bg-brand-teal shadow-xl" />
                      <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-brand-brown" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      Made in Tunisia
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-brand-brown">
                      Imagine.
                      <br />
                      Create.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[15%] right-[2%] rounded-2xl border border-brand-brown/10 bg-brand-surface/80 px-5 py-4 shadow-xl backdrop-blur-md">
                <p className="text-xs font-semibold text-brand-brown/50">
                  NEW COLLECTION
                </p>
                <p className="mt-1 font-extrabold text-brand-brown">
                  Explore →
                </p>
              </div>
            </div>
          </div>
        </section>
        <CategorySection />
        <FeaturedProducts />
        <AboutSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
