import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-[#050506] text-white">

     
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div>
            <h2 className="text-2xl font-bold text-[#f06b91]">
              🌸 Fusion Aura
            </h2>

            <p className="text-zinc-500 text-sm leading-6 mt-4">
              Your destination for professional beauty and salon services.
              We help you look beautiful and feel confident for every
              special occasion.
            </p>
          </div>


          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <Link
                to="/"
                className="text-zinc-500 hover:text-[#f06b91]"
              >
                Home
              </Link>

              <Link
                to="/services"
                className="text-zinc-500 hover:text-[#f06b91]"
              >
                Services
              </Link>

              <Link
                to="/about"
                className="text-zinc-500 hover:text-[#f06b91]"
              >
                About Us
              </Link>

              <Link
                to="/reviews"
                className="text-zinc-500 hover:text-[#f06b91]"
              >
                Reviews
              </Link>

              <Link
                to="/contact"
                className="text-zinc-500 hover:text-[#f06b91]"
              >
                Contact Us
              </Link>

              <Link
                to="/admin/login"
                className="mt-2 text-xs text-zinc-600 hover:text-[#edca83]"
              >
                Staff login
              </Link>

            </div>
          </div>


          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Our Services
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <p className="text-zinc-500">
                Makeup & Bridal
              </p>

              <p className="text-zinc-500">
                Bleach, Hands & Feet
              </p>

              <p className="text-zinc-500">
                Facials & Clean-ups
              </p>

              <p className="text-zinc-500">
                Pre-Wedding Services
              </p>

            </div>
          </div>


          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="flex flex-col gap-4 text-sm">

              <p className="text-zinc-500">
                📍 Shop No. 106, Workshop Road, Opp. Bank of India, Yamuna Nagar - 135001
              </p>

              <p className="text-zinc-500">
                📞 +91 70825 55235 / +91 86840 55240
              </p>

              <p className="text-zinc-500">
                ✉️ Instagram: @fusionaura01
              </p>

              <p className="text-zinc-500">
                💄 Studio & on-location services
              </p>

            </div>
          </div>

        </div>

      </div>


      
      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-zinc-500 text-sm">
            © 2026 Fusion Aura. All rights reserved.
          </p>

          <Link
            to="/booking"
            className="bg-[#080709]0 px-5 py-2 rounded-lg text-sm hover:bg-[#c9476d]"
          >
            Book Appointment
          </Link>

        </div>

      </div>

    </footer>
  )
}

export default Footer
