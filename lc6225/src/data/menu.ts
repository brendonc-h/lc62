export type SpiceLevel = 'mild' | 'medium' | 'hot';

export const SPICE_LEVELS: SpiceLevel[] = ['mild', 'medium', 'hot'];
export const STYLE_TYPES = ['Beef', 'Chicken', 'Bean'] as const;
export type StyleType = typeof STYLE_TYPES[number];

export interface MenuItemVariant {
  name: string;
  price: number;
  description?: string;
  protein?: 'beef' | 'chicken' | 'bean' | 'cheese';
  size?: 'small' | 'medium' | 'large';
  spiceLevel?: SpiceLevel;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // Base price (for items without variants)
  image: string;
  category: string;
  popular?: boolean;
  variants?: MenuItemVariant[]; // For items with variants (like wrap vs deluxe)
  defaultSpiceLevel?: SpiceLevel; // Default spice level
  spicyLevel?: number; // Legacy - will be deprecated
}

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
    id: 'breakfast-burritos',
    name: 'Breakfast Burritos',
    description: 'Start your day with our delicious breakfast burritos',
  },
  {
    id: 'breakfast-meals',
    name: 'Breakfast Meals',
    description: 'Start your day with our delicious breakfast meals',
  },
  {
    id: 'soups',
    name: 'Soups',
    description: 'Warm and comforting soups made with fresh ingredients',
  },
  {
    id: 'tacos',
    name: 'Tacos',
    description: 'Traditional Mexican tacos with your choice of meat',
  },
  {
    id: 'tostadas',
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
    id: 'dinner-specials',
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
    id: 'tortas-y-hamburguesas',
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
    id: 'nacho-fans',
    name: 'Nacho Fans',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'chili-cheese-fries',
    name: 'Chili Cheese Fries',
    description: 'Crispy fries topped with chili and melted cheese. Add any meat for $2.00',
    price: 10.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'cheese-dip-small',
    name: 'Cheese Dip (Small)',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'cheese-dip-large',
    name: 'Cheese Dip (Large)',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'mexican-taquitos',
    name: 'Mexican Taquitos',
    description: 'Crispy rolled tacos filled with your choice chicken or beef, flour tortillas',
    price: 12.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'quesadilla',
    name: 'Quesadilla',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'schrimp-quesadilla',
    name: 'Shrimp Quesadilla',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'pizza-birria',
    name: 'Pizza Birria',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'queso-fundido',
    name: 'Queso Fundido',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00 Corn or Flour Tortillas',
    price: 14.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'steak-bowl',
    name: 'Steak Bowl',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'salads',
    popular: true,
  },
     {
    id: 'schrimp-bowl',
    name: 'Schrimp Bowl',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'salads',
    popular: true,
  },
     {
    id: 'taco-salad',
    name: 'Taco Salad',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 10.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'salads',
    popular: true,
  },
     {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'kids',
    popular: true,
  },
      {
    id: 'quesadilla-kids',
    name: 'Quesadilla',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'kids',
    popular: true,
  },
      {
    id: 'taco-kids',
    name: 'Taco',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'kids',
    popular: true,
  },
      {
    id: 'bean-cheese-burrito',
    name: 'Bean and Cheese Burrito',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'kids',
    popular: true,
  },
      {
    id: 'sopapillas',
    name: 'Sopapillas',
    description: 'Traditional Mexican fried dough pastries, served with honey',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'desserts',
    popular: true,
  },
        {
    id: 'fried-ice-cream',
    name: 'Fried Ice Cream',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'desserts',
    popular: true,
  },
        {
    id: 'cheesecake-chimichanga',
    name: 'Cheesecake Chimichanga',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'desserts',
    popular: true,
  },
        {
    id: 'churros',
    name: 'Churros',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 6.45,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'desserts',
    popular: true,
  },
        {
    id: 'crispy-relleno',
    name: 'Crispy Relleno',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'soft-relleno',
    name: 'Soft Relleno',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'rice',
    name: 'Rice',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'guacamole',
    name: 'Guacamole',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'sour-cream',
    name: 'Sour Cream',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'toreados',
    name: 'Toreados(3)',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-salsa',
    name: 'Chips and Salsa',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-guacamole',
    name: 'Chips and Guacamole',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 10.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'beans',
    name: 'Beans',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'chicharrone',
    name: 'Chicharrone',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-8oz',
    name: 'Green Chile 8 oz',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 5.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-16oz',
    name: 'Green Chile 16 oz',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 9.25,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-32oz',
    name: 'Green Chile 32 oz',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 14.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'tortillas-4',
    name: 'Tortillas (4)',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'potatoes',
    name: 'Potatoes',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'plain-tamal',
    name: 'Plain Tamal',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'smothered-tamal',
    name: 'Smothered Tamal',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'sides',
    popular: true,
  },
          {
    id: 'torta-steak',
    name: 'Torta Steak',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-carnitas',
    name: 'Torta Carnitas',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-barbacoa',
    name: 'Torta Barbacoa',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-pastor',
    name: 'Torta Pastor',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'cheese-burger',
    name: 'Cheese Burger',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 10.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'hamburger',
    name: 'Hamburger',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 8.45,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'mexican-hamburger',
    name: 'Mexican Hamburger',
    description: 'Chicken or Beef, served with sour cream, jalapenos Add steak for $2.00',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
  // Combos
  {
    id: 'combo-enchilada',
    name: 'Enchilada Combo',
    description: 'Cheese enchilada with your choice of protein',
    price: 15.49, // Base price for Medium Beef
    image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Beef', 
        price: 15.49, 
        description: '2 beef enchiladas with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 15.49, 
        description: '2 chicken enchiladas with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Medium - Bean', 
        price: 14.49, 
        description: '2 bean enchiladas with rice and beans',
        protein: 'bean',
        size: 'medium'
      },
      { 
        name: 'Large - Beef', 
        price: 18.49, 
        description: '3 beef enchiladas with rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 18.49, 
        description: '3 chicken enchiladas with rice and beans',
        protein: 'chicken',
        size: 'large'
      },
      { 
        name: 'Large - Bean', 
        price: 17.49, 
        description: '3 bean enchiladas with rice and beans',
        protein: 'bean',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },
  {
    id: 'combo-taco',
    name: 'Taco Combo',
    description: 'Crispy taco with your choice of protein',
    price: 14.99, // Base price for Medium Beef
    image: 'https://images.unsplash.com/photo-1551504734-9d6c0dfb5a1b',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Beef', 
        price: 14.99, 
        description: '2 beef tacos with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 14.99, 
        description: '2 chicken tacos with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Medium - Bean', 
        price: 13.99, 
        description: '2 bean tacos with rice and beans',
        protein: 'bean',
        size: 'medium'
      },
      { 
        name: 'Large - Beef', 
        price: 17.99, 
        description: '3 beef tacos with rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 17.99, 
        description: '3 chicken tacos with rice and beans',
        protein: 'chicken',
        size: 'large'
      },
      { 
        name: 'Large - Bean', 
        price: 16.99, 
        description: '3 bean tacos with rice and beans',
        protein: 'bean',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },
  {
    id: 'combo-burrito',
    name: 'Burrito Combo',
    description: 'Hearty burrito with your choice of protein',
    price: 14.99, // Base price for Medium Beef
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Beef', 
        price: 14.99, 
        description: '1 beef burrito with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 14.99, 
        description: '1 chicken burrito with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Medium - Bean', 
        price: 13.99, 
        description: '1 bean burrito with rice and beans',
        protein: 'bean',
        size: 'medium'
      },
      { 
        name: 'Large - Beef', 
        price: 17.99, 
        description: '1 large beef burrito with extra filling, rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 17.99, 
        description: '1 large chicken burrito with extra filling, rice and beans',
        protein: 'chicken',
        size: 'large'
      },
      { 
        name: 'Large - Bean', 
        price: 16.99, 
        description: '1 large bean burrito with extra filling, rice and beans',
        protein: 'bean',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },
  {
    id: 'combo-tamale',
    name: 'Tamale Combo',
    description: 'Homemade tamale with your choice of protein',
    price: 14.99, // Base price for Medium Beef
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Beef', 
        price: 14.99, 
        description: '2 beef tamales with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 14.99, 
        description: '2 chicken tamales with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Medium - Bean', 
        price: 13.99, 
        description: '2 bean tamales with rice and beans',
        protein: 'bean',
        size: 'medium'
      },
      { 
        name: 'Large - Beef', 
        price: 17.99, 
        description: '3 beef tamales with rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 17.99, 
        description: '3 chicken tamales with rice and beans',
        protein: 'chicken',
        size: 'large'
      },
      { 
        name: 'Large - Bean', 
        price: 16.99, 
        description: '3 bean tamales with rice and beans',
        protein: 'bean',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },
  {
    id: 'combo-chile-relleno',
    name: 'Chile Relleno Combo',
    description: 'Stuffed chile relleno with cheese, add meat for $1.50',
    price: 14.99, // Base price for Medium Cheese
    image: 'https://images.unsplash.com/photo-1639666824523-8f7f7c7a8f3d',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Cheese', 
        price: 14.99, 
        description: '1 cheese chile relleno with rice and beans',
        protein: 'cheese',
        size: 'medium'
      },
      { 
        name: 'Medium - Beef', 
        price: 16.49, 
        description: '1 beef chile relleno with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 16.49, 
        description: '1 chicken chile relleno with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Large - Cheese', 
        price: 17.99, 
        description: '2 cheese chile rellenos with rice and beans',
        protein: 'cheese',
        size: 'large'
      },
      { 
        name: 'Large - Beef', 
        price: 18.99, 
        description: '2 beef chile rellenos with rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 18.99, 
        description: '2 chicken chile rellenos with rice and beans',
        protein: 'chicken',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },
  {
    id: 'combo-tostada',
    name: 'Tostada Combo',
    description: 'Crispy tostada with your choice of protein',
    price: 14.99, // Base price for Medium Beef
    image: 'https://images.unsplash.com/photo-1572457283-9a7c8d8f8e8d7',
    category: 'combos',
    variants: [
      { 
        name: 'Medium - Beef', 
        price: 14.99, 
        description: '1 beef tostada with rice and beans',
        protein: 'beef',
        size: 'medium'
      },
      { 
        name: 'Medium - Chicken', 
        price: 14.99, 
        description: '1 chicken tostada with rice and beans',
        protein: 'chicken',
        size: 'medium'
      },
      { 
        name: 'Medium - Bean', 
        price: 13.99, 
        description: '1 bean tostada with rice and beans',
        protein: 'bean',
        size: 'medium'
      },
      { 
        name: 'Large - Beef', 
        price: 17.99, 
        description: '2 beef tostadas with rice and beans',
        protein: 'beef',
        size: 'large'
      },
      { 
        name: 'Large - Chicken', 
        price: 17.99, 
        description: '2 chicken tostadas with rice and beans',
        protein: 'chicken',
        size: 'large'
      },
      { 
        name: 'Large - Bean', 
        price: 16.99, 
        description: '2 bean tostadas with rice and beans',
        protein: 'bean',
        size: 'large'
      }
    ],
    defaultSpiceLevel: 'medium'
  },

  // Burritos
  {
    id: 'deluxe-bean-cheese-burrito',
    name: 'Deluxe Bean and Cheese Burrito',
    description: 'Three chicken enchiladas covered in red sauce and melted cheese',
    price: 9.49,
    image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615',
    category: 'burritos',
    spicyLevel: 1,
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
    id: 'skinny-fajitas,',
    name: 'Skinny Fajitas',
    description: 'Grilled chicken or steak with peppers and onions, served with lettuce wraps',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'chicken-fajitas,',
    name: 'Chicken Fajitas',
    description: 'Grilled chicken with peppers and onions served with tortillas',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'steak-fajitas,',
    name: 'Steak Fajitas',
    description: 'Grilled steak with peppers and onions, served with lettuce wraps',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'fajita-salad,',
    name: 'Fajita Salad',
    description: 'Grilled chicken or steak with peppers and onions, served with lettuce wraps',
    price: 14.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'fajitas-three-amigos,',
    name: 'Fajitas Three Amigos',
    description: 'Grilled chicken or steak with peppers and onions, served with lettuce wraps',
    price: 26.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'chicken-steak-fajitas,',
    name: 'Chicken y Steak Fajitas Combo',
    description: 'Grilled chicken or steak with peppers and onions, served with lettuce wraps',
    price: 23.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
   {
    id: 'shrimp-fajitas,',
    name: 'Skinny Fajitas',
    description: 'Grilled chicken or steak with peppers and onions, served with lettuce wraps',
    price: 20.49,
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
  
  //dinner specials
  {
    id: 'sopapilla',
    name: 'Sopapilla (House Special)',
    description: 'Beef, Chicken or Carnitas',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'michis-special',
    name: 'Michis Special',
    description: 'Two stuffed chiles garnished with rice and CRISPY beans accompanied by tortillas',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops',
    description: 'Smothered in green chile with side of rice and beans',
    price: 18.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'carne-asada',
    name: 'Carne Asada                   ',
    description: 'Smothered in green chile with side of rice and beans',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'carnitas-plate',
    name: 'Carnitas Plate',
    description: '',
    price: 17.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'los-tamales-plate',
    name: 'Los Tamales Plate',
    description: '2 Tamales, Rice, Beans, and green chile',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'jalisco-plate',
    name: 'Jalisco Plate',
    description: 'Comes with carne asada choice of chile relleno tamal or enchilada rice and beans',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'spinach-quesadilla',
    name: 'Spinach Quesadilla',
    description: 'Comes with sour cream, rice and beans',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'los-amigos',
    name: 'Los Amigos',
    description: '2 Soft Chile Rellenos with a side of rice and beans accompanied b tortillas',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'fish-tacos',
    name: 'Fish Tacos',
    description: 'Beef, Chicken or Carnitas',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'la-tampiquena',
    name: 'La Tampiquena',
    description: 'Carne asada served with a side of beans along with enchilada smothered in mole sauce',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'sopitos',
    name: 'Sopitos',
    description: 'Beef or Chicken',
    price: 14.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'costillas',
    name: 'Costillas (Pork)',
    description: 'Rice, Beans, Tortillas, and green chile',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'tacos-al-pastor',
    name: 'Tacos Al Pastor',
    description: '',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'pollo-plancha',
    name: 'Pollo a la Plancha',
    description: 'Corn or Flour Tortillas',
    price: 18.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'tacos-carbon',
    name: 'Tacos al Carbon',
    description: '',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'chicken-mole',
    name: 'Chicken Mole',
    description: 'Flour or Corn Tortillas',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'flauta-plate',
    name: 'Flauta Plate',
    description: '3 Flautas with rice, beans, lettuce, tomatoes, sour cream, beef, chicken, carnitas ',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'pork-chile-verde',
    name: 'Pork Chile Verde',
    description: '',
    price: 18.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  
  //enchiladas
  {
    id: 'cheese-dip-enchiladas',
    name: 'Cheese Dip Enchiladas',
    description: '2 Enchiladas side of rice and beans and your choice of Beef, Chicken, or Cheese',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  {
    id: 'spinach-enchiladas',
    name: 'Spinach Enchiladas',
    description: '2 Enchiladas with a side of rice and beans',
    price: 11.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  {
    id: 'las-comadres',
    name: 'Los Comadres',
    description: '3 Enchiladas bathed in sauce, one red, one with green chile and the other with tomatillo, accompanied by rice and beans with sour cream. Beef, Chicke, or Cheese.',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  {
    id: 'enchiladas-suizas',
    name: 'Enchiladas Suizas',
    description: '2 Enchiladas somthered in green sause, sour cream, rice and beans. Beef, Chicken, Or Cheese',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  {
    id: 'mole-enchiladas',
    name: 'Mole Enchiladas',
    description: ' Beef, Chicken, or Cheese',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  
  //chimichangas
  {
    id: 'chimichanga',
    name: 'Chimichanga',
    description: 'Comes with Rice and Beans. Choice of Beef, Chicken, or Carnitas',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'chimichangas',
  },
  {
    id: 'cheesedip-chimichanga',
    name: 'Cheese Dip Chimichanga',
    description: 'Comes with Rice and Beans. Choice of Beef, Chicken, or Carnitas',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'chimichangas',
  },

  //breakfast meals
  {
    id: 'berthoud-plate',
    name: 'Berthoud Plate',
    description: 'Traditional Mexican caramel custard',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-quesadilla',
    name: 'Breakfast Quesadilla',
    description: 'Traditional Mexican caramel custard',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'casita-enchiladas',
    name: 'Casita Enchiladas',
    description: 'Traditional Mexican caramel custard',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-chimichanga',
    name: 'Breakfast Chimichanga',
    description: 'Traditional Mexican caramel custard',
    price: 14.75,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'chilaquiles',
    name: 'Chilaquiles',
    description: 'Traditional Mexican caramel custard',
    price: 14.75,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-racheros',
    name: 'Huevos Racheros',
    description: 'Traditional Mexican caramel custard',
    price: 13.00,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-conchroizo',
    name: 'Huevos Con Chroizo',
    description: 'Traditional Mexican caramel custard',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'machaca-con-huevo',
    name: 'Machaca Con Huevo',
    description: 'Traditional Mexican caramel custard',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'vickeys-special',
    name: 'Vickeys Special',
    description: 'Two pork chops, two eggs, beans smothered in green chile. With a side of tortillas',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
  {
    id: 'colorado-special',
    name: 'Colorado Special',
    description: 'Chilaquiles, eggs and steak',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
    category: 'breakfast-meals',
  },
//soups
{
  id: 'menudo',
  name: 'Menudo',
  description: 'Homemade recipe alongside your choise of 4 Flour or Corn Tortillas',
  price: 15.49,
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'soups',
},
{
  id: 'pozole',
  name: 'Pozole',
  description: 'Homemade recipe alongside your choise of 4 Flour or Corn Tortillas',
  price: 15.49,
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'soups',
},
{
  id: 'ramen-birria',
  name: 'Ramen Birria',
  description: 'Ramen Noodle soup with birria',
  price: 19.49,
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'soups',
},
{
  id: 'sopa-de-papa',
  name: 'Sopa de Papa',
  description: 'Comes with Potatoes, Bacon, and Cheese',
  price: 14.49,
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'soups',
},

//breakfast burritos
{
  id: 'potato-egg-cheese-burrito',
  name: 'Potato Egg and Cheese Burrito',
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'egg-cheese-meat-burrito',
  name: 'Egg and Cheese Meat Burrito',
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'egg-cheese-burrito',
  name: `Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 5.45,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.45,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'potato-bacon-egg-cheese-burrito',
  name: `Potato Bacon Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'chorizo-potato-egg-cheese-burrito',
  name: `Chorizo Potato Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'sausage-potato-egg-cheese-burrito',
  name: `Sausage Potato Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'ham-potato-egg-cheese-burrito',
  name: `Ham Potato Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 4.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'steak-potato-egg-cheese-burrito',
  name: `Steak Potato Egg and Cheese Burrito`,
  description: 'Choose your style and spice level',
  price: 8.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 8.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 10.49,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'machaca-burrito',
  name: `Machaca Burrito`,
  description: 'Choose your style and spice level',
  price: 4.75, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 7.75,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 9.50,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
{
  id: 'breakfast-cripsy',
  name: `Breakfast Crispy`,
  description: 'Choose your style and spice level',
  price: 9.49, // Base price (will be overridden by variants)
  image: 'https://images.unsplash.com/photo-1552689486-f6773047d19f',
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Wrap',
      price: 9.49,
      description: 'Standard size burrito'
    },
    {
      name: 'Deluxe',
      price: 11.49,
      description: 'Larger size with extra fillings'
    }
  ],
  defaultSpiceLevel: 'medium'
},
];
