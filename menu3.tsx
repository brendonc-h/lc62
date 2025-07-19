// Updated menu with corrected prices from PDF (+$0.50)
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
    price: 19.49, // Updated from PDF
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
    price: 6.75, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'chicken-tostada',
    name: 'Chicken Tostada',
    description: 'Crispy corn tortilla topped with shredded chicken, refried beans, lettuce, cheese, and sour cream',
    price: 5.95, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'beef-tostada',
    name: 'Beef Tostada',
    description: 'Crispy corn tortilla layered with seasoned ground beef, refried beans, lettuce, tomatoes, and cheese',
    price: 6.25, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'guacamole-tostada',
    name: 'Guacamole Tostada',
    description: 'Crispy corn tortilla topped with fresh guacamole, lettuce, tomatoes, and queso fresco',
    price: 7.45, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'bean-tostada',
    name: 'Bean Tostada',
    description: 'Crispy corn tortilla with a layer of refried beans, lettuce, cheese, and your choice of toppings',
    price: 4.25, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'indian-taco',
    name: 'Indian Taco',
    description: 'Deep fried flour tortilla comes with your choice of beef, Chicken, Carnitas along side of beans smothered in green chile with lettuce tomatoes and cheese',
    price: 13.49, // Updated from PDF
    category: 'tostadas',
    popular: true,
  },
     {
    id: 'nacho-fans',
    name: 'Nacho Fans',
    description: 'Chicken or beef, served with sour cream & jalapeños Add steak for $2.00',
    price: 13.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'chili-cheese-fries',
    name: 'Chili Cheese Fries',
    description: 'Add ANY meat for $2.00',
    price: 10.75, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
      {
    id: 'cheese-dip-small',
    name: 'Cheese Dip (Small)',
    description: 'Creamy, melted cheese dip served with warm tortilla chips. Add chicken or beef for an extra charge',
    price: 6.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'cheese-dip-large',
    name: 'Cheese Dip (Large)',
    description: 'Our famous creamy cheese dip, perfect for sharing. Served with a generous portion of tortilla chips. Add Chorizo for $1.99',
    price: 8.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'mexican-taquitos',
    name: 'Mexican Taquitos',
    description: 'Beef or Chicken, Flour Tortillas',
    price: 12.75, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'quesadilla',
    name: 'Quesadilla',
    description: 'Chicken, beef or cheese',
    price: 12.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'shrimp-quesadilla',
    name: 'Shrimp Quesadilla',
    description: 'Flour tortilla filled with sautéed shrimp, melted cheese, and a blend of peppers and onions. Served with sour cream and guacamole',
    price: 15.75, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'pizza-birria',
    name: 'Pizza Birria',
    description: 'A delicious fusion of birria and pizza, featuring our slow-cooked birria meat, melted cheese, and our special sauce on a crispy crust',
    price: 20.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'queso-fundido',
    name: 'Queso Fundido',
    description: 'Corn or Flour',
    price: 14.49, // Updated from PDF
    category: 'appetizers',
    popular: true,
  },
       {
    id: 'steak-bowl',
    name: 'Steak Bowl',
    description: 'Grilled steak served over cilantro-lime rice with black beans, corn, pico de gallo, guacamole, and queso fresco',
    price: 15.49, // Updated from PDF
    category: 'salads',
    popular: true,
  },
     {
    id: 'shrimp-bowl',
    name: 'Shrimp Bowl',
    description: 'Served with lettuce rice, beans, pico de gallo, cheese and sour cream',
    price: 16.49, // Updated from PDF
    category: 'salads',
    popular: true,
  },
     {
    id: 'taco-salad',
    name: 'Taco Salad',
    description: 'Crispy flour tortilla bowl filled with fresh lettuce, your choice of protein, black beans, corn, cheese, and all your favorite taco toppings',
    price: 10.75, // Updated from PDF
    category: 'salads',
    popular: true,
  },
     {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets',
    description: 'Crispy breaded chicken nuggets served with a side of fries and your choice of dipping sauce',
    price: 7.49, // Updated from PDF
    category: 'kids',
    popular: true,
  },
      {
    id: 'quesadilla-kids',
    name: 'Quesadilla (Kids)',
    description: 'Small flour tortilla with melted cheese and your choice of chicken or beef, served with a side of rice and beans',
    price: 7.49, // Updated from PDF
    category: 'kids',
    popular: true,
  },
      {
    id: 'taco-kids',
    name: 'Taco (Kids)',
    description: 'One soft or hard shell taco with your choice of meat, cheese, and lettuce. Served with a side of rice and beans',
    price: 7.49, // Updated from PDF
    category: 'kids',
    popular: true,
  },
      {
    id: 'bean-cheese-burrito',
    name: 'Bean and Cheese Burrito (Kids)',
    description: 'Warm flour tortilla filled with refried beans and melted cheese. Served with a side of rice and chips',
    price: 7.49, // Updated from PDF
    category: 'kids',
    popular: true,
  },
      {
    id: 'sopapillas',
    name: 'Sopapillas',
    description: 'Light and fluffy fried pastries dusted with cinnamon sugar, served with honey for drizzling',
    price: 6.49, // Updated from PDF
    category: 'desserts',
    popular: true,
  },
        {
    id: 'fried-ice-cream',
    name: 'Fried Ice Cream',
    description: 'Vanilla ice cream coated in a crispy cinnamon-sugar crust, quickly fried to golden perfection. Served with whipped cream and a cherry',
    price: 6.75, // Updated from PDF
    category: 'desserts',
    popular: true,
  },
        {
    id: 'cheesecake-chimichanga',
    name: 'Cheesecake Chimichanga',
    description: 'Creamy cheesecake filling wrapped in a flour tortilla, lightly fried, and dusted with powdered sugar and cinnamon. Served with strawberry sauce',
    price: 8.49, // Updated from PDF
    category: 'desserts',
    popular: true,
  },
        {
    id: 'churros',
    name: 'Churros',
    description: 'Golden fried pastry sticks rolled in cinnamon sugar, served with warm chocolate and caramel dipping sauces',
    price: 6.45, // Updated from PDF
    category: 'desserts',
    popular: true,
  },
        {
    id: 'flan',
    name: 'Flan',
    description: 'Classic Mexican custard dessert with a rich caramel sauce, made fresh daily with eggs, milk, and vanilla',
    price: 4.75, // Updated from PDF
    category: 'desserts',
  },
        {
    id: 'crispy-relleno',
    name: 'Crispy Relleno',
    description: 'Crispy breaded chile relleno stuffed with cheese, lightly fried to perfection',
    price: 5.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'soft-relleno',
    name: 'Soft Relleno',
    description: 'Mild green chile stuffed with cheese, lightly battered and served with red or green chile sauce',
    price: 6.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'rice',
    name: 'Spanish Rice',
    description: 'Traditional Mexican-style rice cooked with tomatoes, onions, and garlic',
    price: 3.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'guacamole',
    name: 'Guacamole',
    description: 'Freshly made with ripe avocados, tomatoes, onions, cilantro, and lime juice. Served with warm tortilla chips',
    price: 6.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'sour-cream',
    name: 'Sour Cream',
    description: 'Cool and creamy topping for your favorite Mexican dishes',
    price: 2.50, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'toreados',
    name: 'Chiles Toreados (3)',
    description: 'Pan-seared jalapeños with onions, cooked in a savory sauce with lime and spices',
    price: 2.00, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-salsa',
    name: 'Chips and Salsa',
    description: 'Freshly made tortilla chips served with our house-made tomato salsa',
    price: 8.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'chips-guacamole',
    name: 'Chips and Guacamole',
    description: 'Crispy tortilla chips served with our fresh, hand-mashed guacamole made with ripe avocados',
    price: 10.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'beans',
    name: 'Refried Beans',
    description: 'Creamy, slow-cooked pinto beans, mashed and lightly fried with traditional seasonings',
    price: 3.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'chicharron',
    name: 'Chicharron',
    description: 'Crispy fried pork rinds, perfect for dipping in guacamole or salsa',
    price: 5.25, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-8oz',
    name: 'Green Chile (8 oz)',
    description: 'Our signature roasted green chile sauce, medium spice level',
    price: 5.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-16oz',
    name: 'Green Chile (16 oz)',
    description: 'A larger portion of our signature roasted green chile sauce, perfect for sharing',
    price: 9.25, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'green-chile-32oz',
    name: 'Green Chile (32 oz)',
    description: 'Family-sized portion of our signature roasted green chile sauce',
    price: 14.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'tortillas-4',
    name: 'Tortillas (4)',
    description: 'Warm flour tortillas, made fresh daily',
    price: 2.50, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'potatoes',
    name: 'Mexican Potatoes',
    description: 'Diced potatoes seasoned with Mexican spices and roasted until golden brown',
    price: 3.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden fries, lightly salted and served hot',
    price: 4.75, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'plain-tamal',
    name: 'Plain Tamal',
    description: 'Traditional Mexican tamal made with masa and steamed in a corn husk',
    price: 4.00, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'smothered-tamal',
    name: 'Smothered Tamal',
    description: 'Traditional tamal smothered in our signature red or green chile sauce and melted cheese',
    price: 5.49, // Updated from PDF
    category: 'sides',
    popular: true,
  },
          {
    id: 'torta-steak',
    name: 'Torta Steak',
    description: 'Grilled steak served on toasted bolillo bread with refried beans, avocado, lettuce, tomato, and mayonnaise',
    price: 15.49, // Updated from PDF
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-carnitas',
    name: 'Torta Carnitas',
    description: 'Tender braised pork served on toasted bolillo bread with refried beans, avocado, and pickled jalapeños',
    price: 15.49, // Updated from PDF
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-barbacoa',
    name: 'Torta Barbacoa',
    description: 'Slow-cooked barbacoa beef served on toasted bolillo bread with refried beans, avocado, and pickled onions',
    price: 15.49, // Updated from PDF
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'torta-pastor',
    name: 'Torta Pastor',
    description: 'Marinated pork al pastor with grilled pineapple, served on toasted bolillo bread with refried beans and avocado. Lettuce, tomato, onions, jalapeños, beans and fries',
    price: 15.49, // Updated from PDF
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'cheese-burger',
    name: 'Cheeseburger',
    description: 'Classic cheeseburger with American cheese, lettuce, tomato, onion, pickles, and our special sauce on a toasted bun',
    price: 10.49, // Updated from PDF
    category: 'tortas-y-hamburguesas',
    popular: true,
  },
            {
    id: 'hamburger',
    name: 'Hamburger',
    description: 'Juicy beef patty with lettuce, tomato, onion, pickles, ketchup, and mustard on a toasted bun',
    price: 8.45, // Updated from PDF
    category: 'tortas-y-hamburguesas',
  },
            {
    id: 'mexican-hamburger',
    name: 'Mexican Hamburger',
    description: 'Beef patty topped with green chile, cheese, and served with lettuce, tomato, and onions on a toasted bun',
    price: 13.49, // Updated from PDF
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
    description: 'Bell peppers, tomato, carrots and broccoli',
    price: 17.49, // Updated from PDF
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'chicken-fajitas',
    name: 'Chicken Fajitas',
    description: 'Sizzling platter of marinated grilled chicken with sautéed bell peppers and onions, served with warm flour tortillas and traditional sides',
    price: 20.49, // Updated from PDF
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'steak-fajitas',
    name: 'Steak Fajitas',
    description: 'Tender grilled steak strips with caramelized onions and bell peppers, served with warm flour tortillas and all the fixings',
    price: 20.49, // Updated from PDF
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'fajita-salad',
    name: 'Fajita Salad',
    description: 'Chicken or Steak',
    price: 14.49, // Updated from PDF
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'fajitas-three-amigos',
    name: 'Fajitas Three Amigos',
    description: 'Combo of steak, chicken and shrimp',
    price: 26.49, // Updated from PDF
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'chicken-steak-fajitas',
    name: 'Chicken y Steak Fajitas Combo',
    description: 'The best of both worlds - tender grilled chicken and steak strips with sautéed bell peppers and onions, served with warm flour tortillas and traditional sides',
    price: 23.49, // Updated from PDF
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'shrimp-fajitas',
    name: 'Shrimp Fajitas',
    description: 'Jumbo shrimp sautéed with bell peppers and onions in our special garlic butter sauce, served sizzling with warm tortillas and traditional sides',
    price: 20.49, // Updated from PDF
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
  
  //dinner specials
  {
    id: 'sopapilla',
    name: 'Sopapilla (House Special)',
    description: 'Beef, Chicken or Carnitas',
    price: 16.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'michis-special',
    name: 'Michis Special',
    description: 'Two stuffed chiles garnished with rice and CRISPY beans accompanied by tortillas',
    price: 15.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops a la Mexicana',
    description: 'Smothered in green chile with side of rice and beans',
    price: 18.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'carne-asada',
    name: 'Carne Asada',
    description: 'Grilled, marinated skirt steak served with charro beans, Spanish rice, grilled onions, bell peppers, and warm flour tortillas',
    price: 19.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'carnitas-plate',
    name: 'Carnitas Plate',
    description: 'Tender, slow-braised pork carnitas served with fresh pico de gallo, guacamole, refried beans, and warm corn tortillas',
    price: 17.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'los-tamales-plate',
    name: 'Los Tamales Plate',
    description: '2 Tamales, Rice and Beans and green chile',
    price: 15.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'jalisco-plate',
    name: 'Jalisco Plate',
    description: 'Come with carne asada choice of chile relleno tamal or enchilada, rice and beans',
    price: 20.49, // Updated from PDF
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'spinach-quesadilla',
    name: 'Spinach Quesadilla',
    description: 'Comes with sour cream, rice and beans',
    price: 13.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'los-amigos',
    name: 'Los Amigos',
    description: '2 Soft Chile Rellenos with a side of rice and beans accompanied by tortillas',
    price: 16.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'fish-tacos',
    name: 'Fish Tacos',
    description: 'tilapia rice and beans pico de gallo',
    price: 16.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'la-tampiquena',
    name: 'La Tampiqueña',
    description: 'Carne Asada served with a side of beans along side a bean Enchilada smothered in mole sauce',
    price: 20.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'sopitos',
    name: 'Sopitos',
    description: 'Beef or Chicken',
    price: 14.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'costillas',
    name: 'Costillas de Puerco',
    description: 'Rice, Beans, Tortillas and green chile',
    price: 20.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'tacos-al-pastor',
    name: 'Tacos Al Pastor',
    description: 'Three corn tortillas filled with marinated pork cooked on a vertical spit, topped with fresh pineapple, onions, and cilantro, served with lime wedges',
    price: 19.49, // Updated from PDF
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'dinner-specials',
  },
  {
    id: 'pollo-plancha',
    name: 'Pollo a la Plancha',
    description: 'Corn or Flour Tortillas',
    price: 18.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'tacos-carbon',
    name: 'Tacos al Carbón',
    description: 'Three grilled steak tacos with caramelized onions, fresh cilantro, and your choice of salsa, served with charro beans and lime wedges',
    price: 19.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'chicken-mole',
    name: 'Pollo en Mole',
    description: 'Flour or Corn Tortillas',
    price: 19.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'flauta-plate',
    name: 'Flauta Plate',
    description: '3 Flautas with rice, beans, lettuce, tomatoes and sour cream and Beef chicken Carnitas',
    price: 15.49, // Updated from PDF
    category: 'dinner-specials',
  },
  {
    id: 'pork-chile-verde',
    name: 'Chile Verde',
    description: 'Tender chunks of pork slow-cooked in our homemade green chile tomatillo sauce, served with Spanish rice, refried beans, and warm tortillas',
    price: 18.49, // Updated from PDF
    category: 'dinner-specials',
  },
  
  //enchiladas
  {
    id: 'cheese-dip-enchiladas',
    name: 'Cheese Dip Enchiladas',
    description: '2 Enchiladas side of rice and beans and your choice of beef,Chicken, or cheese',
    price: 15.49, // Updated from PDF
    category: 'enchiladas',
  },
  {
    id: 'spinach-enchiladas',
    name: 'Spinach Enchiladas',
    description: '2 Enchiladas with a side of rice and beans',
    price: 11.49, // Updated from PDF
    image: 'https://images.unsplash.com/photo-1597715469889-dd75fe4a1765',
    category: 'enchiladas',
  },
  {
    id: 'los-comadres',
    name: 'Los Comadres',
    description: '3 Enchiladas bathed in red sauce, one with grenchile and the other with tomatillo, accompanied by rice and beanswith sour cream, beef, chicken or cheese of your choice',
    price: 19.49, // Updated from PDF
    category: 'enchiladas',
  },
  {
    id: 'enchiladas-suizas',
    name: 'Enchiladas Suizas',
    description: '2 enchiladas smothered in green sause, sour cream, rice and beans and Beef chicken Cheese',
    price: 16.49, // Updated from PDF
    category: 'enchiladas',
  },
  {
    id: 'mole-enchiladas',
    name: 'Enchiladas de Mole',
    description: 'Beef chicken Cheese',
    price: 16.49, // Updated from PDF
    category: 'enchiladas',
  },
  
  //chimichangas
  {
    id: 'chimichanga',
    name: 'Chimichanga',
    description: 'Comes with Rice and Beans Choice of Beef,Chicken, or Carnitas',
    price: 15.49, // Updated from PDF
    category: 'chimichangas',
  },
  {
    id: 'cheesedip-chimichanga',
    name: 'Cheese Dip Chimichanga',
    description: 'Comes with rice and beans choice of Beef,Chicken, or Carnitas',
    price: 16.49, // Updated from PDF
    category: 'chimichangas',
  },

  //breakfast meals
  {
    id: 'berthoud-plate',
    name: 'Berthoud Plate',
    description: 'Two eggs, steak, potatos, side of green chile and Tortillas',
    price: 19.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-quesadilla',
    name: 'Breakfast Quesadilla',
    description: 'Choice of bacon, chorizo, ham and sausage',
    price: 15.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'casita-enchiladas',
    name: 'Casita Enchiladas',
    description: 'Two eggs, Beef chicken Cheese',
    price: 15.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'breakfast-chimichanga',
    name: 'Breakfast Chimichanga',
    description: 'Choice of bacon, chorizo, ham and sausage',
    price: 14.75, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'chilaquiles',
    name: 'Chilaquiles',
    description: 'red or green',
    price: 14.75, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-rancheros',
    name: 'Huevos Rancheros',
    description: 'Two eggs smothered in green chile. Comes with rice, beans and tortillas',
    price: 13.00, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'huevos-con-chorizo',
    name: 'Huevos con Chorizo',
    description: '2 Scrambled eggs. Comes with side of rice, beans and 3 tortillas',
    price: 13.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'machaca-con-huevo',
    name: 'Machaca con Huevo',
    description: 'Two eggs mixed with barbacoa, side of rice and beans',
    price: 15.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'vickeys-special',
    name: 'Vickeys Special',
    description: 'Two pork chops, two eggs, beans smothered in green chile. With a side of tortillas',
    price: 20.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  {
    id: 'colorado-special',
    name: 'Colorado Special',
    description: 'Chilaquiles, eggs and steak',
    price: 20.49, // Updated from PDF
    category: 'breakfast-meals',
  },
  //soups
  {
    id: 'menudo',
    name: 'Menudo',
    description: 'Alongside your choice of 4 Flour or Corn Tortillas',
    price: 15.49, // Updated from PDF
    category: 'soups',
  },
  {
    id: 'pozole',
    name: 'Pozole Rojo',
    description: 'Hearty hominy and pork soup simmered in a rich red chile broth, garnished with shredded cabbage, radishes, onions, and served with tostadas, lime wedges, and warm tortillas',
    price: 15.49, // Updated from PDF
    category: 'soups',
  },
  {
    id: 'ramen-birria',
    name: 'Ramen Birria',
    description: 'A fusion dish featuring ramen noodles in our rich, flavorful birria broth with tender braised beef, topped with onions, cilantro, and lime wedges',
    price: 19.49, // Updated from PDF
    category: 'soups',
  },
  {
    id: 'sopa-de-papa',
    name: 'Sopa de Papa',
    description: 'Come with Potatos, Bacon, Cheese',
    price: 14.49, // Updated from PDF
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
      price: 4.75, // Updated from PDF
      description: 'Flour tortilla filled with scrambled eggs, crispy potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
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
  price: 5.00, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 5.00, // Updated from PDF
      description: 'Flour tortilla filled with scrambled eggs, your choice of meat, cheese, and potatoes, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
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
  price: 5.45, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 5.45, // Updated from PDF
      description: 'Flour tortilla filled with fluffy scrambled eggs, melted cheese, and your choice of salsa, served with a side of refried beans'
    },
    {
      name: 'Deluxe',
      price: 9.45, // Updated from PDF
      description: 'Extra-large burrito with double the eggs and cheese, served with sour cream, guacamole, and a side of refried beans'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'potato-bacon-egg-cheese-burrito',
  name: 'Bacon, Egg, Potato & Cheese Burrito',
  description: 'A hearty breakfast favorite featuring crispy bacon, scrambled eggs, golden potatoes, and melted cheese in a warm flour tortilla',
  price: 4.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 4.75, // Updated from PDF
      description: 'Flour tortilla stuffed with crispy bacon, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
      description: 'Extra-large burrito with double the bacon, eggs, potatoes, and cheese, served with sour cream and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'chorizo-potato-egg-cheese-burrito',
  name: 'Chorizo, Egg, Potato & Cheese Burrito',
  description: 'Spicy Mexican chorizo mixed with scrambled eggs, crispy potatoes, and melted cheese in a warm flour tortilla',
  price: 4.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 4.75, // Updated from PDF
      description: 'Flour tortilla filled with spicy chorizo, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
      description: 'Extra-large burrito with extra chorizo, eggs, potatoes, and cheese, topped with sour cream and guacamole'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'sausage-potato-egg-cheese-burrito',
  name: 'Sausage, Egg, Potato & Cheese Burrito',
  description: 'Savory breakfast sausage, scrambled eggs, crispy potatoes, and melted cheese wrapped in a warm flour tortilla',
  price: 4.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 4.75, // Updated from PDF
      description: 'Flour tortilla filled with savory breakfast sausage, scrambled eggs, crispy potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
      description: 'Extra-large burrito with double the sausage, eggs, potatoes, and cheese, served with sour cream and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'ham-potato-egg-cheese-burrito',
  name: 'Ham, Egg, Potato & Cheese Burrito',
  description: 'Diced ham, scrambled eggs, golden potatoes, and melted cheese wrapped in a warm flour tortilla',
  price: 4.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 4.75, // Updated from PDF
      description: 'Flour tortilla filled with diced ham, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.00, // Updated from PDF
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
  price: 8.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 8.75, // Updated from PDF
      description: 'Flour tortilla filled with tender grilled steak, scrambled eggs, golden potatoes, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 10.49, // Updated from PDF
      description: 'Extra-large burrito with double the steak, eggs, potatoes, and cheese, served with sour cream, guacamole, and pico de gallo'
    }
  ],
  // Special request field handles customizations
},
{
  id: 'machaca-burrito',
  name: 'Machaca Burrito',
  description: 'Traditional shredded beef, scrambled with eggs, onions, bell peppers, and spices, wrapped in a warm flour tortilla',
  price: 7.75, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 7.75, // Updated from PDF
      description: 'Flour tortilla filled with tender shredded beef, scrambled eggs, sautéed onions, bell peppers, and melted cheese, served with a side of salsa'
    },
    {
      name: 'Deluxe',
      price: 9.75, // Updated from PDF
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
  price: 9.49, // Base price (will be overridden by variants) - Updated from PDF
  category: 'breakfast-burritos',
  variants: [
    {
      name: 'Regular',
      price: 9.49, // Updated from PDF
      description: 'Crispy flour tortilla filled with scrambled eggs, your choice of meat, potatoes, and cheese, served with a side of salsa and sour cream'
    },
    {
      name: 'Deluxe',
      price: 11.49, // Updated from PDF
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