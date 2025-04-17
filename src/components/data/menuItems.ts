export interface MenuItem {
  id: number;
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
      { id: 1, name: "Vanilla Shake", price: 79, subcategory: "Cream Shakes", image: "../../images/Creamy_Oreo_Milkshake.jpg" },
      { id: 2, name: "Strawberry Shake", price: 79, subcategory: "Cream Shakes", image: "/images/beverages/strawberry-shake.jpg" },
      { id: 3, name: "Pista Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/pista-shake.jpg" },
      { id: 4, name: "Butterscotch Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/butterscotch-shake.jpg" },
      { id: 5, name: "Chocolate Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/chocolate-shake.jpg" },
      { id: 6, name: "Oreo Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/oreo-shake.jpg" },
      { id: 7, name: "Kitkat Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/kitkat-shake.jpg" },
      { id: 8, name: "Mint Mojito", price: 79, subcategory: "Mocktails", image: "/images/beverages/mint-mojito.jpg" },
      { id: 9, name: "Blue Lagoon", price: 89, subcategory: "Mocktails", image: "/images/beverages/blue-lagoon.jpg" },
      { id: 10, name: "Crunch Plain", price: 99, subcategory: "Special Cold Coffee", image: "/images/beverages/crunch-plain.jpg" },
      { id: 11, name: "Hot Chocolate", price: 69, subcategory: "Special Hot", image: "/images/beverages/hot-chocolate.jpg" },
      { id: 12, name: "Masala Tea", price: 40, subcategory: "Tea", image: "/images/beverages/masala-tea.jpg" },
      { id: 13, name: "Mango Mastani", price: 109, subcategory: "Special Mastani", image: "/images/beverages/mango-mastani.jpg" },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      { id: 14, name: "Mr Sandwich Mix Veg", price: 149, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/mr-sandwich-mix-veg.jpg" },
      { id: 15, name: "Paneer Tandoori", price: 159, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/paneer-tandoori.jpg" },
      { id: 16, name: "Exotic Cheese Sub", price: 199, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/exotic-cheese-sub.jpg" },
      { id: 17, name: "Veg Sandwich", price: 85, subcategory: "Brown Club Grilled", image: "/images/sandwiches/veg-sandwich.jpg" },
      { id: 18, name: "Corn Sandwich", price: 100, subcategory: "Brown Club Grilled", image: "/images/sandwiches/corn-sandwich.jpg" },
      { id: 19, name: "Chocolate Sandwich", price: 95, subcategory: "Brown Club Grilled", image: "/images/sandwiches/chocolate-sandwich.jpg" },
      { id: 20, name: "Spicy Paneer Grilled", price: 140, subcategory: "Brown Club Grilled", image: "/images/sandwiches/spicy-paneer-grilled.jpg" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { id: 21, name: "Margherita Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/margherita-pizza.jpg" },
      { id: 22, name: "Veg Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/veg-pizza.jpg" },
      { id: 23, name: "Tandoori Pizza", price: 135, subcategory: "Regular pizza", image: "/images/pizza/tandoori-pizza.jpg" },
      { id: 24, name: "Paneer Pizza", price: 140, subcategory: "Regular pizza", image: "/images/pizza/paneer-pizza.jpg" },
      { id: 25, name: "Peppy Paneer Pizza", price: 140, subcategory: "Premium pizza", image: "/images/pizza/peppy-paneer-pizza.jpg" },
      { id: 26, name: "Mushroom Delite Pizza", price: 160, subcategory: "Premium pizza", image: "/images/pizza/mushroom-delite-pizza.jpg" },
      { id: 27, name: "Paneer Makhani Pizza", price: 150, subcategory: "Premium pizza", image: "/images/pizza/paneer-makhani-pizza.jpg" },
    ],
  },
  {
    name: "Burgers",
    items: [
      { id: 28, name: "Simply Burger", price: 60, subcategory: "Brown Burger", image: "/images/burgers/simply-burger.jpg" },
      { id: 29, name: "Cheese Burger", price: 80, subcategory: "Brown Burger", image: "/images/burgers/cheese-burger.jpg" },
      { id: 30, name: "Paneer Burger", price: 99, subcategory: "Brown Burger", image: "/images/burgers/paneer-burger.jpg" },
      { id: 31, name: "Classic Burger", price: 125, subcategory: "Brown Burger", image: "/images/burgers/classic-burger.jpg" },
      { id: 32, name: "Aloo Crunch", price: 90, subcategory: "Aloo Tikki Veg", image: "/images/burgers/aloo-crunch.jpg" },
      { id: 33, name: "Spicy Paneer Crunch", price: 140, subcategory: "Aloo Tikki Veg", image: "/images/burgers/spicy-paneer-crunch.jpg" },
    ],
  },
  {
    name: "Pasta & Maggie",
    items: [
      { id: 34, name: "Red Sauce Pasta", price: 149, subcategory: "Pasta", image: "/images/pasta/red-sauce-pasta.jpg" },
      { id: 35, name: "White Sauce Pasta", price: 199, subcategory: "Pasta", image: "/images/pasta/white-sauce-pasta.jpg" },
      { id: 36, name: "Mushroom Cheese Pasta", price: 189, subcategory: "Pasta", image: "/images/pasta/mushroom-cheese-pasta.jpg" },
      { id: 37, name: "Plain Maggie", price: 50, subcategory: "Maggie", image: "/images/pasta/plain-maggie.jpg" },
      { id: 38, name: "Cheese Maggie", price: 65, subcategory: "Maggie", image: "/images/pasta/cheese-maggie.jpg" },
      { id: 39, name: "Paneer Maggie", price: 75, subcategory: "Maggie", image: "/images/pasta/paneer-maggie.jpg" },
    ],
  },
  {
    name: "Wraps & Momos",
    items: [
      { id: 40, name: "Aloo Tikki Wrap", price: 65, subcategory: "Wrap", image: "/images/wraps/aloo-tikki-wrap.jpg" },
      { id: 41, name: "Paneer Wrap", price: 105, subcategory: "Wrap", image: "/images/wraps/paneer-wrap.jpg" },
      { id: 42, name: "Tandoori Paneer Wrap", price: 120, subcategory: "Wrap", image: "/images/wraps/tandoori-paneer-wrap.jpg" },
      { id: 43, name: "Simply Veg Momos", price: 60, subcategory: "Momos", image: "/images/wraps/veg-momos.jpg" },
      { id: 44, name: "Paneer Tikka Momos", price: 80, subcategory: "Momos", image: "/images/wraps/paneer-tikka-momos.jpg" },
    ],
  },
  {
    name: "Sides & Snacks",
    items: [
      { id: 45, name: "Simply Salted Fries", price: 80, subcategory: "Fries", image: "/images/sides/salted-fries.jpg" },
      { id: 46, name: "Peri Peri Fries", price: 95, subcategory: "Fries", image: "/images/sides/peri-peri-fries.jpg" },
      { id: 47, name: "Masala Veg Corn Chaat", price: 99, subcategory: "Chaat Corner", image: "/images/sides/masala-veg-corn-chaat.jpg" },
      { id: 48, name: "Magic Tornado", price: 75, subcategory: "Potato Tornado", image: "/images/sides/magic-tornado.jpg" },
      { id: 49, name: "Cheese Corn Nuggets", price: 140, subcategory: "Shots & Nuggets", image: "/images/sides/cheese-corn-nuggets.jpg" },
      { id: 50, name: "Cheese Garlic Bread", price: 60, subcategory: "Garlic Bread", image: "/images/sides/cheese-garlic-bread.jpg" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { id: 51, name: "Vanilla Ice Cream", price: 35, subcategory: "Ice Cream", image: "/images/desserts/vanilla-ice-cream.jpg" },
      { id: 52, name: "Chocolate Ice Cream", price: 55, subcategory: "Ice Cream", image: "/images/desserts/chocolate-ice-cream.jpg" },
      { id: 53, name: "Hot Chocolate Fudge", price: 149, subcategory: "Choco Cream Sundae", image: "/images/desserts/hot-chocolate-fudge.jpg" },
      { id: 54, name: "Brownie Special", price: 99, subcategory: "Brownie Special", image: "/images/desserts/brownie-special.jpg" },
      { id: 55, name: "Brownie With Ice Cream", price: 129, subcategory: "Brownie Special", image: "/images/desserts/brownie-with-ice-cream.jpg" },
      { id: 56, name: "Kitkat Choco", price: 139, subcategory: "Choco", image: "/images/desserts/kitkat-choco.jpg" },
    ],
  },
  {
    name: "Combo Deals",
    items: [
      { id: 57, name: "Combo Deal 1", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-1.jpg" },
      { id: 58, name: "Combo Deal 2", price: 269, subcategory: "Combo", image: "/images/combos/combo-deal-2.jpg" },
      { id: 59, name: "Combo Deal 3", price: 249, subcategory: "Combo", image: "/images/combos/combo-deal-3.jpg" },
      { id: 60, name: "Combo Deal 4", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-4.jpg" },
      { id: 61, name: "Combo Deal 5", price: 259, subcategory: "Combo", image: "/images/combos/combo-deal-5.jpg" },
      { id: 62, name: "Combo Deal 6", price: 219, subcategory: "Combo", image: "/images/combos/combo-deal-6.jpg" },
    ],
  },
];