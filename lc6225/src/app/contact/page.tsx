export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-500">
            We'd love to hear from you! Get in touch with us for reservations or questions.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Locations</h2>
            <div className="space-y-12">
              {/* Fort Collins Location */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">FORT COLLINS</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="mt-1 text-gray-600">
                      1720 W Mulberry St<br />
                      Fort Collins, CO 80521
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hours</h4>
                    <ul className="mt-1 text-gray-600 space-y-1">
                      <li>Monday - Friday: 7:00 AM - 8:00 PM</li>
                      <li>Saturday: 7:00 AM - 2:00 PM</li>
                      <li>Sunday: Closed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contact</h4>
                    <p className="mt-1 text-gray-600">
                      Phone: <a href="tel:9705128593" className="text-red-600 hover:underline">(970) 512-8593</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Berthoud Location */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">BERTHOUD</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="mt-1 text-gray-600">
                      405 5th St<br />
                      Berthoud, CO 80513
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Hours</h4>
                    <ul className="mt-1 text-gray-600 space-y-1">
                      <li>Monday - Friday: 7:30 AM - 2:00 PM</li>
                      <li>Saturday: 7:30 AM - 2:00 PM</li>
                      <li>Sunday: Closed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contact</h4>
                    <p className="mt-1 text-gray-600">
                      Phone: <a href="tel:9705174132" className="text-red-600 hover:underline">(970) 517-4132</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embeds */}
              <div className="mt-8 space-y-8">
                <div className="aspect-video">
                  <h4 className="font-medium text-gray-900 mb-2">Fort Collins Location</h4>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.041630272083!2d-105.09975872416293!3d40.5900929714479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694eb5a8f7f6b9%3A0x1c1a6f3e1b3e3b1f!2s1720%20W%20Mulberry%20St%2C%20Fort%20Collins%2C%20CO%2080521!5e0!3m2!1sen!2sus!4v1623345678901!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="aspect-video">
                  <h4 className="font-medium text-gray-900 mb-2">Berthoud Location</h4>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.041630272083!2d-105.09975872416293!3d40.5900929714479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694eb5a8f7f6b9%3A0x1c1a6f3e1b3e3b1f!2s1720%20W%20Mulberry%20St%2C%20Fort%20Collins%2C%20CO%2080521!5e0!3m2!1sen!2sus!4v1623345678901!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
            <form className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
