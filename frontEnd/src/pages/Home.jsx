import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import ReviewCard from "../components/ReviewCard"
import { serviceMenus } from "../data/serviceMenus"

function Home() {

  const services = useSelector((state) => state.services.services)
  const servicesReady = useSelector((state) => state.services.hasFetched) && services.every((service) => service.menuId)

  const reviews = useSelector(
    (state) => state.reviews.reviews
  )

 
  const featuredServices = serviceMenus.map((menu) => {
    const menuServices = services.filter((service) => service.menuId === menu.id)
    const serviceCount = servicesReady
      ? menuServices.length
      : menu.groups.reduce((count, group) => count + group.items.length, 0)
    const startingPrice = servicesReady
      ? menuServices[0]?.priceLabel || (menuServices[0] ? `₹${menuServices[0].price}` : "")
      : menu.groups[0].items[0].price
    return { ...menu, serviceCount, startingPrice }
  })

  
  const featuredReviews = reviews.slice(0, 3)

  return (
    <div className="bg-[#080709]">

     
      <section className="min-h-[70vh] flex items-center">

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

          <div>

            <p className="text-[#f06b91] font-medium mb-3">
              ✨ Beauty • Style • Confidence
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-100 leading-tight">
              Your Beauty,
              <span className="text-[#f06b91]">
                {" "}Our Passion
              </span>
            </h1>

            <p className="text-zinc-400 mt-6 text-lg leading-relaxed">
              Welcome to Fusion Aura, where beauty meets elegance.
              Experience professional salon services designed to
              make you feel confident and beautiful.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">

              <Link
                to="/services"
                className="bg-[#d746c] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d9476d]"
              >
                Book Appointment
              </Link>

              <Link
                to="/services"
                className="border border-[#e85b83] text-[#f06b91] px-6 py-3 rounded-lg font-medium hover:bg-[#080709]"
              >
                Explore Services
              </Link>

            </div>

          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
              alt="Salon"
              className="w-full h-[300px] sm:h-[380px] md:h-[450px] object-cover rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
          </div>

        </div>

      </section>


     
      <section className="bg-[#101014] py-10">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-center">

          <div>
            <div className="text-3xl">💄</div>
            <h3 className="font-semibold mt-2">
              Professional Makeup
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              Perfect looks for every occasion.
            </p>
          </div>

          <div>
            <div className="text-3xl">💇‍♀️</div>
            <h3 className="font-semibold mt-2">
              Expert Styling
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              Stylish haircuts and hairstyles.
            </p>
          </div>

          <div>
            <div className="text-3xl">✨</div>
            <h3 className="font-semibold mt-2">
              Premium Services
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              Quality beauty treatments.
            </p>
          </div>

          <div>
            <div className="text-3xl">❤️</div>
            <h3 className="font-semibold mt-2">
              Happy Customers
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              Your satisfaction matters to us.
            </p>
          </div>

        </div>

      </section>


      
      <section className="py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
              Our Popular Services
            </h2>

            <p className="text-zinc-400 mt-3">
              Discover our most loved beauty services.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((menu, index) => (
              <Link key={menu.id} to={`/services#${menu.id}`} className="group rounded-2xl border border-[#c9a765]/25 bg-[#100e0d] p-6 transition hover:-translate-y-1 hover:border-[#d8b86e]/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b76f]/40 text-2xl text-[#edca83]">{menu.icon}</span>
                <p className="mt-5 text-[0.65rem] uppercase tracking-[0.24em] text-[#d8b86e]">Menu 0{index + 1}</p>
                <h3 className="mt-2 font-serif text-xl text-[#fff1cc]">{menu.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{menu.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#c9a765]/15 pt-4">
                  <span className="text-xs text-zinc-500">{menu.serviceCount} services</span>
                  <span className="text-sm font-semibold text-[#edca83]">{menu.startingPrice}</span>
                </div>
              </Link>
            ))}
          </div>


          <div className="text-center mt-10">

            <Link
              to="/services"
              className="text-[#f06b91] font-medium hover:underline"
            >
              View All Services →
            </Link>

          </div>

        </div>

      </section>


      
      <section className="bg-[#101014] py-16 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
              What Our Customers Say
            </h2>

            <p className="text-zinc-400 mt-3">
              Real experiences from our customers.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {featuredReviews.map((review, index) => (

              <ReviewCard
                key={review._id || index}
                name={review.name}
                rating={review.rating}
                review={review.review}
              />

            ))}

          </div>


          <div className="text-center mt-10">

            <Link
              to="/reviews"
              className="text-[#f06b91] font-medium hover:underline"
            >
              View All Reviews →
            </Link>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="py-16 px-6">

        <div className="max-w-5xl mx-auto bg-[#080709]0 rounded-3xl p-10 text-center text-white">

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready for Your New Look?
          </h2>

          <p className="mt-4 text-pink-100">
            Book your appointment with Fusion Aura today.
          </p>

          <Link
            to="/services"
            className="inline-block mt-7 bg-[#101014] text-[#f06b91] px-7 py-3 rounded-lg font-medium hover:bg-[#080709]"
          >
            Browse Services & Book
          </Link>

        </div>

      </section>

    </div>
  )
}

export default Home
