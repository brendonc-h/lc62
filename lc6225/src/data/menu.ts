export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicyLevel?: 1 | 2 | 3;
  popular?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
};

export const categories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
  },
  {
    id: 'tacos',
    name: 'Tacos',
    description: 'Traditional Mexican tacos with your choice of meat',
  },
  {
    id: 'burritos',
    name: 'Burritos',
    description: 'Large flour tortillas filled with your favorite ingredients',
  },
  {
    id: 'enchiladas',
    name: 'Enchiladas',
    description: 'Corn tortillas rolled around a filling and covered with sauce',
  },
  {
    id: 'fajitas',
    name: 'Fajitas',
    description: 'Grilled meat with peppers and onions, served with tortillas',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Refreshing beverages and cocktails',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
  },
];

export const menuItems: MenuItem[] = [
  {
    id: 'guacamole',
    name: 'Fresh Guacamole',
    description: 'Fresh avocados mixed with tomatoes, onions, cilantro, and lime juice',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9',
    category: 'appetizers',
    popular: true,
  },
  {
    id: 'queso-fundido',
    name: 'Queso Fundido',
    description: 'Melted cheese with chorizo and peppers',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1600544307527-65371a4d4201',
    category: 'appetizers',
  },
  {
    id: 'taco-al-pastor',
    name: 'Tacos Al Pastor',
    description: 'Marinated pork tacos with pineapple, onions, and cilantro',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    category: 'tacos',
    spicyLevel: 2,
    popular: true,
  },
  {
    id: 'burrito-carne-asada',
    name: 'Carne Asada Burrito',
    description: 'Grilled steak burrito with rice, beans, and guacamole',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'burritos',
    popular: true,
  },
  {
    id: 'enchiladas-rojas',
    name: 'Enchiladas Rojas',
    description: 'Three chicken enchiladas covered in red sauce and melted cheese',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615',
    category: 'enchiladas',
    spicyLevel: 1,
  },
  {
    id: 'fajitas-combo',
    name: 'Fajitas Combo',
    description: 'Combination of steak and chicken fajitas with all the fixings',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'margarita',
    name: 'House Margarita',
    description: 'Our signature margarita with fresh lime juice',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85',
    category: 'drinks',
  },
  {
    id: 'flan',
    name: 'Flan',
    description: 'Traditional Mexican caramel custard',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'desserts',
  },
];
