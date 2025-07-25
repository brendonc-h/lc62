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
            <div className="text-gray-300 space-y-3">
              <div>
                <p className="font-medium text-white">Berthoud:</p>
                <ul className="space-y-1 text-sm">
                  <li>Mon-Fri: 7:30 AM - 8 PM</li>
                  <li>Saturday: 7:30 AM - 2 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-white">Fort Collins:</p>
                <ul className="space-y-1 text-sm">
                  <li>Mon-Fri: 7 AM - 8 PM</li>
                  <li>Saturday: 7 AM - 2 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <div className="text-gray-300 space-y-4">
              <div>
                <p className="font-medium text-white">Berthoud</p>
                <p className="text-sm">405 5th St</p>
                <p className="text-sm">Berthoud, CO 80513</p>
                <p className="text-sm">(970) 344-6448</p>
                <p className="text-sm">
                  <span className="font-medium">Service:</span> Outdoor seating, Kids' menu, Dogs allowed outside
                </p>
              </div>
              <div>
                <p className="font-medium text-white">Fort Collins</p>
                <p className="text-sm">1720 W Mulberry St</p>
                <p className="text-sm">Fort Collins, CO 80521</p>
                <p className="text-sm">(970) 568-8363</p>
              </div>
            </div>
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
