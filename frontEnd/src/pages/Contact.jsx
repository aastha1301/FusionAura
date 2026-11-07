import { useState } from "react"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      alert("Your message has been submitted!")
      console.log(formData)

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    }
  }

  return (
    <div className="bg-[#080709] min-h-screen">

      
      <section className="px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="text-[#f06b91] uppercase tracking-widest text-sm">
          Get In Touch
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Contact Fusion Aura
        </h1>

        <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
          Have a question or want to know more about our services?
          Send us a message and we will be happy to help.
        </p>

        <div className="mx-auto mt-4 h-1 w-20 rounded bg-[#e85b83]"></div>
      </section>


      
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">

          
          <div className="simple-card rounded-2xl border border-white/10 bg-[#101014] p-5 shadow-sm sm:p-8">

            <p className="text-[#f06b91] uppercase tracking-widest text-sm">
              Contact Information
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              We'd Love To Hear From You
            </h2>

            <p className="text-zinc-400 mt-4 leading-7">
              Whether you want to book an appointment, ask about a service,
              or simply have a question, feel free to contact us.
            </p>


            
            <div className="flex gap-4 mt-8">
              <div className="text-2xl">📍</div>

              <div>
                <h3 className="font-semibold">
                  Address
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  Shop No. 106, Workshop Road
                  <br />
                  Opposite Bank of India, Yamuna Nagar - 135001
                </p>
              </div>
            </div>


            
            <div className="flex gap-4 mt-6">
              <div className="text-2xl">📞</div>

              <div>
                <h3 className="font-semibold">
                  Phone
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  +91 70825 55235 / +91 86840 55240
                </p>
              </div>
            </div>


            
            <div className="flex gap-4 mt-6">
              <div className="text-2xl">✉️</div>

              <div>
                <h3 className="font-semibold">
                  Instagram
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  Instagram: @fusionaura01
                </p>
              </div>
            </div>


            
            <div className="flex gap-4 mt-6">
              <div className="text-2xl">🕒</div>

              <div>
                <h3 className="font-semibold">
                  Opening Hours
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  Studio & on-location services
                </p>
              </div>
            </div>

          </div>


          
          <div className="simple-card rounded-2xl border border-white/10 bg-[#101014] p-5 shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold">
              Send Us A Message
            </h2>

            <p className="text-zinc-500 text-sm mt-2 mb-6">
              Fill in the form below and we will get back to you.
            </p>


            <form onSubmit={handleSubmit}>

            
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e85b83]"
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>


              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e85b83]"
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>


              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  maxLength="10"
                  className="w-full border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e85b83]"
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>


              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="5"
                  className="w-full border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e85b83] resize-none"
                ></textarea>

                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>


              
              <button
                type="submit"
                className="w-full rounded-lg bg-[#e85b83] py-3 font-medium text-white transition hover:bg-[#c9476d]"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>


     
      <section className="bg-[#101014] py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="text-xl font-bold sm:text-2xl">
            Ready For Your Beauty Transformation? ✨
          </h2>

          <p className="text-zinc-500 mt-2">
            Book your appointment with Fusion Aura today.
          </p>

        </div>
      </section>

    </div>
  )
}

export default Contact
