import Reveal from "../components/Reveal"

function About() {
  return (
    <div className="bg-[#101014] min-h-screen">

     
      <Reveal as="section" className="bg-[#080709] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-[#f06b91] uppercase tracking-widest text-sm">
            About Fusion Aura
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Beauty That Makes You Feel Special
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-5 leading-7">
            Fusion Aura is a beauty and salon destination where professional
            services, quality products and personal care come together to
            create a comfortable and beautiful experience.
          </p>

          <div className="mx-auto mt-5 h-1 w-20 rounded bg-[#e85b83]"></div>
        </div>
      </Reveal>


     
      <Reveal as="section" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

          
          <div>
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              alt="Fusion Aura Salon"
              className="h-[240px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          
          <div>
            <p className="text-[#f06b91] uppercase tracking-widest text-sm">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Your Beauty, Our Passion
            </h2>

            <p className="text-zinc-400 mt-5 leading-7">
              At Fusion Aura, we believe that beauty is not just about
              appearance. It is about confidence, comfort and feeling good
              about yourself.
            </p>

            <p className="text-zinc-400 mt-4 leading-7">
              Our salon provides a range of beauty services including
              makeup, hairstyling, facial, manicure and pedicure. Our goal is
              to provide every client with a professional and relaxing
              experience.
            </p>

            <p className="text-zinc-400 mt-4 leading-7">
              Whether you are preparing for a wedding, party, special
              occasion or simply want some self-care, Fusion Aura is here
              to help you create the look you want.
            </p>
          </div>

        </div>
      </Reveal>


   
      <Reveal as="section" className="bg-[#080709] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="text-center mb-10">
            <p className="text-[#f06b91] uppercase tracking-widest text-sm">
              Why Choose Us
            </p>

            <h2 className="text-3xl font-bold mt-2">
              What Makes Fusion Aura Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <Reveal as="div" delay={0} style={{ "--float-delay": "-0.3s", "--float-duration": "2.9s" }} className="motion-card float-card rounded-2xl bg-[#101014] p-6 text-center shadow-sm">
              <div className="text-3xl">💎</div>
              <h3 className="font-semibold text-lg mt-4">
                Quality Products
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                We focus on using quality beauty products for our services.
              </p>
            </Reveal>

            <Reveal as="div" delay={80} style={{ "--float-delay": "-0.7s", "--float-duration": "3.1s" }} className="motion-card float-card rounded-2xl bg-[#101014] p-6 text-center shadow-sm">
              <div className="text-3xl">✨</div>
              <h3 className="font-semibold text-lg mt-4">
                Professional Service
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                Our services are provided with care and attention to detail.
              </p>
            </Reveal>

            <Reveal as="div" delay={160} style={{ "--float-delay": "-1.1s", "--float-duration": "3s" }} className="motion-card float-card rounded-2xl bg-[#101014] p-6 text-center shadow-sm">
              <div className="text-3xl">🌸</div>
              <h3 className="font-semibold text-lg mt-4">
                Comfortable Environment
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                Enjoy a clean, peaceful and comfortable salon experience.
              </p>
            </Reveal>

            <Reveal as="div" delay={240} style={{ "--float-delay": "-1.4s", "--float-duration": "3.3s" }} className="motion-card float-card rounded-2xl bg-[#101014] p-6 text-center shadow-sm">
              <div className="text-3xl">❤️</div>
              <h3 className="font-semibold text-lg mt-4">
                Client Satisfaction
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                We focus on understanding and meeting our clients' needs.
              </p>
            </Reveal>

          </div>
        </div>
      </Reveal>


      
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 text-center md:grid-cols-3">

            <Reveal as="div" delay={0}>
              <h2 className="text-4xl font-bold text-[#f06b91]">8+</h2>
              <p className="text-zinc-500 mt-2">
                Beauty Services
              </p>
            </Reveal>

            <Reveal as="div" delay={90}>
              <h2 className="text-4xl font-bold text-[#f06b91]">100+</h2>
              <p className="text-zinc-500 mt-2">
                Happy Clients
              </p>
            </Reveal>

            <Reveal as="div" delay={180}>
              <h2 className="text-4xl font-bold text-[#f06b91]">5★</h2>
              <p className="text-zinc-500 mt-2">
                Customer Experience
              </p>
            </Reveal>

          </div>
        </div>
      </section>

    </div>
  )
}

export default About
