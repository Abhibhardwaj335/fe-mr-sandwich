export interface MenuItem {
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

export interface MenuCategory {
  name: string; // top-level category
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    name: "Beverages",
    items: [
      { name: "Vanilla Shake", price: 79, subcategory: "Cream Shakes", image: "/images/beverages/shake/vanilla_shake.jpeg" },
      { name: "Strawberry Shake", price: 79, subcategory: "Cream Shakes", image: "/images/beverages/shake/strawberry_shake.jpeg" },
      { name: "Pista Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/shake/pista-shake.jpeg" },
      { name: "Butterscotch Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/shake/butterscotch-shake.jpeg" },
      { name: "Chocolate Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/shake/chocolate-shake.jpeg" },
      { name: "Oreo Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/shake/oreo-shake.jpeg" },
      { name: "Kitkat Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/shake/kitkat-shake.jpeg" },
      { name: "Mint Mojito", price: 79, subcategory: "Mocktails", image: "/images/beverages/shake/mint-mojito.jpeg" },
      { name: "Blue Lagoon", price: 89, subcategory: "Mocktails", image: "/images/beverages/shake/blue-lagoon.jpeg" },
      { name: "Crunch Plain", price: 99, subcategory: "Special Cold Coffee", image: "/images/beverages/shake/crunch-plain.jpeg" },
      { name: "Hot Chocolate", price: 69, subcategory: "Special Hot", image: "/images/beverages/shake/hot-chocolate.jpeg" },
      { name: "Masala Tea", price: 40, subcategory: "Tea", image: "/images/beverages/masala-tea.jpeg" },
      { name: "Mango Mastani", price: 109, subcategory: "Special Mastani", image: "/images/beverages/mango-mastani.jpeg" },
    ],
  },
  {
    name: "sandwich",
    items: [
      { name: "Mr Sandwich Mix Veg", price: 149, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwich/mr-sandwich-mix-veg.jpeg" },
      { name: "Paneer Tandoori", price: 159, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwich/paneer-tandoori.jpeg" },
      { name: "Exotic Cheese Sub", price: 199, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwich/exotic-cheese-sub.jpeg" },
      { name: "Veg Sandwich", price: 85, subcategory: "Brown Club Grilled", image: "/images/sandwich/veg-sandwich.jpeg" },
      { name: "Corn Sandwich", price: 100, subcategory: "Brown Club Grilled", image: "/images/sandwich/corn-sandwich.jpeg" },
      { name: "Chocolate Sandwich", price: 95, subcategory: "Brown Club Grilled", image: "/images/sandwich/chocolate-sandwich.jpeg" },
      { name: "Spicy Paneer Grilled", price: 140, subcategory: "Brown Club Grilled", image: "/images/sandwich/spicy-paneer-grilled.jpeg" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { name: "Margherita Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/margherita-pizza.jpeg" },
      { name: "Veg Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/veg-pizza.jpeg" },
      { name: "Tandoori Pizza", price: 135, subcategory: "Regular pizza", image: "/images/pizza/tandoori-pizza.jpeg" },
      { name: "Paneer Pizza", price: 140, subcategory: "Regular pizza", image: "/images/pizza/paneer-pizza.jpeg" },
      { name: "Peppy Paneer Pizza", price: 140, subcategory: "Premium pizza", image: "/images/pizza/peppy-paneer-pizza.jpeg" },
      { name: "Mushroom Delite Pizza", price: 160, subcategory: "Premium pizza", image: "/images/pizza/mushroom-delite-pizza.jpeg" },
      { name: "Paneer Makhani Pizza", price: 150, subcategory: "Premium pizza", image: "/images/pizza/paneer-makhani-pizza.jpeg" },
    ],
  },
  {
    name: "Burgers",
    items: [
      { name: "Simply Burger", price: 60, subcategory: "Brown Burger", image: "/images/burgers/simply-burger.jpeg" },
      { name: "Cheese Burger", price: 80, subcategory: "Brown Burger", image: "/images/burgers/cheese-burger.jpeg" },
      { name: "Paneer Burger", price: 99, subcategory: "Brown Burger", image: "/images/burgers/paneer-burger.jpeg" },
      { name: "Double Trouble", price: 140, subcategory: "Brown Burger", image: "/images/burgers/double_trouble_burger.jpeg" },
      { name: "Aloo Crunch", price: 90, subcategory: "Aloo Tikki Veg", image: "/images/burgers/aloo-crunch.jpeg" },
      { name: "Spicy Paneer Crunch", price: 140, subcategory: "Aloo Tikki Veg", image: "/images/burgers/spicy-paneer-crunch.jpeg" },
    ],
  },
  {
    name: "Pasta & Maggie",
    items: [
      { name: "Red Sauce Pasta", price: 149, subcategory: "Pasta", image: "/images/pasta/red-sauce-pasta.jpeg" },
      { name: "White Sauce Pasta", price: 199, subcategory: "Pasta", image: "/images/pasta/white-sauce-pasta.jpeg" },
      { name: "Mushroom Cheese Pasta", price: 189, subcategory: "Pasta", image: "/images/pasta/mushroom-cheese-pasta.jpeg" },
      { name: "Plain Maggie", price: 50, subcategory: "Maggie", image: "/images/pasta/plain-maggie.jpeg" },
      { name: "Cheese Maggie", price: 65, subcategory: "Maggie", image: "/images/pasta/cheese-maggie.jpeg" },
      { name: "Paneer Maggie", price: 75, subcategory: "Maggie", image: "/images/pasta/paneer-maggie.jpeg" },
    ],
  },
  {
    name: "Wraps & Momos",
    items: [
      { name: "Aloo Tikki Wrap", price: 65, subcategory: "Wrap", image: "/images/wraps/aloo-tikki-wrap.jpeg" },
      { name: "Paneer Wrap", price: 105, subcategory: "Wrap", image: "/images/wraps/paneer-wrap.jpeg" },
      { name: "Tandoori Paneer Wrap", price: 120, subcategory: "Wrap", image: "/images/wraps/tandoori-paneer-wrap.jpeg" },
      { name: "Simply Veg Momos", price: 60, subcategory: "Momos", image: "/images/wraps/veg-momos.jpeg" },
      { name: "Paneer Tikka Momos", price: 80, subcategory: "Momos", image: "/images/wraps/paneer-tikka-momos.jpeg" },
    ],
  },
  {
    name: "Sides & Snacks",
    items: [
      { name: "Simply Salted Fries", price: 80, subcategory: "Fries", image: "/images/sides/salted-fries.jpeg" },
      { name: "Peri Peri Fries", price: 95, subcategory: "Fries", image: "/images/sides/peri-peri-fries.jpeg" },
      { name: "Masala Veg Corn Chaat", price: 99, subcategory: "Chaat Corner", image: "/images/sides/masala-veg-corn-chaat.jpeg" },
      { name: "Magic Tornado", price: 75, subcategory: "Potato Tornado", image: "/images/sides/magic-tornado.jpeg" },
      { name: "Cheese Corn Nuggets", price: 140, subcategory: "Shots & Nuggets", image: "/images/sides/cheese-corn-nuggets.jpeg" },
      { name: "Cheese Garlic Bread", price: 60, subcategory: "Garlic Bread", image: "/images/sides/cheese-garlic-bread.jpeg" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Vanilla Ice Cream", price: 35, subcategory: "Ice Cream", image: "/images/desserts/vanilla-ice-cream.jpeg" },
      { name: "Chocolate Ice Cream", price: 55, subcategory: "Ice Cream", image: "/images/desserts/chocolate-ice-cream.jpeg" },
      { name: "Hot Chocolate Fudge", price: 149, subcategory: "Choco Cream Sundae", image: "/images/desserts/hot-chocolate-fudge.jpeg" },
      { name: "Brownie Special", price: 99, subcategory: "Brownie Special", image: "/images/desserts/brownie-special.jpeg" },
      { name: "Brownie With Ice Cream", price: 129, subcategory: "Brownie Special", image: "/images/desserts/brownie-with-ice-cream.jpeg" },
      { name: "Kitkat Choco", price: 139, subcategory: "Choco", image: "/images/desserts/kitkat-choco.jpeg" },
    ],
  },
  {
    name: "Combo Deals",
    items: [
      { name: "Combo Deal 1", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-1.png" },
      { name: "Combo Deal 2", price: 269, subcategory: "Combo", image: "/images/combos/combo-deal-2.png" },
      { name: "Combo Deal 3", price: 249, subcategory: "Combo", image: "/images/combos/combo-deal-3.png" },
      { name: "Combo Deal 4", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-4.png" },
      { name: "Combo Deal 5", price: 259, subcategory: "Combo", image: "/images/combos/combo-deal-5.png" },
      { name: "Combo Deal 6", price: 219, subcategory: "Combo", image: "/images/combos/combo-deal-6.png" },
    ],
  },
];