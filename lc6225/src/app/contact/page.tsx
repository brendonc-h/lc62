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
            <h2 className="text-2xl font-bold text-gray-900">Visit Us</h2>
            <div className="mt-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="mt-2 text-gray-500">
                    123 Main Street<br />
                    Berthoud, CO 80513
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                  <ul className="mt-2 text-gray-500 space-y-1">
                    <li>Monday - Thursday: 11am - 9pm</li>
                    <li>Friday - Saturday: 11am - 10pm</li>
                    <li>Sunday: 11am - 8pm</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                  <p className="mt-2 text-gray-500">
                    Phone: (970) 555-0123<br />
                    Email: info@lacasitaberthoud.com
                  </p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-8 aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24037.096746541028!2d-105.08791!3d40.308375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876ea9b1b58da219%3A0x1ef3218e2e92ef8c!2sBerthoud%2C%20CO%2080513!5e0!3m2!1sen!2sus!4v1684901234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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
