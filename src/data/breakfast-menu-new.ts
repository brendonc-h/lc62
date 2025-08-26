// New breakfast menu data structure based on JSON specification
export interface BreakfastChoice {
  id: string;
  label: string;
  priceDelta: number;
}

export interface BreakfastOptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multi';
  required: boolean;
  choices: BreakfastChoice[];
  showIf?: {
    optionGroupId: string;
    choiceId: string;
  };
}

export interface BreakfastMenuItem {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  optionGroups: (string | BreakfastOptionGroup)[];
  category: string;
}

export interface BreakfastCategory {
  category: string;
  items: BreakfastMenuItem[];
}

// Global option libraries
export const globalOptionLibraries: { [key: string]: BreakfastOptionGroup } = {
  eggStyle: {
    id: "eggStyle",
    name: "Egg Style",
    type: "single",
    required: false,
    choices: [
      { id: "over-easy", label: "Over Easy", priceDelta: 0 },
      { id: "over-medium", label: "Over Medium", priceDelta: 0 },
      { id: "over-hard", label: "Over Hard", priceDelta: 0 },
      { id: "scrambled", label: "Scrambled", priceDelta: 0 },
      { id: "sunny", label: "Sunny Side Up", priceDelta: 0 },
      { id: "poached", label: "Poached", priceDelta: 0 }
    ]
  },
  chileHeat: {
    id: "chileHeat",
    name: "Green Chile Heat",
    type: "single",
    required: true,
    choices: [
      { id: "mild", label: "Mild", priceDelta: 0 },
      { id: "medium", label: "Medium", priceDelta: 0 },
      { id: "hot", label: "Hot", priceDelta: 0 }
    ]
  }
};

// Breakfast menu data
export const breakfastMenu: BreakfastCategory[] = [
  {
    category: "Skillets",
    items: [
      {
        id: "sk1",
        name: "Mighty Pastor",
        basePrice: 15.49,
        description: "Al pastor, bell pepper, onions & potatoes, two eggs, green chile, cheese.",
        optionGroups: ["eggStyle", "chileHeat"],
        category: "Skillets"
      },
      {
        id: "sk2",
        name: "Vaquero",
        basePrice: 14.25,
        description: "Steak, bell peppers, onions & potatoes, two eggs, green chile, cheese.",
        optionGroups: ["eggStyle", "chileHeat"],
        category: "Skillets"
      },
      {
        id: "sk3",
        name: "Primos",
        basePrice: 12.75,
        description: "Potato, bacon & sausage, bell pepper, onions, green chile, two eggs, cheese on top.",
        optionGroups: ["eggStyle", "chileHeat"],
        category: "Skillets"
      },
      {
        id: "sk4",
        name: "Denver",
        basePrice: 12.45,
        description: "Ham, potatoes, tomatoes, onions, cheese, two eggs.",
        optionGroups: ["eggStyle"],
        category: "Skillets"
      },
      {
        id: "sk5",
        name: "Mexicano",
        basePrice: 11.45,
        description: "Chorizo, potato, pico de gallo (jalapeño), two eggs, cheese, green chile.",
        optionGroups: ["eggStyle", "chileHeat"],
        category: "Skillets"
      },
      {
        id: "sk6",
        name: "Sebastian",
        basePrice: 12.45,
        description: "Crushed crispy chile relleno, potato, pico de gallo, cheese, green chile, two eggs.",
        optionGroups: ["eggStyle", "chileHeat"],
        category: "Skillets"
      }
    ]
  },
  {
    category: "Sweet and Salty",
    items: [
      {
        id: "ss1",
        name: "Mexican Omelet",
        basePrice: 13.49,
        description: "Build your omelet: choose meat(s), toppings, and a side.",
        optionGroups: [
          {
            id: "meatChoice",
            name: "Meat",
            type: "single",
            required: false,
            choices: [
              { id: "bacon", label: "Bacon", priceDelta: 0 },
              { id: "ham", label: "Ham", priceDelta: 0 },
              { id: "sausage", label: "Sausage", priceDelta: 0 },
              { id: "chorizo", label: "Chorizo", priceDelta: 0 },
              { id: "steak", label: "Steak", priceDelta: 4.0 }
            ]
          },
          {
            id: "secondMeat",
            name: "Add a 2nd Meat",
            type: "single",
            required: false,
            choices: [
              { id: "add-2nd-meat", label: "Yes (+$2.00)", priceDelta: 2.0 },
              { id: "no-2nd-meat", label: "No", priceDelta: 0 }
            ]
          },
          {
            id: "toppings",
            name: "Toppings",
            type: "multi",
            required: false,
            choices: [
              { id: "tomatoes", label: "Tomatoes", priceDelta: 0 },
              { id: "onion", label: "Onion", priceDelta: 0 },
              { id: "spinach", label: "Spinach", priceDelta: 0 },
              { id: "cheese", label: "Cheese", priceDelta: 0 },
              { id: "mushrooms", label: "Mushrooms", priceDelta: 0 },
              { id: "peppers", label: "Peppers", priceDelta: 0 },
              { id: "potatoes-top", label: "Potatoes", priceDelta: 0 }
            ]
          },
          {
            id: "sides",
            name: "Side",
            type: "single",
            required: true,
            choices: [
              { id: "toast", label: "Toast", priceDelta: 0 },
              { id: "pancakes", label: "Pancakes", priceDelta: 0 },
              { id: "salad", label: "Salad", priceDelta: 0 },
              { id: "potatoes", label: "Potatoes", priceDelta: 0 }
            ]
          }
        ],
        category: "Sweet and Salty"
      },
      {
        id: "ss2",
        name: "Plato Feliz",
        basePrice: 17.49,
        description: "Two eggs, two sausage links, two bacon & potatoes with pancakes or waffles.",
        optionGroups: [
          "eggStyle",
          {
            id: "pfBase",
            name: "Choose Base",
            type: "single",
            required: true,
            choices: [
              { id: "pancakes", label: "2 Pancakes", priceDelta: 0 },
              { id: "waffles", label: "Waffles", priceDelta: 0 }
            ]
          }
        ],
        category: "Sweet and Salty"
      }
    ]
  },
  {
    category: "Plates",
    items: [
      {
        id: "pl1",
        name: "Jason Plate",
        basePrice: 9.45,
        description: "One tamal, two eggs & bacon.",
        optionGroups: ["eggStyle"],
        category: "Plates"
      }
    ]
  },
  {
    category: "Abuelitos 55+",
    items: [
      {
        id: "ab1",
        name: "One egg, 1 pancake & potatoes",
        basePrice: 9.45,
        description: "",
        optionGroups: ["eggStyle"],
        category: "Abuelitos 55+"
      },
      {
        id: "ab2",
        name: "Scrambled eggs, bacon & toast",
        basePrice: 9.45,
        description: "",
        optionGroups: [],
        category: "Abuelitos 55+"
      },
      {
        id: "ab3",
        name: "Two eggs, pancake & sausage links",
        basePrice: 9.45,
        description: "",
        optionGroups: ["eggStyle"],
        category: "Abuelitos 55+"
      },
      {
        id: "ab4",
        name: "Wrap small burrito",
        basePrice: 9.45,
        description: "Choose filling: bacon, sausage, or ham.",
        optionGroups: [
          {
            id: "wrapFill",
            name: "Filling",
            type: "single",
            required: true,
            choices: [
              { id: "bacon", label: "Bacon", priceDelta: 0 },
              { id: "sausage", label: "Sausage", priceDelta: 0 },
              { id: "ham", label: "Ham", priceDelta: 0 }
            ]
          }
        ],
        category: "Abuelitos 55+"
      }
    ]
  },
  {
    category: "Dessert",
    items: [
      {
        id: "de1",
        name: "Oreo Bites",
        basePrice: 5.45,
        description: "",
        optionGroups: [],
        category: "Dessert"
      }
    ]
  },
  {
    category: "Sides",
    items: [
      {
        id: "si1",
        name: "Pancakes (3)",
        basePrice: 7.75,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si2",
        name: "Waffle (1)",
        basePrice: 5.45,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si3",
        name: "Pork Sausage Links (3)",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si4",
        name: "Bacon strips (3)",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si5",
        name: "Eggs (2)",
        basePrice: 2.75,
        description: "",
        optionGroups: ["eggStyle"],
        category: "Sides"
      },
      {
        id: "si6",
        name: "Buttered Toast (4)",
        basePrice: 2.45,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si7",
        name: "Potatoes",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Sides"
      },
      {
        id: "si8",
        name: "French Fries",
        basePrice: 3.75,
        description: "",
        optionGroups: [],
        category: "Sides"
      }
    ]
  },
  {
    category: "Beverages",
    items: [
      {
        id: "be1",
        name: "Juices (Orange or apple)",
        basePrice: 4.25,
        description: "",
        optionGroups: [],
        category: "Beverages"
      },
      {
        id: "be2",
        name: "Coffee",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Beverages"
      },
      {
        id: "be3",
        name: "Soft drinks",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Beverages"
      },
      {
        id: "be4",
        name: "Hot chocolate",
        basePrice: 3.45,
        description: "",
        optionGroups: [],
        category: "Beverages"
      },
      {
        id: "be5",
        name: "Milk",
        basePrice: 2.75,
        description: "",
        optionGroups: [],
        category: "Beverages"
      }
    ]
  },
  {
    category: "Crunchy Breakfast",
    items: [
      {
        id: "cb1",
        name: "Los Rancheros",
        basePrice: 11.25,
        description: "Two tostadas with beans, egg on top, pico de gallo & cheese, side of potatoes.",
        optionGroups: ["eggStyle"],
        category: "Crunchy Breakfast"
      },
      {
        id: "cb2",
        name: "Los Peleados",
        basePrice: 12.25,
        description: "Two salsas (red & tomatillo). Two eggs with melted cheese.",
        optionGroups: ["eggStyle"],
        category: "Crunchy Breakfast"
      },
      {
        id: "cb3",
        name: "Molletes",
        basePrice: 14.25,
        description: "Open-faced sandwich with refried beans, melted cheese, two eggs.",
        optionGroups: ["eggStyle"],
        category: "Crunchy Breakfast"
      }
    ]
  },
  {
    category: "Yummy Traditional",
    items: [
      {
        id: "yt1",
        name: "Chicken Waffles",
        basePrice: 12.45,
        description: "Crispy fried chicken on a sweet waffle with syrup.",
        optionGroups: [],
        category: "Yummy Traditional"
      },
      {
        id: "yt2",
        name: "Benedict Eggs",
        basePrice: 13.49,
        description: "English muffins with bacon or ham, poached eggs, gravy or green chile. Side: potatoes or house salad.",
        optionGroups: [
          {
            id: "benMeat",
            name: "Meat",
            type: "single",
            required: true,
            choices: [
              { id: "bacon", label: "Bacon", priceDelta: 0 },
              { id: "ham", label: "Ham", priceDelta: 0 }
            ]
          },
          {
            id: "benSauce",
            name: "Sauce",
            type: "single",
            required: true,
            choices: [
              { id: "gravy", label: "Gravy", priceDelta: 0 },
              { id: "green-chile", label: "Green Chile", priceDelta: 0 }
            ]
          },
          {
            id: "benSide",
            name: "Side",
            type: "single",
            required: true,
            choices: [
              { id: "potatoes", label: "Potatoes", priceDelta: 0 },
              { id: "salad", label: "House Salad", priceDelta: 0 }
            ]
          },
          {
            id: "benHeat",
            name: "Green Chile Heat",
            type: "single",
            required: true,
            choices: [
              { id: "mild", label: "Mild", priceDelta: 0 },
              { id: "medium", label: "Medium", priceDelta: 0 },
              { id: "hot", label: "Hot", priceDelta: 0 }
            ],
            showIf: { optionGroupId: "benSauce", choiceId: "green-chile" }
          }
        ],
        category: "Yummy Traditional"
      },
      {
        id: "yt3",
        name: "3 Amigos Tacos",
        basePrice: 10.49,
        description: "Three breakfast tacos with potatoes, eggs, cheese; choose meat. Side of green chile (Mild/Med/Hot).",
        optionGroups: [
          {
            id: "tacoMeat",
            name: "Meat",
            type: "single",
            required: true,
            choices: [
              { id: "bacon", label: "Bacon", priceDelta: 0 },
              { id: "chorizo", label: "Chorizo", priceDelta: 0 },
              { id: "ham", label: "Ham", priceDelta: 0 },
              { id: "sausage", label: "Sausage", priceDelta: 0 }
            ]
          },
          "chileHeat"
        ],
        category: "Yummy Traditional"
      }
    ]
  },
  {
    category: "Gravy Lovers",
    items: [
      {
        id: "gl1",
        name: "El Toro",
        basePrice: 14.49,
        description: "Beef fried steak & eggs smothered in gravy, potatoes.",
        optionGroups: ["eggStyle"],
        category: "Gravy Lovers"
      },
      {
        id: "gl2",
        name: "El Pollo",
        basePrice: 13.49,
        description: "Chicken fried steak & eggs smothered in gravy, potatoes.",
        optionGroups: ["eggStyle"],
        category: "Gravy Lovers"
      },
      {
        id: "gl3",
        name: "Biscuits & Gravy",
        basePrice: 13.49,
        description: "One biscuit with gravy, two eggs, potatoes.",
        optionGroups: ["eggStyle"],
        category: "Gravy Lovers"
      }
    ]
  }
];

// Helper function to resolve option groups
export function resolveOptionGroup(optionGroupRef: string | BreakfastOptionGroup): BreakfastOptionGroup {
  if (typeof optionGroupRef === 'string') {
    const resolved = globalOptionLibraries[optionGroupRef];
    if (!resolved) {
      throw new Error(`Option group "${optionGroupRef}" not found in global libraries`);
    }
    return resolved;
  }
  return optionGroupRef;
}

// Helper function to get all breakfast items flattened
export function getAllBreakfastItems(): BreakfastMenuItem[] {
  return breakfastMenu.flatMap(category => category.items);
}

// Helper function to get breakfast categories
export function getBreakfastCategories(): string[] {
  return breakfastMenu.map(category => category.category);
}
