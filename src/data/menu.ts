// Removed spice levels as requested
export const STYLE_TYPES = ['Beef', 'Chicken', 'Bean'] as const;
export type StyleType = typeof STYLE_TYPES[number];

export interface MenuItemVariant {
  name: string;
  price: number;
  description?: string;
  protein?: 'beef' | 'chicken' | 'bean' | 'cheese';
  size?: 'small' | 'medium' | 'large';
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra hot';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // Base price (for items without variants)
  image?: string; // Optional image URL
  category: string;
  popular?: boolean;
  variants?: MenuItemVariant[]; // For items with variants (like wrap vs deluxe)
  specialRequest?: string; // Added special request field
  spicyLevel?: number; // Spice level indicator (1-5)
  locations?: string[]; // Array of locations where this item is available
}

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  color?: string;
};

export const categories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    emoji: '🥨',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'breakfast-burritos',
    name: 'Breakfast Burritos',
    description: 'Start your day with our delicious breakfast burritos',
    emoji: '🌯',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'breakfast-meals',
    name: 'Breakfast Meals',
    description: 'Start your day with our delicious breakfast meals',
    emoji: '🍳',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'soups',
    name: 'Soups',
    description: 'Warm and comforting soups made with fresh ingredients',
    emoji: '🍲',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'tacos',
    name: 'Tacos',
    description: 'Traditional Mexican tacos with your choice of meat',
    emoji: '🌮',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'tostadas',
    name: 'Tostadas',
    description: 'Traditional Tostadas with your choice of meat',
    emoji: '🥙',
    color: 'from-orange-500 to-red-600',
  },
    {
    id: 'salads',
    name: 'Salads',
    description: 'Fresh salads with a variety of toppings, served with rice,beans,pico de gallo, cheese and sour cream',
    emoji: '🥗',
    color: 'from-green-300 to-green-500',
  },
    {
    id: 'medium-combos',
    name: 'Medium Combos',
    description: 'Medium combo meals with your choice of items - no repeats allowed',
    emoji: '🍽️',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'large-combos',
    name: 'Large Combos',
    description: 'Large combo meals with your choice of items - no repeats allowed',
    emoji: '🍛',
    color: 'from-purple-500 to-purple-700',
  },
  {
    id: 'burritos',
    name: 'Burritos',
    description: 'Large flour tortillas filled with your favorite ingredients',
    emoji: '🌯',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'fajitas',
    name: 'Fajitas',
    description: 'Grilled meat with peppers and onions, served with tortillas',
    emoji: '🥘',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'dinner-specials',
    name: 'Dinner Specials',
    description: 'Grilled meat with peppers and onions, served with tortillas',
    emoji: '⭐',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'enchiladas',
    name: 'Enchiladas',
    description: 'Corn tortillas rolled around a filling and covered with sauce',
    emoji: '🫔',
    color: 'from-red-500 to-red-700',
  },
  {
    id: 'chimichangas',
    name: 'Chimichangas',
    description: 'Deep-fried burritos filled with your choice of meat',
    emoji: '🌯',
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 'kids',
    name: 'Kids Menu',
    description: 'Special meals for our 12 & younger guests',
    emoji: '🧒',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Perfect accompaniments to your meal',
    emoji: '🍚',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'tortas-y-hamburguesas',
    name: 'Tortas y Hamburguesas',
    description: 'Mexican sandwiches and burgers with a twist',
    emoji: '🍔',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Refreshing beverages and cocktails',
    emoji: '🥤',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    emoji: '🍰',
    color: 'from-pink-300 to-pink-500',
  },
];

export const comboOptions = [
  { id: 'taco', name: 'Taco' },
  { id: 'enchilada', name: 'Enchilada' },
  { id: 'tamal', name: 'Tamal' },
  { id: 'tostada', name: 'Tostada' },
  { id: 'chile_relleno', name: 'Chile Relleno' },
  { id: 'burrito', name: 'Burrito' }
];

export const meatOptions = [
  { id: 'beef', name: 'Beef' },
  { id: 'chicken', name: 'Chicken' },
  { id: 'bean', name: 'Bean' },
  { id: 'cheese', name: 'Cheese' }
];

export const menuItems: MenuItem[] = [
  {
    id: 'beef-taco',
    name: 'Beef Taco',
    description: 'A delicious taco filled with seasoned ground beef, lettuce, cheese, and your choice of toppings',
    price: 3.75,
    category: 'tacos',
    popular: true,
  },
   {
    id: 'chicken-taco',
    name: 'Chicken Taco',
    description: 'Tender grilled chicken in a warm tortilla with fresh toppings and our special sauce',
    price: 3.75,
    category: 'tacos',
  },
   {
    id: 'carnitas-taco',
    name: 'Carnitas Taco',
    description: 'Slow-cooked pulled pork taco with traditional Mexican flavors',
    price: 4.75,
    category: 'tacos',
  },
   {
    id: 'three-asada',
    name: '3 Tacos de Asada',
    description: 'Three grilled steak tacos with fresh cilantro, onions, and your choice of salsa',
    price: 13.75,
    category: 'tacos',
    popular: true,
  },
  {
    id: 'three-barbacoa',
    name: '3 Tacos de Barbacoa',
    description: 'Three tender, slow-cooked beef tacos with fresh onions, cilantro, and lime',
    price: 13.75,
    category: 'tacos',
  },
  {
    id: 'three-al-pastor',
    name: '3 Tacos al Pastor',
    description: 'Three marinated pork tacos with pineapple, onions, and cilantro',
    price: 13.75,
    category: 'tacos',
  },
  {
    id: 'burrito-carne-asada',
    name: 'Carne Asada Burrito',
    description: 'Large flour tortilla stuffed with grilled steak, rice, beans, cheese, and fresh guacamole',
    price: 14.99,
    category: 'burritos',
    popular: true,
  },
    {
    id: 'bean-guacamole-tostada',
    name: 'Bean and Guacamole Tostada',
    description: 'Crispy corn tortilla topped with refried beans, fresh guacamole, lettuce, and cheese',
    price: 6.75,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'chicken-tostada',
    name: 'Chicken Tostada',
    description: 'Crispy corn tortilla topped with shredded chicken, refried beans, lettuce, cheese, and sour cream',
    price: 5.95,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'beef-tostada',
    name: 'Beef Tostada',
    description: 'Crispy corn tortilla layered with seasoned ground beef, refried beans, lettuce, tomatoes, and cheese',
    price: 6.25,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'guacamole-tostada',
    name: 'Guacamole Tostada',
    description: 'Crispy corn tortilla topped with fresh guacamole, lettuce, tomatoes, and queso fresco',
    price: 7.45,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'bean-tostada',
    name: 'Bean Tostada',
    description: 'Crispy corn tortilla with a layer of refried beans, lettuce, cheese, and your choice of toppings',
    price: 4.25,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'indian-taco',
    name: 'Indian Taco',
    description: 'Crispy fry bread topped with your choice of beef, chicken, or carnitas, smothered in green chile, beans, lettuce, tomatoes, and cheese',
    price: 13.49,
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'nacho-fans',
    name: 'Nacho Fans',
    description: 'Crispy tortilla chips loaded with melted cheese, your choice of chicken or beef, jalapeños, and all the fixings. Add steak for $2.00',
    price: 13.49,
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'chili-cheese-fries',
    name: 'Chili Cheese Fries',
    description: 'Crispy golden fries smothered in our homemade chili, melted cheese, and green onions. Add any meat for $2.00',
    price: 10.75,
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'cheese-dip-small',
    name: 'Cheese Dip (Small)',
    description: 'Creamy, melted cheese dip served with warm tortilla chips. Add chicken or beef for an extra charge',
    price: 6.49,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'cheese-dip-large',
    name: 'Cheese Dip (Large)',
    description: 'Our famous creamy cheese dip, perfect for sharing. Served with a generous portion of tortilla chips',
    price: 8.49,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'mexican-taquitos',
    name: 'Mexican Taquitos',
    description: 'Crispy rolled corn tortillas filled with your choice of shredded chicken or seasoned beef, served with guacamole and sour cream',
    price: 12.75,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'quesadilla',
    name: 'Quesadilla',
    description: 'Flour tortilla stuffed with melted cheese and your choice of chicken or beef, served with sour cream, guacamole, and pico de gallo',
    price: 12.49,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'shrimp-quesadilla',
    name: 'Shrimp Quesadilla',
    description: 'Flour tortilla filled with sautéed shrimp, melted cheese, and a blend of peppers and onions. Served with sour cream and guacamole',
    price: 15.75,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'pizza-birria',
    name: 'Pizza Birria',
    description: 'A delicious fusion of birria and pizza, featuring our slow-cooked birria meat, melted cheese, and our special sauce on a crispy crust',
    price: 20.49,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'queso-fundido',
    name: 'Queso Fundido',
    description: 'A sizzling skillet of melted cheese with chorizo, poblano peppers, and onions. Served with warm corn or flour tortillas',
    price: 14.49,
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'steak-bowl',
    name: 'Steak Bowl',
    description: 'Grilled steak served over cilantro-lime rice with black beans, corn, pico de gallo, guacamole, and queso fresco',
    price: 15.49,
    category: 'salads',
    popular: true,
  },
     {
    id: 'shrimp-bowl',
    name: 'Shrimp Bowl',
    description: 'Sautéed shrimp served over cilantro-lime rice with black beans, corn, pico de gallo, and avocado crema',
    price: 16.49,
    category: 'salads',
    popular: true,
  },
     {
    id: 'taco-salad',
    name: 'Taco Salad',
    description: 'Crispy flour tortilla bowl filled with fresh lettuce, your choice of protein, black beans, corn, cheese, and all your favorite taco toppings',
    price: 10.75,
    category: 'salads',
    popular: true,
  },
     {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets',
    description: 'Crispy breaded chicken nuggets served with a side of fries and your choice of dipping sauce',
    price: 7.49,
    category: 'kids',
    popular: true,
  },
      {
    id: 'quesadilla-kids',
    name: 'Quesadilla (Kids)',
    description: 'Small flour tortilla with melted cheese and your choice of chicken or beef, served with a side of rice and beans',
    price: 7.49,
    category: 'kids',
    popular: true,
  },
      {
    id: 'taco-kids',
    name: 'Taco (Kids)',
    description: 'One soft or hard shell taco with your choice of meat, cheese, and lettuce. Served with a side of rice and beans',
    price: 7.49,
    category: 'kids',
    popular: true,
  },
      {
    id: 'bean-cheese-burrito',
    name: 'Bean and Cheese Burrito (Kids)',
    description: 'Warm flour tortilla filled with refried beans and melted cheese. Served with a side of rice and chips',
    price: 7.49,
    category: 'kids',
    popular: true,
  },
      {
    id: 'sopapillas',
    name: 'Sopapillas',
    description: 'Light and fluffy fried pastries dusted with cinnamon sugar, served with honey for drizzling',
    price: 6.49,
    category: 'desserts',
    popular: true,
  },
        {
    id: 'fried-ice-cream',
    name: 'Fried Ice Cream',
    description: 'Vanilla ice cream coated in a crispy cinnamon-sugar crust, quickly fried to golden perfection. Served with whipped cream and a cherry',
    price: 6.75,
    category: 'desserts',
    popular: true,
  },
        {
    id: 'cheesecake-chimichanga',
    name: 'Cheesecake Chimichanga',
    description: 'Creamy cheesecake filling wrapped in a flour tortilla, lightly fried, and dusted with powdered sugar and cinnamon. Served with strawberry sauce',
    price: 8.49,
    category: 'desserts',
    popular: true,
  },
        {
    id: 'churros',
    name: 'Churros',
    description: 'Golden fried pastry sticks rolled in cinnamon sugar, served with warm chocolate and caramel dipping sauces',
    price: 6.45,
    category: 'desserts',
    popular: true,
  },
        {
    id: 'crispy-relleno',
    name: 'Crispy Relleno',
    description: 'Crispy breaded chile relleno stuffed with cheese, lightly fried to perfection',
    price: 5.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'soft-relleno',
    name: 'Soft Relleno',
    description: 'Mild green chile stuffed with cheese, lightly battered and served with red or green chile sauce',
    price: 6.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'rice',
    name: 'Spanish Rice',
    description: 'Traditional Mexican-style rice cooked with tomatoes, onions, and garlic',
    price: 3.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'guacamole',
    name: 'Guacamole',
    description: 'Freshly made with ripe avocados, tomatoes, onions, cilantro, and lime juice. Served with warm tortilla chips',
    price: 6.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'sour-cream',
    name: 'Sour Cream',
    description: 'Cool and creamy topping for your favorite Mexican dishes',
    price: 2.50,
    category: 'sides',
    popular: true,
  },
          {
    id: 'toreados',
    name: 'Chiles Toreados (3)',
    description: 'Pan-seared jalapeños with onions, cooked in a savory sauce with lime and spices',
    price: 2.00,
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-salsa',
    name: 'Chips and Salsa',
    description: 'Freshly made tortilla chips served with our house-made tomato salsa',
    price: 8.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-guacamole',
    name: 'Chips and Guacamole',
    description: 'Crispy tortilla chips served with our fresh, hand-mashed guacamole made with ripe avocados',
    price: 10.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'beans',
    name: 'Refried Beans',
    description: 'Creamy, slow-cooked pinto beans, mashed and lightly fried with traditional seasonings',
    price: 3.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'chicharron',
    name: 'Chicharron',
    description: 'Crispy fried pork rinds, perfect for dipping in guacamole or salsa',
    price: 5.25,
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-8oz',
    name: 'Green Chile (8 oz)',
    description: 'Our signature roasted green chile sauce, medium spice level',
    price: 5.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-16oz',
    name: 'Green Chile (16 oz)',
    description: 'A larger portion of our signature roasted green chile sauce, perfect for sharing',
    price: 9.25,
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-32oz',
    name: 'Green Chile (32 oz)',
    description: 'Family-sized portion of our signature roasted green chile sauce',
    price: 14.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'tortillas-4',
    name: 'Tortillas (4)',
    description: 'Warm flour tortillas, made fresh daily',
    price: 2.50,
    category: 'sides',
    popular: true,
  },
          {
    id: 'potatoes',
    name: 'Mexican Potatoes',
    description: 'Diced potatoes seasoned with Mexican spices and roasted until golden brown',
    price: 3.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden fries, lightly salted and served hot',
    price: 4.75,
    category: 'sides',
    popular: true,
  },
          {
    id: 'plain-tamal',
    name: 'Plain Tamal',
    description: 'Traditional Mexican tamal made with masa and steamed in a corn husk',
    price: 4.00,
    category: 'sides',
    popular: true,
  },
          {
    id: 'smothered-tamal',
    name: 'Smothered Tamal',
    description: 'Traditional tamal smothered in our signature red or green chile sauce and melted cheese',
    price: 5.49,
    category: 'sides',
    popular: true,
  },
          {
    id: 'torta-steak',
    name: 'Torta Steak',
    description: 'Grilled steak served on toasted bolillo bread with refried beans, avocado, lettuce, tomato, and mayonnaise',
    price: 15.49,
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-carnitas',
    name: 'Torta Carnitas',
    description: 'Tender braised pork served on toasted bolillo bread with refried beans, avocado, and pickled jalapeños',
    price: 15.49,
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-barbacoa',
    name: 'Torta Barbacoa',
    description: 'Slow-cooked barbacoa beef served on toasted bolillo bread with refried beans, avocado, and pickled onions',
    price: 15.49,
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-pastor',
    name: 'Torta Pastor',
    description: 'Marinated pork al pastor with grilled pineapple, served on toasted bolillo bread with refried beans and avocado',
    price: 15.49,
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'cheese-burger',
    name: 'Cheeseburger',
    description: 'Classic cheeseburger with American cheese, lettuce, tomato, onion, pickles, and our special sauce on a toasted bun',
    price: 10.49,
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'hamburger',
    name: 'Hamburger',
    description: 'Juicy beef patty with lettuce, tomato, onion, pickles, ketchup, and mustard on a toasted bun',
    price: 8.45,
    category: 'tortas-y-hamburguesas',
  },
            {
    id: 'mexican-hamburger',
    name: 'Mexican Hamburger',
    description: 'Beef patty topped with green chile, cheese, and served with lettuce, tomato, and onions on a toasted bun',
    price: 13.49,
    category: 'tortas-y-hamburguesas',
  },
  // Combos
 
    // Special request field already added to MenuItem interface

  // Burritos
  {
    id: 'deluxe-bean-cheese-burrito',
    name: 'Deluxe Bean and Cheese Burrito',
    description: 'Large flour tortilla stuffed with refried beans, melted cheese, and our special sauce, topped with enchilada sauce and more cheese, then baked to perfection',
    price: 9.49,
    category: 'burritos',
    // Special request field handles customizations
  },
  {
    id: 'enchiladas-rojas',
    name: 'Enchiladas Rojas',
    description: 'Three corn tortillas filled with your choice of protein, rolled and smothered in our homemade red chile sauce and melted cheese',
    price: 13.99,
    category: 'enchiladas',
    // Special request field handles customizations
  },
  {
    id: 'skinny-fajitas',
    name: 'Skinny Fajitas',
    description: 'Sizzling grilled chicken or steak with bell peppers and onions, served with crisp lettuce wraps and fresh pico de gallo',
    price: 19.99,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'chicken-fajitas',
    name: 'Chicken Fajitas',
    description: 'Sizzling platter of marinated grilled chicken with sautéed bell peppers and onions, served with warm flour tortillas and traditional sides',
    price: 20.49,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'steak-fajitas',
    name: 'Steak Fajitas',
    description: 'Tender grilled steak strips with caramelized onions and bell peppers, served with warm flour tortillas and all the fixings',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'fajita-salad',
    name: 'Fajita Salad',
    description: 'Fresh mixed greens topped with sizzling fajita meat, sautéed peppers and onions, pico de gallo, avocado, and drizzled with our house lime vinaigrette',
    price: 14.49,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'fajitas-three-amigos',
    name: 'Fajitas Three Amigos',
    description: 'A sizzling platter featuring three types of meat (chicken, steak, and shrimp) with bell peppers and onions, served with warm flour tortillas and all the fixings - perfect for sharing',
    price: 26.49,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'chicken-steak-fajitas',
    name: 'Chicken y Steak Fajitas Combo',
    description: 'The best of both worlds - tender grilled chicken and steak strips with sautéed bell peppers and onions, served with warm flour tortillas and traditional sides',
    price: 23.49,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'shrimp-fajitas',
    name: 'Shrimp Fajitas',
    description: 'Jumbo shrimp sautéed with bell peppers and onions in our special garlic butter sauce, served sizzling with warm tortillas and traditional sides',
    price: 20.49,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'margarita',
    name: 'House Margarita',
    description: 'Our signature margarita made with premium tequila, fresh lime juice, and orange liqueur, served on the rocks with a salted rim',
    price: 8.99,
    category: 'drinks',
  },
  {
    id: 'flan',
    name: 'Flan',
    description: 'Classic Mexican custard dessert with a rich caramel sauce, made fresh daily with eggs, milk, and vanilla',
    price: 6.99,
    category: 'desserts',
  },
  
  //dinner specials
  {
    id: 'sopapilla',
    name: 'Sopapilla (House Special)',
    description: 'Golden-fried pastry puffs drizzled with honey and dusted with cinnamon sugar, served warm with a side of vanilla ice cream',
    price: 6.49,
    category: 'desserts',
  },
  {
    id: 'michis-special',
    name: 'Michis Special',
    description: 'Two roasted poblano peppers stuffed with seasoned ground beef and melted cheese, topped with our house ranchera sauce, served with Spanish rice and crispy refried beans',
    price: 15.49,
    category: 'dinner-specials',
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops a la Mexicana',
    description: 'Two thick-cut, bone-in pork chops smothered in our homemade green chile sauce, served with Spanish rice and refried beans',
    price: 18.49,
    category: 'dinner-specials',
  },
  {
    id: 'carne-asada',
    name: 'Carne Asada',
    description: 'Grilled, marinated skirt steak served with charro beans, Spanish rice, grilled onions, bell peppers, and warm flour tortillas',
    price: 19.49,
    category: 'dinner-specials',
  },
  {
    id: 'carnitas-plate',
    name: 'Carnitas Plate',
    description: 'Tender, slow-braised pork carnitas served with fresh pico de gallo, guacamole, refried beans, and warm corn tortillas',
    price: 17.49,
    category: 'dinner-specials',
  },
  {
    id: 'los-tamales-plate',
    name: 'Los Tamales Plate',
    description: 'Two homemade tamales (choice of chicken, pork, or cheese) smothered in green chile sauce, served with Spanish rice and refried beans',
    price: 15.49,
    category: 'dinner-specials',
  },
  {
    id: 'jalisco-plate',
    name: 'Jalisco Plate',
    description: 'Tender carne asada served with your choice of chile relleno, tamal, or cheese enchilada, accompanied by Spanish rice and refried beans',
    price: 20.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'spinach-quesadilla',
    name: 'Spinach Quesadilla',
    description: 'Flour tortilla filled with sautéed spinach, mushrooms, onions, and melted cheese blend, served with sour cream, Spanish rice, and refried beans',
    price: 13.49,
    category: 'dinner-specials',
  },
  {
    id: 'los-amigos',
    name: 'Los Amigos',
    description: 'Two tender chile rellenos stuffed with cheese and topped with our house ranchera sauce, served with Spanish rice, refried beans, and warm corn tortillas',
    price: 16.49,
    category: 'dinner-specials',
  },
  {
    id: 'fish-tacos',
    name: 'Fish Tacos',
    description: 'Three soft corn tortillas filled with beer-battered cod, shredded cabbage, pico de gallo, and drizzled with our creamy chipotle sauce, served with lime wedges',
    price: 16.49,
    category: 'dinner-specials',
  },
  {
    id: 'la-tampiquena',
    name: 'La Tampiqueña',
    description: 'Tender grilled skirt steak served with a cheese enchilada smothered in our rich mole sauce, refried beans, and grilled nopalitos',
    price: 20.49,
    category: 'dinner-specials',
  },
  {
    id: 'sopitos',
    name: 'Sopitos',
    description: 'Crispy corn masa cakes topped with your choice of shredded beef or chicken, refried beans, lettuce, tomatoes, cheese, and crema',
    price: 14.49,
    category: 'dinner-specials',
  },
  {
    id: 'costillas',
    name: 'Costillas de Puerco',
    description: 'Tender pork ribs slow-cooked in our special sauce, served with Spanish rice, refried beans, warm tortillas, and a side of green chile',
    price: 20.49,
    category: 'dinner-specials',
  },
  {
    id: 'tacos-al-pastor',
    name: 'Tacos Al Pastor',
    description: 'Three corn tortillas filled with marinated pork cooked on a vertical spit, topped with fresh pineapple, onions, and cilantro, served with lime wedges',
    price: 19.49,
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'pollo-plancha',
    name: 'Pollo a la Plancha',
    description: 'Grilled chicken breast marinated in citrus and spices, served with Spanish rice, refried beans, and your choice of warm corn or flour tortillas',
    price: 18.49,
    category: 'dinner-specials',
  },
  {
    id: 'tacos-carbon',
    name: 'Tacos al Carbón',
    description: 'Three grilled steak tacos with caramelized onions, fresh cilantro, and your choice of salsa, served with charro beans and lime wedges',
    price: 19.49,
    category: 'dinner-specials',
  },
  {
    id: 'chicken-mole',
    name: 'Pollo en Mole',
    description: 'Tender chicken smothered in our house-made mole sauce, a rich blend of chocolate, chiles, and spices, served with Spanish rice and warm corn or flour tortillas',
    price: 19.49,
    category: 'dinner-specials',
  },
  {
    id: 'flauta-plate',
    name: 'Flauta Plate',
    description: 'Three crispy rolled corn tortillas filled with your choice of shredded beef, chicken, or carnitas, topped with lettuce, tomatoes, sour cream, and guacamole, served with rice and beans',
    price: 15.49,
    category: 'dinner-specials',
  },
  {
    id: 'pork-chile-verde',
    name: 'Chile Verde',
    description: 'Tender chunks of pork slow-cooked in our homemade green chile tomatillo sauce, served with Spanish rice, refried beans, and warm tortillas',
    price: 18.49,
    category: 'dinner-specials',
  },
  
  //enchiladas
  {
    id: 'cheese-dip-enchiladas',
    name: 'Cheese Dip Enchiladas',
    description: 'Two cheese enchiladas smothered in our creamy cheese dip, served with Spanish rice and refried beans. Choose your filling: ground beef, shredded chicken, or cheese',
    price: 15.49,
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
    id: 'los-comadres',
    name: 'Los Comadres',
    description: 'Three enchiladas, each with a different sauce: red chile, green chile, and tomatillo, topped with melted cheese, served with Spanish rice, refried beans, and sour cream. Choose your filling: beef, chicken, or cheese',
    price: 19.49,
    category: 'enchiladas',
  },
  {
    id: 'enchiladas-suizas',
    name: 'Enchiladas Suizas',
    description: 'Two enchiladas filled with shredded chicken, topped with our creamy tomatillo sauce and melted cheese, served with Spanish rice and refried beans',
    price: 16.49,
    category: 'enchiladas',
  },
  {
    id: 'mole-enchiladas',
    name: 'Enchiladas de Mole',
    description: 'Three corn tortillas filled with your choice of shredded chicken or cheese, smothered in our rich, house-made mole sauce, served with Spanish rice and refried beans',
    price: 16.49,
    category: 'enchiladas',
  },
  
  //chimichangas
  {
    id: 'chimichanga',
    name: 'Chimichanga',
    description: 'Crispy deep-fried burrito filled with your choice of seasoned ground beef, shredded chicken, or tender carnitas, topped with cheese and served with Spanish rice, refried beans, lettuce, tomato, sour cream, and guacamole',
    price: 15.49,
    category: 'chimichangas',
  },
  {
    id: 'cheesedip-chimichanga',
    name: 'Cheese Dip Chimichanga',
    description: 'Our signature chimichanga smothered in warm cheese dip, served with Spanish rice and refried beans. Choose your filling: ground beef, shredded chicken, or carnitas',
    price: 16.49,
    category: 'chimichangas',
  },

  //breakfast meals
  {
    id: 'berthoud-plate',
    name: 'Berthoud Plate',
    description: 'A hearty breakfast featuring two eggs any style, your choice of bacon or sausage, hash browns or breakfast potatoes, and toast or tortillas',
    price: 12.99,
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-quesadilla',
    name: 'Breakfast Quesadilla',
    description: 'Fluffy scrambled eggs with your choice of bacon, sausage, or chorizo, served with hash browns or breakfast potatoes and toast or tortillas',
    price: 12.49,
    category: 'breakfast-meals',
  },
  {
    id: 'casita-enchiladas',
    name: 'Casita Enchiladas',
    description: 'Two cheese enchiladas topped with red or green chile sauce, served with two eggs any style, breakfast potatoes, and refried beans',
    price: 14.99,
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-chimichanga',
    name: 'Breakfast Chimichanga',
    description: 'A crispy flour tortilla filled with scrambled eggs, cheese, and your choice of bacon, sausage, or chorizo, topped with sour cream and guacamole, served with breakfast potatoes',
    price: 14.75,
    category: 'breakfast-meals',
  },
  {
    id: 'chilaquiles',
    name: 'Chilaquiles',
    description: 'Crispy corn tortilla chips simmered in red or green chile sauce, topped with two eggs any style, queso fresco, crema, and onions. Served with refried beans and breakfast potatoes',
    price: 13.99,
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-rancheros',
    name: 'Huevos Rancheros',
    description: 'Two corn tortillas topped with refried beans, two eggs any style, and smothered in our homemade ranchera sauce, served with breakfast potatoes',
    price: 13.00,
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-con-chorizo',
    name: 'Huevos con Chorizo',
    description: 'Scrambled eggs with spicy Mexican chorizo, served with refried beans, breakfast potatoes, and warm corn or flour tortillas',
    price: 12.99,
    category: 'breakfast-meals',
  },
  {
    id: 'machaca-con-huevo',
    name: 'Machaca con Huevo',
    description: 'Shredded beef scrambled with eggs, onions, tomatoes, and bell peppers, served with refried beans, breakfast potatoes, and warm flour tortillas',
    price: 14.49,
    category: 'breakfast-meals',
  },
  {
    id: 'vickeys-special',
    name: 'Vickeys Special',
    description: 'Two pork chops, two eggs, beans smothered in green chile. With a side of tortillas',
    price: 18.99,
    category: 'breakfast-meals',
  },
  {
    id: 'colorado-special',
    name: 'Colorado Special',
    description: 'A hearty combination of crispy chilaquiles, two eggs any style, and grilled steak strips, served with refried beans and breakfast potatoes',
    price: 20.49,
    category: 'breakfast-meals',
  },
  //soups
  {
    id: 'menudo',
    name: 'Menudo',
    description: 'Traditional Mexican tripe soup slow-cooked with hominy and red chile, served with chopped onions, cilantro, lime wedges, and your choice of warm corn or flour tortillas',
    price: 15.49,
    category: 'soups',
  },
  {
    id: 'pozole',
    name: 'Pozole Rojo',
    description: 'Hearty hominy and pork soup simmered in a rich red chile broth, garnished with shredded cabbage, radishes, onions, and served with tostadas, lime wedges, and warm tortillas',
    price: 15.49,
    category: 'soups',
  },
  {
    id: 'ramen-birria',
    name: 'Ramen Birria',
    description: 'A fusion dish featuring ramen noodles in our rich, flavorful birria broth with tender braised beef, topped with onions, cilantro, and lime wedges',
    price: 19.49,
    category: 'soups',
  },
  {
    id: 'sopa-de-papa',
    name: 'Sopa de Papa',
    description: 'Creamy potato soup topped with crispy bacon, melted cheese, and fresh cilantro, served with warm tortillas',
    price: 14.49,
    category: 'soups',
  },
  
  //breakfast burritos
  {
    id: 'potato-egg-cheese-burrito',
    name: 'Potato, Egg, and Cheese Burrito',
    description: 'Flour tortilla stuffed with crispy breakfast potatoes, scrambled eggs, and melted cheese, served with your choice of salsa and a side of refried beans',
  price: 4.75, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 4.75,
      description: 'Flour tortilla filled with scrambled eggs, crispy potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00,
      description: 'Extra-large burrito with double the filling, including extra cheese, potatoes, and eggs, served with a side of sour cream and salsa'
    }
  ],
  // Special request field handles customizations,
  popular: true
},
{
  id: 'egg-cheese-meat-burrito',
  name: 'Egg, Cheese & Meat Burrito',
  description: 'A hearty breakfast burrito with your choice of bacon, sausage, or chorizo, along with scrambled eggs, cheese, and potatoes',
  price: 5.75, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 5.75,
      description: 'Flour tortilla filled with scrambled eggs, your choice of meat, cheese, and potatoes, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.00,
      description: 'Extra-large burrito with double the filling, including extra meat, cheese, eggs, and potatoes, served with sour cream and salsa'
    }
  ],
  // Special request field handles customizations,
  popular: true
},
{
  id: 'egg-cheese-burrito',
  name: 'Egg & Cheese Burrito',
  description: 'A simple yet satisfying combination of fluffy scrambled eggs and melted cheese in a warm flour tortilla',
  price: 4.75, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 5.45,
      description: 'Flour tortilla filled with fluffy scrambled eggs, melted cheese, and your choice of salsa, served with a side of refried beans'
    },
    {
      name: 'Deluxe',
      price: 9.45,
      description: 'Extra-large burrito with double the eggs and cheese, served with sour cream, guacamole, and a side of refried beans'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'potato-bacon-egg-cheese-burrito',
  name: 'Bacon, Egg, Potato & Cheese Burrito',
  description: 'A hearty breakfast favorite featuring crispy bacon, scrambled eggs, golden potatoes, and melted cheese in a warm flour tortilla',
  price: 6.25, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 6.25,
      description: 'Flour tortilla stuffed with crispy bacon, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.50,
      description: 'Extra-large burrito with double the bacon, eggs, potatoes, and cheese, served with sour cream and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'chorizo-potato-egg-cheese-burrito',
  name: 'Chorizo, Egg, Potato & Cheese Burrito',
  description: 'Spicy Mexican chorizo mixed with scrambled eggs, crispy potatoes, and melted cheese in a warm flour tortilla',
  price: 6.50, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 6.50,
      description: 'Flour tortilla filled with spicy chorizo, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.75,
      description: 'Extra-large burrito with extra chorizo, eggs, potatoes, and cheese, topped with sour cream and guacamole'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'sausage-potato-egg-cheese-burrito',
  name: 'Sausage, Egg, Potato & Cheese Burrito',
  description: 'Savory breakfast sausage, scrambled eggs, crispy potatoes, and melted cheese wrapped in a warm flour tortilla',
  price: 6.25, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 6.25,
      description: 'Flour tortilla filled with savory breakfast sausage, scrambled eggs, crispy potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.50,
      description: 'Extra-large burrito with double the sausage, eggs, potatoes, and cheese, served with sour cream and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'ham-potato-egg-cheese-burrito',
  name: 'Ham, Egg, Potato & Cheese Burrito',
  description: 'Diced ham, scrambled eggs, golden potatoes, and melted cheese wrapped in a warm flour tortilla',
  price: 6.25, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 6.25,
      description: 'Flour tortilla filled with diced ham, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.50,
      description: 'Extra-large burrito with extra ham, eggs, potatoes, and cheese, served with sour cream and guacamole'
    }
  ],
  // Special request field handles customizations,
  popular: false
},
{
  id: 'steak-potato-egg-cheese-burrito',
  name: 'Steak, Egg, Potato & Cheese Burrito',
  description: 'Tender grilled steak, scrambled eggs, crispy potatoes, and melted cheese in a warm flour tortilla',
  price: 8.75, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 8.75,
      description: 'Flour tortilla filled with tender grilled steak, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 12.49,
      description: 'Extra-large burrito with double the steak, eggs, potatoes, and cheese, served with sour cream, guacamole, and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'machaca-burrito',
  name: 'Machaca Burrito',
  description: 'Traditional shredded beef, scrambled with eggs, onions, bell peppers, and spices, wrapped in a warm flour tortilla',
  price: 7.75, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 7.75,
      description: 'Flour tortilla filled with tender shredded beef, scrambled eggs, sautéed onions, bell peppers, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.50,
      description: 'Extra-large burrito with extra machaca, eggs, and cheese, served with sour cream, guacamole, and pico de gallo'
    }
  ],
  // Special request field handles customizations,
  popular: true
},
{
  id: 'breakfast-crispy',
  name: 'Breakfast Crispy Burrito',
  description: 'A crispy flour tortilla filled with your choice of breakfast ingredients, then grilled to perfection',
  price: 9.49, // Base price (will be overridden by variants)
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 9.49,
      description: 'Crispy flour tortilla filled with scrambled eggs, your choice of meat, potatoes, and cheese, served with a side of salsa and sour cream'
    },
    {
      name: 'Deluxe',
      price: 11.49,
      description: 'Extra-large crispy burrito with double the fillings, served with sour cream, guacamole, and pico de gallo'
    }
  ],
  // Special request field handles customizations
},

  // Medium Combo - Choose 3 different items with meat choices
  {
    id: 'medium-combo',
    name: 'Medium Combo',
    description: 'Choose 3 different items with your choice of meat. Served with rice and beans.',
    price: 11.99,
    category: 'medium-combos',
    popular: true
  },

  // Large Combo - Choose 3 different items with meat choices
  {
    id: 'large-combo',
    name: 'Large Combo',
    description: 'Choose 3 different items with your choice of meat. Served with rice and beans.',
    price: 14.99,
    category: 'large-combos'
  }
];
