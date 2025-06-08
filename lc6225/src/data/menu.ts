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
    id: 'breakfastburritos',
    name: 'Breakfast Burritos',
    description: 'Start your day with our delicious breakfast burritos',
  },
     {
    id: 'breakfastmeals',
    name: 'Breakfast Meals',
    description: 'Start your day with our delicious breakfast meals',
  },
     {
    id: 'soups',
    name: 'Soups',
    description: 'ADDDDDDDDD',
  },
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
    id: 'tastadas',
    name: 'Tostadas',
    description: 'Traditional Tostadas with your choice of meat',
  },
    {
    id: 'salads',
    name: 'Salads',
    description: 'Fresh salads with a variety of toppings, served with rice,beans,pico de gallo, cheese and sour cream',
  },
    {
    id: 'combos',
    name: 'Combos',
    description: 'Traditional Tostadas with your choice of meat',
  },
  {
    id: 'burritos',
    name: 'Burritos',
    description: 'Large flour tortillas filled with your favorite ingredients',
  },
  {
    id: 'fajitas',
    name: 'Fajitas',
    description: 'Grilled meat with peppers and onions, served with tortillas',
  },
  {
    id: 'dinner',
    name: 'Dinner Specials',
    description: 'Grilled meat with peppers and onions, served with tortillas',
  },
  {
    id: 'enchiladas',
    name: 'Enchiladas',
    description: 'Corn tortillas rolled around a filling and covered with sauce',
  },
  {
    id: 'chimichangas',
    name: 'Chimichangas',
    description: 'Deep-fried burritos filled with your choice of meat',
  },
  {
    id: 'kids',
    name: 'Kids Menu',
    description: 'Special meals for our 12 & younger guests',
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Grilled meat with peppers and onions, served with tortillas',
  },
  {
    id: 'Toras y Hamburguesas',
    name: 'Tortas y Hamburguesas',
    description: 'Mexican sandwiches and burgers with a twist',
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
    id: 'beef-taco',
    name: 'Beef Taco',
    description: 'Fresh avocados mixed with tomatoes, onions, cilantro, and lime juice',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9',
    category: 'tacos',
    popular: true,
  },
   {
    id: 'chicken-taco',
    name: 'Chicken Taco',
    description: 'Fresh avocados mixed with tomatoes, onions, cilantro, and lime juice',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9',
    category: 'tacos',
  },
   {
    id: 'carnitas-taco',
    name: 'Carnitas Taco',
    description: 'Fresh avocados mixed with tomatoes, onions, cilantro, and lime juice',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9',
    category: 'tacos',
  },
   {
    id: 'three-asada',
    name: '3 Tacos de asada',
    description: 'Fresh avocados mixed with tomatoes, onions, cilantro, and lime juice',
    price: 13.75,
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e9',
    category: 'tacos',
    popular: true,
  },
  {
    id: 'three-barbacoa',
    name: '3 Tacos de Barbacoa',
    description: 'Melted cheese with chorizo and peppers',
    price: 13.75,
    image: 'https://images.unsplash.com/photo-1600544307527-65371a4d4201',
    category: 'tacos',
  },
  {
    id: 'three-al-pastor',
    name: '3 Tacos al Pastor',
    description: 'Marinated pork tacos with pineapple, onions, and cilantro',
    price: 13.75,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    category: 'tacos',
    spicyLevel: 2,
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
    id: 'bean-guacamole-tostada',
    name: 'Bean and Guacamole Tostada',
    description: 'Crispy tostada topped with refried beans and guacamole',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'chicken-tostada',
    name: 'ChickenTostada',
    description: 'Crispy tostada topped with refried beans and guacamole',
    price: 5.95,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'beef-tostada',
    name: 'Beef Tostada',
    description: 'Crispy tostada topped with refried beans and guacamole',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'guacamole-tostada',
    name: 'Guacamole Tostada',
    description: 'Crispy tostada topped with refried beans and guacamole',
    price: 7.45,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'bean-tostada',
    name: 'Bean and Guacamole Tostada',
    description: 'Crispy tostada topped with refried beans and guacamole',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'indian-taco',
    name: 'Indian Taco',
    description: 'Deep fried flour tortilla comes with your choice of beef, Chicken, Carnitas along side of beans smothered in green chilie and lettuce, tomatoes, and cheese',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tostadas',
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
