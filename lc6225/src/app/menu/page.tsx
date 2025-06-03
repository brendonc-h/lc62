import { categories, menuItems } from '@/data/menu';
import Image from 'next/image';
import Link from 'next/link';
import { FireIcon } from '@heroicons/react/24/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function MenuPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Our Menu</h1>
          <p className="mt-4 text-lg text-gray-500">
            Discover our authentic Mexican dishes made with fresh ingredients and traditional recipes
          </p>
          <Link
            href="/order"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Order Online
          </Link>
        </div>

        <div className="mt-16">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category === category.id);
            if (items.length === 0) return null;

            return (
              <div key={category.id} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                  <p className="mt-2 text-lg text-gray-600">{category.description}</p>
                </div>
                <div className="space-y-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="w-full md:w-1/3 h-64 md:h-auto relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                            {item.popular && (
                              <span className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                                Popular Choice
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-lg text-gray-600 mb-4">{item.description}</p>
                        {item.spicyLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Spice Level:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(item.spicyLevel)].map((_, i) => (
                                <FireIcon
                                  key={i}
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
