import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">La Casita</h3>
            <p className="text-gray-300">
              Authentic Mexican cuisine in the heart of Colorado.
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <Link href="/about" className="text-gray-300 hover:text-red-400 transition-colors">
                About Us
              </Link>
              <Link href="/order" className="text-gray-300 hover:text-red-400 transition-colors">
                Order Online
              </Link>
              <Link href="/menu" className="text-gray-300 hover:text-red-400 transition-colors">
                Menu
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="text-gray-300 space-y-2">
              <li>Monday - Thursday: 11am - 9pm</li>
              <li>Friday - Saturday: 11am - 10pm</li>
              <li>Sunday: 12pm - 8pm</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <ul className="text-gray-300 space-y-2">
              <li><span className="font-medium">Berthoud:</span> 950 Mountain Ave</li>
              <li>Berthoud, CO 80513</li>
              <li><span className="font-medium">Fort Collins:</span> 2909 E Harmony Rd</li>
              <li>Fort Collins, CO 80528</li>
              <li>(970) 555-1234</li>
              <li>Berthoud: <a href="mailto:berthoud@lacasita.io" className="hover:text-red-400 transition-colors">berthoud@lacasita.io</a></li>
              <li>Fort Collins: <a href="mailto:fortcollins@lacasita.io" className="hover:text-red-400 transition-colors">fortcollins@lacasita.io</a></li>
              <li>General: <a href="mailto:info@lacasita.io" className="hover:text-red-400 transition-colors">info@lacasita.io</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} La Casita. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link href="/privacy" className="hover:text-red-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-red-400 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
