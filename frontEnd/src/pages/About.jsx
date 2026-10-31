function About() {
  return (
    <div className="bg-[#101014] min-h-screen">

     
      <section className="bg-[#080709] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#f06b91] uppercase tracking-widest text-sm">
            About Fusion Aura
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Beauty That Makes You Feel Special
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-5 leading-7">
            Fusion Aura is a beauty and salon destination where professional
            services, quality products and personal care come together to
            create a comfortable and beautiful experience.
          </p>

          <div className="w-20 h-1 bg-[#080709]0 mx-auto mt-5 rounded"></div>
        </div>
      </section>


     
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          
          <div>
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              alt="Fusion Aura Salon"
              className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-cover rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
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
      </section>


   
      <section className="bg-[#080709] py-16">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">
            <p className="text-[#f06b91] uppercase tracking-widest text-sm">
              Why Choose Us
            </p>

            <h2 className="text-3xl font-bold mt-2">
              What Makes Fusion Aura Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-[#101014] p-6 rounded-2xl text-center shadow-sm">
              <div className="text-3xl">💎</div>
              <h3 className="font-semibold text-lg mt-4">
                Quality Products
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                We focus on using quality beauty products for our services.
              </p>
            </div>

            <div className="bg-[#101014] p-6 rounded-2xl text-center shadow-sm">
              <div className="text-3xl">✨</div>
              <h3 className="font-semibold text-lg mt-4">
                Professional Service
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                Our services are provided with care and attention to detail.
              </p>
            </div>

            <div className="bg-[#101014] p-6 rounded-2xl text-center shadow-sm">
              <div className="text-3xl">🌸</div>
              <h3 className="font-semibold text-lg mt-4">
                Comfortable Environment
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                Enjoy a clean, peaceful and comfortable salon experience.
              </p>
            </div>

            <div className="bg-[#101014] p-6 rounded-2xl text-center shadow-sm">
              <div className="text-3xl">❤️</div>
              <h3 className="font-semibold text-lg mt-4">
                Client Satisfaction
              </h3>
              <p className="text-zinc-500 text-sm mt-2">
                We focus on understanding and meeting our clients' needs.
              </p>
            </div>

          </div>
        </div>
      </section>


      
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6 text-center">

            <div>
              <h2 className="text-4xl font-bold text-[#f06b91]">8+</h2>
              <p className="text-zinc-500 mt-2">
                Beauty Services
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#f06b91]">100+</h2>
              <p className="text-zinc-500 mt-2">
                Happy Clients
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-[#f06b91]">5★</h2>
              <p className="text-zinc-500 mt-2">
                Customer Experience
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default About