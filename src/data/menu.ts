// Updated menu with all requested changes
export const STYLE_TYPES = ['Beef', 'Chicken', 'Bean'] as const;
export type StyleType = typeof STYLE_TYPES[number];

export interface MenuItemVariant {
  name: string;
  price: number;
  description?: string;
  protein?: 'beef' | 'chicken' | 'bean' | 'cheese';
  size?: 'small' | 'medium' | 'large';
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra hot';
  greenChile?: 'mild' | 'medium' | 'hot'; // Added green chile option
  noTortilla?: boolean; // Added no tortilla option
  addSteak?: boolean; // Added add steak option
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
  variants?: MenuItemVariant[];
  specialRequest?: string;
  spicyLevel?: number;
  locations?: string[];
  vegetarian?: boolean;
  greenChileOptions?: boolean; // Added for burritos/chimichangas
  noTortillaOption?: boolean; // Added for breakfast burritos
  addSteakOption?: boolean; // Added for items that can add steak
  sauceTypeOptions?: boolean; // Added for breakfast meals
  addChorizoOption?: boolean; // Added for cheese dips
  meatChoiceOption?: boolean; // Added for items with meat choice upgrades
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
    emoji: '🫓',
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
    description: 'Fresh salads with a variety of toppings, served with rice, beans, pico de gallo, cheese and sour cream',
    emoji: '🥗',
    color: 'from-green-300 to-green-500',
  },
  {
    id: 'medium-combos',
    name: 'Medium Combos',
    description: 'Medium combo meals with your choice of 2 items - no repeats allowed',
    emoji: '🍽️',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'large-combos',
    name: 'Large Combos',
    description: 'Large combo meals with your choice of 3 items - no repeats allowed',
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
    description: 'Traditional Mexican dinner plates',
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
    id: 'vegetarian',
    name: 'Vegetarian Options',
    description: 'Delicious plant-based Mexican cuisine',
    emoji: '🌱',
    color: 'from-green-500 to-emerald-600',
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
    description: 'Refreshing beverages',
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
  // APPETIZERS
  {
    id: 'nacho-fans',
    name: 'Nacho Fans',
    description: 'Chicken or beef, served with sour cream & jalapeños',
    price: 13.99,
    category: 'appetizers',
    popular: true,
    addSteakOption: true,
  },
  {
    id: 'chili-cheese-fries',
    name: 'Chili Cheese Fries',
    description: 'Crispy fries topped with chili and melted cheese',
    price: 10.99,
    category: 'appetizers',
    vegetarian: true,
    addSteakOption: true,
  },
  {
    id: 'cheese-dip-small',
    name: 'Cheese Dip (Small)',
    description: 'Creamy, melted cheese dip',
    price: 6.99,
    category: 'appetizers',
    vegetarian: true,
    addChorizoOption: true,
  },
  {
    id: 'cheese-dip-large',
    name: 'Cheese Dip (Large)',
    description: 'Our famous creamy cheese dip',
    price: 8.99,
    category: 'appetizers',
    vegetarian: true,
    addChorizoOption: true,
  },
  {
    id: 'mexican-taquitos',
    name: 'Mexican Taquitos',
    description: 'Beef or Chicken, Flour Tortillas',
    price: 12.99,
    category: 'appetizers',
  },
  {
    id: 'quesadilla',
    name: 'Quesadilla',
    description: 'Chicken, beef or cheese',
    price: 12.99,
    category: 'appetizers',
    vegetarian: true,
  },
  {
    id: 'shrimp-quesadilla',
    name: 'Shrimp Quesadilla',
    description: 'Flour tortilla filled with sautéed shrimp and melted cheese',
    price: 15.99,
    category: 'appetizers',
  },
  {
    id: 'pizza-birria',
    name: 'Pizza Birria',
    description: 'A delicious fusion of birria and pizza, featuring our slow-cooked birria meat, melted cheese, and our special sauce on a crispy crust',
    price: 20.99,
    category: 'appetizers',
    popular: true,
  },
  {
    id: 'queso-fundido',
    name: 'Queso Fundido',
    description: 'Melted cheese with chorizo, served with tortillas',
    price: 14.99,
    category: 'appetizers',
  },

  // BREAKFAST BURRITOS
  {
    id: 'potato-egg-cheese-burrito',
    name: 'Potato, Egg, and Cheese',
    description: 'Breakfast burrito with potatoes, eggs, and cheese',
    price: 4.99,
    category: 'breakfast-burritos',
    vegetarian: true,
    greenChileOptions: true,
    noTortillaOption: true,
    variants: [
      {
        name: 'Regular',
        price: 4.99,
        description: 'Flour tortilla filled with scrambled eggs, crispy potatoes, and melted cheese',
        spiceLevel: 'mild'
      },
      {
        name: 'Deluxe',
        price: 9.99,
        description: 'Extra-large burrito with double the filling, smothered in green chile',
        spiceLevel: 'mild'
      }
    ],
    popular: true
  },
  {
    id: 'egg-cheese-meat-burrito',
    name: 'Egg, Cheese, Meat',
    description: 'Breakfast burrito with eggs, cheese, potatoes, and your choice of meat',
    price: 5.99,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
    variants: [
      {
        name: 'Regular',
        price: 5.99,
        description: 'Flour tortilla filled with scrambled eggs, your choice of meat, and cheese'
      },
      {
        name: 'Deluxe',
        price: 9.99,
        description: 'Extra-large burrito with double the filling, smothered in green chile'
      }
    ],
  },
  {
    id: 'egg-cheese-burrito',
    name: 'Egg, Cheese',
    description: 'Simple breakfast burrito with eggs, cheese, and potatoes',
    price: 5.99,
    category: 'breakfast-burritos',
    vegetarian: true,
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'potato-bacon-egg-cheese-burrito',
    name: 'Bacon Burrito',
    description: 'Breakfast burrito with crispy bacon, potatoes, eggs, and cheese',
    price: 6.25,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'chorizo-potato-egg-cheese-burrito',
    name: 'Chorizo Burrito',
    description: 'Breakfast burrito with chorizo, potato, eggs, and cheese',
    price: 6.25,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'sausage-potato-egg-cheese-burrito',
    name: 'Sausage Burrito',
    description: 'Breakfast burrito with sausage, potato, eggs, and cheese',
    price: 6.25,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'ham-potato-egg-cheese-burrito',
    name: 'Ham Burrito',
    description: 'Breakfast burrito with ham, potatoes, eggs, and cheese',
    price: 6.25,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'steak-potato-egg-cheese-burrito',
    name: 'Steak, Egg, Cheese, Potato',
    description: 'Hearty breakfast burrito with steak, potatoes, eggs, and cheese',
    price: 8.99,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'machaca-burrito',
    name: 'Machaca Burrito',
    description: 'Breakfast burrito with barbacoa, potatoes, eggs, and cheese',
    price: 8.99,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
  },
  {
    id: 'breakfast-crispy',
    name: 'Breakfast Crispy',
    description: 'Crispy chile relleno with potatoes, eggs, and cheese',
    price: 9.99,
    category: 'breakfast-burritos',
    greenChileOptions: true,
    noTortillaOption: true,
    meatChoiceOption: true,
  },

  // BREAKFAST MEALS
  {
    id: 'berthoud-plate',
    name: 'Berthoud Plate',
    description: 'Two eggs, steak, potatoes, side of green chile and tortillas',
    price: 20.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'breakfast-quesadilla',
    name: 'Breakfast Quesadilla',
    description: 'Grilled quesadilla filled with breakfast ingredients. Choice of bacon, chorizo, ham and sausage',
    price: 15.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'casita-enchiladas',
    name: 'Casita Enchiladas',
    description: 'Two enchiladas smothered in red sauce with 2 eggs on top, served with rice and beans. Choice of beef, chicken, or cheese',
    price: 15.99,
    category: 'breakfast-meals',
    popular: true,
    sauceTypeOptions: true,
  },
  {
    id: 'breakfast-chimichanga',
    name: 'Breakfast Chimichanga',
    description: 'Crispy flour tortilla filled with eggs, potato, and your choice of meat (bacon, chorizo, ham, sausage) served with rice and beans',
    price: 15.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'chilaquiles',
    name: 'Chilaquiles',
    description: 'Crispy tortilla chips cooked in salsa, served with rice and beans',
    price: 15.99,
    category: 'breakfast-meals',
    vegetarian: true,
    sauceTypeOptions: true,
  },
  {
    id: 'huevos-rancheros',
    name: 'Huevos Rancheros',
    description: 'Two eggs smothered in green chile, served with rice and beans and your choice of flour or corn tortillas',
    price: 13.99,
    category: 'breakfast-meals',
    vegetarian: true,
    sauceTypeOptions: true,
  },
  {
    id: 'huevos-con-chorizo',
    name: 'Huevos con Chorizo',
    description: 'Scrambled eggs with chorizo, served with rice and beans and your choice of corn or flour tortillas',
    price: 13.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'machaca-con-huevo',
    name: 'Machaca con Huevo',
    description: 'Barbacoa scrambled with eggs, served with rice and beans',
    price: 15.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'vickeys-special',
    name: "Vicky's Special",
    description: 'Two pork chops, two eggs, beans smothered in green chile. With a side of tortillas',
    price: 20.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },
  {
    id: 'colorado-special',
    name: 'Colorado Plate',
    description: 'Chilaquiles, eggs and steak',
    price: 20.99,
    category: 'breakfast-meals',
    sauceTypeOptions: true,
  },

  // SOUPS
  {
    id: 'menudo',
    name: 'Menudo',
    description: 'Traditional Mexican soup made with beef stomach in red chili pepper-based broth',
    price: 15.99,
    category: 'soups',
    spicyLevel: 2,
  },
  {
    id: 'pozole',
    name: 'Pozole',
    description: 'Traditional Mexican soup with pork and hominy',
    price: 15.99,
    category: 'soups',
    spicyLevel: 1,
  },
  {
    id: 'ramen-birria',
    name: 'Birria Ramen',
    description: 'A fusion dish featuring ramen noodles in our rich, flavorful birria broth with tender braised beef, topped with onions, cilantro, and lime wedges',
    price: 19.99,
    category: 'soups',
    popular: true,
  },

  // TACOS & TOSTADAS
  {
    id: 'chicken-taco',
    name: 'Chicken Taco',
    description: 'Shredded chicken taco with lettuce, tomato, and cheese',
    price: 4.99,
    category: 'tacos',
  },
  {
    id: 'three-asada',
    name: '3 Tacos de Asada',
    description: 'Three grilled steak tacos with fresh cilantro, onions, and your choice of salsa',
    price: 13.99,
    category: 'tacos',
    popular: true,
  },
  {
    id: 'three-barbacoa',
    name: '3 Tacos de Barbacoa',
    description: 'Three tender, slow-cooked beef tacos with fresh onions, cilantro, and lime',
    price: 13.99,
    category: 'tacos',
  },
  {
    id: 'three-al-pastor',
    name: '3 Tacos al Pastor',
    description: 'Three marinated pork tacos with onions and cilantro',
    price: 13.99,
    category: 'tacos',
  },

  // TOSTADAS
  {
    id: 'bean-guacamole-tostada',
    name: 'Bean and Guacamole Tostada',
    description: 'Crispy corn tortilla topped with refried beans and fresh guacamole',
    price: 6.99,
    category: 'tostadas',
    vegetarian: true,
  },
  {
    id: 'chicken-tostada',
    name: 'Chicken Tostada',
    description: 'Crispy corn tortilla topped with shredded chicken, lettuce, tomato, and cheese',
    price: 5.99,
    category: 'tostadas',
  },
  {
    id: 'beef-tostada',
    name: 'Beef Tostada',
    description: 'Crispy corn tortilla layered with seasoned ground beef, lettuce, tomatoes, and cheese',
    price: 5.99,
    category: 'tostadas',
  },
  {
    id: 'bean-tostada',
    name: 'Bean Tostada',
    description: 'Crispy corn tortilla with beans, lettuce, tomato, and cheese',
    price: 4.99,
    category: 'tostadas',
    vegetarian: true,
  },
  {
    id: 'guacamole-tostada',
    name: 'Guacamole Tostada',
    description: 'Crispy corn tortilla topped with fresh guacamole',
    price: 7.50,
    category: 'tostadas',
    vegetarian: true,
  },
  {
    id: 'indian-taco',
    name: 'Indian Taco',
    description: 'Deep fried flour tortilla comes with your choice of beef, chicken, carnitas alongside beans smothered in green chile with lettuce tomatoes and cheese',
    price: 13.99,
    category: 'tostadas',
  },

  // SALADS & BOWLS
  {
    id: 'steak-bowl',
    name: 'Steak Bowl',
    description: 'Bowl with whole beans, rice, lettuce, tomato, cheese, and sour cream',
    price: 15.99,
    category: 'salads',
  },
  {
    id: 'shrimp-bowl',
    name: 'Shrimp Bowl',
    description: 'Served with lettuce, rice, beans, pico de gallo, cheese and sour cream',
    price: 16.99,
    category: 'salads',
  },
  {
    id: 'taco-salad',
    name: 'Taco Salad',
    description: 'Crispy flour tortilla bowl filled with fresh lettuce, tomato, cheese, and your choice of meat',
    price: 10.99,
    category: 'salads',
  },

  // COMBINATIONS
  {
    id: 'medium-combo',
    name: 'Medium Combination',
    description: 'Choose 2 different items with your choice of meat. Served with rice and beans.',
    price: 15.99,
    category: 'medium-combos',
    popular: true
  },
  {
    id: 'large-combo',
    name: 'Large Combination',
    description: 'Choose 3 different items with your choice of meat. Served with rice and beans.',
    price: 18.99,
    category: 'large-combos'
  },

  // BURRITOS
  {
    id: 'deluxe-bean-cheese-burrito',
    name: 'Deluxe Bean and Cheese Burrito',
    description: 'Large burrito with beans and cheese, smothered with green chile',
    price: 9.99,
    category: 'burritos',
    vegetarian: true,
  },
  {
    id: 'steak-burrito',
    name: 'Steak Burrito',
    description: 'Grilled steak burrito',
    price: 12.99,
    category: 'burritos',
  },

  // FAJITAS
  {
    id: 'skinny-fajitas',
    name: 'Skinny Fajitas',
    description: 'Bell peppers, onion, broccoli, carrots, cauliflower, squash, zucchini. Choice of corn or flour tortillas',
    price: 18.99,
    category: 'fajitas',
    vegetarian: true,
  },
  {
    id: 'chicken-fajitas',
    name: 'Chicken Fajitas',
    description: 'Sizzling platter of marinated grilled chicken with sautéed bell peppers and onions. Choice of corn or flour tortillas',
    price: 20.99,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'steak-fajitas',
    name: 'Steak Fajitas',
    description: 'Tender grilled steak strips with caramelized onions and bell peppers. Choice of corn or flour tortillas',
    price: 20.99,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'fajita-salad',
    name: 'Fajita Salad',
    description: 'Chicken or Steak served over fresh greens',
    price: 14.99,
    category: 'fajitas',
  },
  {
    id: 'fajitas-three-amigos',
    name: 'Fajitas 3 Amigos',
    description: 'Combination of chicken, steak, and shrimp fajitas. Comes with rice, beans, sour cream, and pico. Choice of corn or flour tortillas',
    price: 26.99,
    category: 'fajitas',
    popular: true,
  },
  {
    id: 'chicken-steak-fajitas',
    name: 'Chicken-Steak Fajita Combo',
    description: 'Combination of chicken and steak fajitas. Choice of corn or flour tortillas',
    price: 23.99,
    category: 'fajitas',
  },
  {
    id: 'shrimp-fajitas',
    name: 'Shrimp Fajitas',
    description: 'Sizzling shrimp fajitas with peppers and onions. Choice of corn or flour tortillas',
    price: 20.99,
    category: 'fajitas',
  },

  // DINNER SPECIALS
  {
    id: 'michis-special',
    name: 'Michis Special',
    description: 'Two stuffed crispy chile rellenos served with rice and beans and choice of corn or flour tortillas',
    price: 15.99,
    category: 'dinner-specials',
    vegetarian: true,
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops a la Mexicana',
    description: 'Smothered in green chile with side of rice and beans',
    price: 18.99,
    category: 'dinner-specials',
  },
  {
    id: 'carne-asada',
    name: 'Carne Asada',
    description: 'Grilled steak served with rice, beans, onions, sour cream, and jalapeños with choice of corn or flour tortillas',
    price: 19.99,
    category: 'dinner-specials',
    popular: true,
  },
  {
    id: 'carnitas-plate',
    name: 'Carnitas Plate',
    description: 'Slow-cooked pork served with rice, beans, and sour cream',
    price: 17.99,
    category: 'dinner-specials',
  },
  {
    id: 'los-tamales-plate',
    name: 'Los Tamales',
    description: '2 Tamales, Rice and Beans and green chile',
    price: 15.99,
    category: 'dinner-specials',
  },
  {
    id: 'jalisco-plate',
    name: 'Jalisco Plate',
    description: 'Come with carne asada choice of chile relleno tamal or enchilada, rice and beans',
    price: 20.99,
    category: 'dinner-specials',
  },
  {
    id: 'spinach-quesadilla',
    name: 'Spinach Quesadilla',
    description: 'Grilled quesadilla filled with fresh spinach and cheese',
    price: 13.99,
    category: 'dinner-specials',
    vegetarian: true,
  },
  {
    id: 'los-amigos',
    name: 'Los Amigos',
    description: '2 Soft Chile Rellenos with a side of rice and beans accompanied by tortillas',
    price: 16.99,
    category: 'dinner-specials',
    vegetarian: true,
    greenChileOptions: true,
  },
  {
    id: 'fish-tacos',
    name: 'Fish Tacos',
    description: 'Fresh fish tacos with tilapia, rice and beans, pico de gallo',
    price: 16.99,
    category: 'dinner-specials',
  },
  {
    id: 'la-tampiquena',
    name: 'La Tampiqueña',
    description: 'Carne Asada served with a side of beans alongside a bean Enchilada smothered in mole sauce',
    price: 20.99,
    category: 'dinner-specials',
  },
  {
    id: 'sopitos',
    name: 'Sopitos',
    description: 'Small thick tortillas topped with beans, meat, and cheese. Beef or Chicken',
    price: 14.99,
    category: 'dinner-specials',
  },
  {
    id: 'costillas',
    name: 'Costillas de Puerco',
    description: 'Grilled ribs served with rice, beans, tortillas and green chile',
    price: 20.99,
    category: 'dinner-specials',
  },
  {
    id: 'tacos-al-pastor',
    name: 'Tacos al Pastor',
    description: 'Marinated pork tacos served with rice and beans',
    price: 19.99,
    category: 'dinner-specials',
  },
  {
    id: 'pollo-plancha',
    name: 'Pollo a la Plancha',
    description: 'Grilled chicken served with rice and beans. Corn or Flour Tortillas',
    price: 18.99,
    category: 'dinner-specials',
  },
  {
    id: 'tacos-carbon',
    name: 'Tacos al Carbon',
    description: '3 steak tacos smothered in delicious red sauce topped with cheese, lettuce, tomatoes, sour cream alongside rice and beans',
    price: 19.99,
    category: 'dinner-specials',
  },
  {
    id: 'chicken-mole',
    name: 'Pollo en Mole',
    description: 'Chicken in traditional mole sauce. Flour or Corn Tortillas',
    price: 19.99,
    category: 'dinner-specials',
  },
  {
    id: 'flauta-plate',
    name: 'Flautas',
    description: '3 Flautas with rice, beans, lettuce, tomatoes and sour cream. Beef, chicken, carnitas',
    price: 15.99,
    category: 'dinner-specials',
  },
  {
    id: 'sopapilla',
    name: 'House Sopapilla',
    description: 'Sopapilla filled with your choice of meat',
    price: 17.99,
    category: 'dinner-specials',
    addSteakOption: true,
  },

  // ENCHILADAS
  {
    id: 'cheese-dip-enchiladas',
    name: 'Cheese Dip Enchiladas',
    description: '2 Enchiladas side of rice and beans and your choice of beef, chicken, or cheese',
    price: 15.99,
    category: 'enchiladas',
    vegetarian: true,
  },
  {
    id: 'spinach-enchiladas',
    name: 'Spinach Enchiladas',
    description: '2 Enchiladas with a side of rice and beans',
    price: 12.99,
    category: 'enchiladas',
    vegetarian: true,
  },
  {
    id: 'los-comadres',
    name: 'Las Comadres',
    description: '3 Enchiladas bathed in red sauce, one with green chile and the other with tomatillo, accompanied by rice and beans with sour cream, beef, chicken or cheese of your choice',
    price: 19.99,
    category: 'enchiladas',
    vegetarian: true,
  },
  {
    id: 'enchiladas-suizas',
    name: 'Enchiladas Suizas',
    description: '2 enchiladas smothered in green sauce, sour cream, rice and beans. Beef, chicken, cheese',
    price: 16.99,
    category: 'enchiladas',
    vegetarian: true,
  },
  {
    id: 'mole-enchiladas',
    name: 'Enchiladas de Mole',
    description: 'Enchiladas covered in traditional mole sauce. Beef, chicken, cheese',
    price: 16.99,
    category: 'enchiladas',
    vegetarian: true,
  },
  {
    id: 'enchiladas-rojas',
    name: 'Enchiladas Rojas',
    description: '2 enchiladas in red sauce, served with rice and beans',
    price: 14.99,
    category: 'enchiladas',
  },

  // CHIMICHANGAS
  {
    id: 'chimichanga',
    name: 'Chimichanga',
    description: 'Deep-fried burrito served crispy. Comes with rice and beans. Choice of beef, chicken, or carnitas',
    price: 15.99,
    category: 'chimichangas',
  },
  {
    id: 'cheesedip-chimichanga',
    name: 'Cheese Dip Chimichanga',
    description: 'Chimichanga topped with cheese dip. Comes with rice and beans choice of beef, chicken, or carnitas',
    price: 16.99,
    category: 'chimichangas',
  },

  // VEGETARIAN OPTIONS
  {
    id: 'potato-egg-cheese-veg',
    name: 'Potato, Egg, Cheese (Vegetarian)',
    description: 'Green chile (mild, medium, hot)',
    price: 4.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'egg-cheese-veg',
    name: 'Egg, Cheese (Vegetarian)', 
    description: 'Green chile (mild, medium, hot)',
    price: 5.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'casita-enchiladas-veg',
    name: 'Casita Enchiladas (Cheese)',
    description: 'Two cheese enchiladas smothered in red sauce with 2 eggs on top, served with rice and beans',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'breakfast-chimichanga-veg',
    name: 'Breakfast Chimichanga (No Meat)',
    description: 'Crispy flour tortilla filled with eggs and potato, served with rice and beans',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'huevos-rancheros-veg',
    name: 'Huevos Rancheros',
    description: 'Two eggs smothered in green chile, served with rice and beans and tortillas',
    price: 13.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'chilaquiles-veg',
    name: 'Chilaquiles',
    description: 'Crispy tortilla chips cooked in salsa, served with rice and beans',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'michis-special-veg',
    name: 'Michis Special',
    description: 'Two stuffed crispy chile rellenos served with rice and beans and tortillas',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'spinach-quesadilla-veg',
    name: 'Spinach Quesadilla',
    description: 'Grilled quesadilla filled with fresh spinach and cheese',
    price: 13.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'los-amigos-veg',
    name: 'Los Amigos',
    description: '2 Soft Chile Rellenos with rice and beans and tortillas',
    price: 16.99,
    category: 'vegetarian',
    vegetarian: true,
    greenChileOptions: true,
  },
  {
    id: 'cheesedip-enchiladas-veg',
    name: 'Cheese Dip Enchiladas (Cheese)',
    description: '2 Cheese enchiladas topped with cheese dip, served with rice and beans',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'spinach-enchiladas-veg',
    name: 'Spinach Enchiladas',
    description: '2 Enchiladas filled with fresh spinach, served with rice and beans',
    price: 12.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'las-comadres-veg',
    name: 'Las Comadres (Cheese)',
    description: '3 Cheese enchiladas with different sauces, served with rice and beans',
    price: 19.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'enchiladas-suizas-veg',
    name: 'Enchiladas Suizas (Cheese)',
    description: '2 cheese enchiladas smothered in green sauce, served with rice and beans',
    price: 16.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'mole-enchiladas-veg',
    name: 'Mole Enchiladas (Cheese)',
    description: 'Cheese enchiladas covered in traditional mole sauce',
    price: 16.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'dlx-bean-cheese-veg',
    name: 'Deluxe Bean and Cheese Burrito',
    description: 'Large burrito with beans and cheese, smothered with green chile',
    price: 9.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'skinny-fajitas-veg',
    name: 'Skinny Fajitas',
    description: 'Bell peppers, onion, broccoli, carrots, cauliflower, squash, zucchini',
    price: 18.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'kristi-veggie-burrito',
    name: "Kristi's Veggie Burrito",
    description: 'Bell peppers, whole pinto beans, broccoli, carrots, cauliflower, squash, zucchini, smothered with green chile, lettuce, tomato, cheese',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'dylans-burrito',
    name: "Dylan's Burrito",
    description: 'Crispy chile relleno with beans, smothered in green chile, lettuce, tomato, cheese',
    price: 15.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'bean-guac-tostada-veg',
    name: 'Bean and Guacamole Tostada',
    description: 'Crispy tostada topped with beans and fresh guacamole',
    price: 6.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'bean-tostada-veg',
    name: 'Bean Tostada',
    description: 'Crispy tostada with beans, lettuce, tomato, and cheese',
    price: 4.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'guac-tostada-veg',
    name: 'Guacamole Tostada',
    description: 'Crispy tostada topped with fresh guacamole',
    price: 7.50,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'nachos-no-meat-veg',
    name: 'Nachos (No Meat)',
    description: 'Crispy tortilla chips with cheese and vegetarian toppings',
    price: 13.99,
    category: 'vegetarian',
    vegetarian: true,
  },
  {
    id: 'chili-cheese-fries-veg',
    name: 'Chili Cheese Fries',
    description: 'Crispy fries topped with chili and melted cheese',
    price: 10.99,
    category: 'vegetarian',
    vegetarian: true,
    addSteakOption: true,
  },
  {
    id: 'quesadilla-veg',
    name: 'Quesadilla (Cheese)',
    description: 'Grilled flour tortilla filled with melted cheese',
    price: 12.99,
    category: 'vegetarian',
    vegetarian: true,
  },

  // KIDS MENU
  {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets',
    description: 'Crispy breaded chicken nuggets served with a side of fries',
    price: 7.99,
    category: 'kids',
  },
  {
    id: 'quesadilla-kids',
    name: 'Quesadilla (Kids)',
    description: 'Small flour tortilla with melted cheese',
    price: 7.99,
    category: 'kids',
    vegetarian: true,
  },
  {
    id: 'taco-kids',
    name: 'Taco (Kids)',
    description: 'One soft or hard shell taco with meat and cheese',
    price: 7.99,
    category: 'kids',
  },
  {
    id: 'bean-cheese-burrito-kids',
    name: 'Bean and Cheese (Kids)',
    description: 'Small bean and cheese burrito with rice and beans',
    price: 7.99,
    category: 'kids',
    vegetarian: true,
  },

  // SIDES
  {
    id: 'crispy-relleno',
    name: 'Crispy Relleno',
    description: 'Crispy battered chile relleno stuffed with cheese',
    price: 5.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'soft-relleno',
    name: 'Soft Relleno',
    description: 'Soft chile relleno smothered in green chile',
    price: 6.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'rice',
    name: 'Spanish Rice',
    description: 'Traditional Mexican-style rice cooked with tomatoes, onions, and garlic',
    price: 3.75,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'guacamole',
    name: 'Guacamole',
    description: 'Freshly made with ripe avocados (does not come with chips)',
    price: 6.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'sour-cream',
    name: 'Sour Cream',
    description: 'Cool and creamy topping',
    price: 2.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'chips-salsa',
    name: 'Chips and Salsa',
    description: 'Freshly made tortilla chips served with our house-made salsa',
    price: 8.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'chips-guacamole',
    name: 'Chips and Guacamole',
    description: 'Crispy tortilla chips served with our fresh guacamole',
    price: 10.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'beans',
    name: 'Refried Beans',
    description: 'Creamy, slow-cooked pinto beans',
    price: 3.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'chicharron',
    name: 'Chicharrón',
    description: 'Crispy fried pork rinds',
    price: 5.99,
    category: 'sides',
  },
  {
    id: 'green-chile-8oz',
    name: 'Green Chile (8oz)',
    description: '8oz container of our signature roasted green chile sauce',
    price: 5.75,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'green-chile-16oz',
    name: 'Green Chile (16oz)',
    description: '16oz container of our signature roasted green chile sauce',
    price: 9.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'green-chile-32oz',
    name: 'Green Chile (32oz)',
    description: '32oz container of our signature roasted green chile sauce',
    price: 14.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'tortillas-4',
    name: 'Tortillas (4)',
    description: 'Four fresh tortillas',
    price: 2.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'potatoes',
    name: 'Mexican Potatoes',
    description: 'Diced potatoes seasoned with Mexican spices',
    price: 3.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 4.99,
    category: 'sides',
    vegetarian: true,
  },
  {
    id: 'smothered-tamal',
    name: 'Smothered Tamal',
    description: 'Traditional tamal smothered in sauce',
    price: 5.99,
    category: 'sides',
  },

  // TORTAS & HAMBURGERS
  {
    id: 'torta-steak',
    name: 'Torta Steak',
    description: 'Mexican sandwich with steak, lettuce, tomato, cheese, and pickled jalapeños served with french fries',
    price: 15.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'torta-carnitas',
    name: 'Torta Carnitas',
    description: 'Mexican sandwich with carnitas, lettuce, tomato, cheese, and pickled jalapeños served with french fries',
    price: 15.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'torta-barbacoa',
    name: 'Torta Barbacoa',
    description: 'Mexican sandwich with barbacoa, lettuce, tomato, cheese, and pickled jalapeños served with french fries',
    price: 15.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'torta-pastor',
    name: 'Torta Pastor',
    description: 'Mexican sandwich with al pastor, lettuce, tomato, cheese, and pickled jalapeños served with french fries',
    price: 15.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'cheese-burger',
    name: 'Cheeseburger',
    description: 'Classic cheeseburger',
    price: 10.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'hamburger',
    name: 'Hamburger',
    description: 'Classic hamburger',
    price: 8.99,
    category: 'tortas-y-hamburguesas',
  },
  {
    id: 'mexican-hamburger',
    name: 'Mexican Hamburger',
    description: 'Flour tortilla stuffed with a beef patty and beans, smothered in green chile, served with lettuce, tomato, cheese, and sour cream',
    price: 13.99,
    category: 'tortas-y-hamburguesas',
  },

  // DRINKS
  {
    id: 'mexican-coke',
    name: 'Mexican Coke',
    description: 'Authentic Mexican Coca-Cola made with cane sugar',
    price: 4.99,
    category: 'drinks',
  },
  {
    id: 'jarritos',
    name: 'Jarritos',
    description: 'Mexican soda - Mandarin, Grapefruit, or Pineapple',
    price: 4.99,
    category: 'drinks',
    variants: [
      { name: 'Mandarin', price: 4.99 },
      { name: 'Grapefruit', price: 4.99 },
      { name: 'Pineapple', price: 4.99 }
    ]
  },
  {
    id: 'soft-drinks',
    name: 'Soft Drinks',
    description: 'Coca-Cola, Diet Coke, Sprite, Dr. Pepper, Lemonade, Coke Zero, Root Beer, Raspberry Tea',
    price: 4.99,
    category: 'drinks',
  },
  {
    id: 'horchata',
    name: 'Horchata',
    description: 'Traditional Mexican rice drink with cinnamon',
    price: 6.99,
    category: 'drinks',
    vegetarian: true,
  },

  // DESSERTS
  {
    id: 'sopapillas',
    name: 'Sopapillas',
    description: 'Light, crispy fried pastries dusted with cinnamon sugar',
    price: 6.99,
    category: 'desserts',
    vegetarian: true,
  },
  {
    id: 'fried-ice-cream',
    name: 'Fried Ice Cream',
    description: 'Crispy coated ice cream served warm',
    price: 6.99,
    category: 'desserts',
    vegetarian: true,
  },
  {
    id: 'cheesecake-chimichanga',
    name: 'Cheesecake Chimichanga',
    description: 'Fried cheesecake in a crispy tortilla',
    price: 8.99,
    category: 'desserts',
    vegetarian: true,
  },
  {
    id: 'churros',
    name: 'Churros',
    description: 'Crispy fried dough sticks dusted with cinnamon sugar',
    price: 6.99,
    category: 'desserts',
    vegetarian: true,
  },
  {
    id: 'flan',
    name: 'Flan',
    description: 'Traditional Mexican custard with caramel sauce',
    price: 6.99,
    category: 'desserts',
    vegetarian: true,
  }
];

// Helper functions
export const getVegetarianItems = (): MenuItem[] => {
  return menuItems.filter(item => item.vegetarian === true);
};

export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.category === categoryId);
};

export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.popular === true);
};