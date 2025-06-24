export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">La Casita</h3>
            <p className="text-gray-300">
              Authentic Mexican cuisine in the heart of Berthoud, Colorado.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="text-gray-300 space-y-2">
              <li>Monday - Thursday: 11am - 9pm</li>
              <li>Friday - Saturday: 11am - 10pm</li>
              <li>Sunday: 11am - 8pm</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="text-gray-300 space-y-2">
              <li>123 Main Street</li>
              <li>Berthoud, CO 80513</li>
              <li>(970) 555-0123</li>
              <li>info@lacasitaberthoud.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} La Casita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
