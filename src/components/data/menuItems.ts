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
      { name: "Vanilla Shake", price: 79, subcategory: "Cream Shakes", image: "../../images/Creamy_Oreo_Milkshake.jpg" },
      { name: "Strawberry Shake", price: 79, subcategory: "Cream Shakes", image: "/images/beverages/strawberry-shake.jpg" },
      { name: "Pista Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/pista-shake.jpg" },
      { name: "Butterscotch Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/butterscotch-shake.jpg" },
      { name: "Chocolate Shake", price: 89, subcategory: "Cream Shakes", image: "/images/beverages/chocolate-shake.jpg" },
      { name: "Oreo Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/oreo-shake.jpg" },
      { name: "Kitkat Shake", price: 119, subcategory: "Cream Shakes", image: "/images/beverages/kitkat-shake.jpg" },
      { name: "Mint Mojito", price: 79, subcategory: "Mocktails", image: "/images/beverages/mint-mojito.jpg" },
      { name: "Blue Lagoon", price: 89, subcategory: "Mocktails", image: "/images/beverages/blue-lagoon.jpg" },
      { name: "Crunch Plain", price: 99, subcategory: "Special Cold Coffee", image: "/images/beverages/crunch-plain.jpg" },
      { name: "Hot Chocolate", price: 69, subcategory: "Special Hot", image: "/images/beverages/hot-chocolate.jpg" },
      { name: "Masala Tea", price: 40, subcategory: "Tea", image: "/images/beverages/masala-tea.jpg" },
      { name: "Mango Mastani", price: 109, subcategory: "Special Mastani", image: "/images/beverages/mango-mastani.jpg" },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      { name: "Mr Sandwich Mix Veg", price: 149, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/mr-sandwich-mix-veg.jpg" },
      { name: "Paneer Tandoori", price: 159, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/paneer-tandoori.jpg" },
      { name: "Exotic Cheese Sub", price: 199, subcategory: "Mr. Sandwich Special-Multigrain", image: "/images/sandwiches/exotic-cheese-sub.jpg" },
      { name: "Veg Sandwich", price: 85, subcategory: "Brown Club Grilled", image: "/images/sandwiches/veg-sandwich.jpg" },
      { name: "Corn Sandwich", price: 100, subcategory: "Brown Club Grilled", image: "/images/sandwiches/corn-sandwich.jpg" },
      { name: "Chocolate Sandwich", price: 95, subcategory: "Brown Club Grilled", image: "/images/sandwiches/chocolate-sandwich.jpg" },
      { name: "Spicy Paneer Grilled", price: 140, subcategory: "Brown Club Grilled", image: "/images/sandwiches/spicy-paneer-grilled.jpg" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { name: "Margherita Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/margherita-pizza.jpg" },
      { name: "Veg Pizza", price: 120, subcategory: "Regular pizza", image: "/images/pizza/veg-pizza.jpg" },
      { name: "Tandoori Pizza", price: 135, subcategory: "Regular pizza", image: "/images/pizza/tandoori-pizza.jpg" },
      { name: "Paneer Pizza", price: 140, subcategory: "Regular pizza", image: "/images/pizza/paneer-pizza.jpg" },
      { name: "Peppy Paneer Pizza", price: 140, subcategory: "Premium pizza", image: "/images/pizza/peppy-paneer-pizza.jpg" },
      { name: "Mushroom Delite Pizza", price: 160, subcategory: "Premium pizza", image: "/images/pizza/mushroom-delite-pizza.jpg" },
      { name: "Paneer Makhani Pizza", price: 150, subcategory: "Premium pizza", image: "/images/pizza/paneer-makhani-pizza.jpg" },
    ],
  },
  {
    name: "Burgers",
    items: [
      { name: "Simply Burger", price: 60, subcategory: "Brown Burger", image: "/images/burgers/simply-burger.jpg" },
      { name: "Cheese Burger", price: 80, subcategory: "Brown Burger", image: "/images/burgers/cheese-burger.jpg" },
      { name: "Paneer Burger", price: 99, subcategory: "Brown Burger", image: "/images/burgers/paneer-burger.jpg" },
      { name: "Classic Burger", price: 125, subcategory: "Brown Burger", image: "/images/burgers/classic-burger.jpg" },
      { name: "Aloo Crunch", price: 90, subcategory: "Aloo Tikki Veg", image: "/images/burgers/aloo-crunch.jpg" },
      { name: "Spicy Paneer Crunch", price: 140, subcategory: "Aloo Tikki Veg", image: "/images/burgers/spicy-paneer-crunch.jpg" },
    ],
  },
  {
    name: "Pasta & Maggie",
    items: [
      { name: "Red Sauce Pasta", price: 149, subcategory: "Pasta", image: "/images/pasta/red-sauce-pasta.jpg" },
      { name: "White Sauce Pasta", price: 199, subcategory: "Pasta", image: "/images/pasta/white-sauce-pasta.jpg" },
      { name: "Mushroom Cheese Pasta", price: 189, subcategory: "Pasta", image: "/images/pasta/mushroom-cheese-pasta.jpg" },
      { name: "Plain Maggie", price: 50, subcategory: "Maggie", image: "/images/pasta/plain-maggie.jpg" },
      { name: "Cheese Maggie", price: 65, subcategory: "Maggie", image: "/images/pasta/cheese-maggie.jpg" },
      { name: "Paneer Maggie", price: 75, subcategory: "Maggie", image: "/images/pasta/paneer-maggie.jpg" },
    ],
  },
  {
    name: "Wraps & Momos",
    items: [
      { name: "Aloo Tikki Wrap", price: 65, subcategory: "Wrap", image: "/images/wraps/aloo-tikki-wrap.jpg" },
      { name: "Paneer Wrap", price: 105, subcategory: "Wrap", image: "/images/wraps/paneer-wrap.jpg" },
      { name: "Tandoori Paneer Wrap", price: 120, subcategory: "Wrap", image: "/images/wraps/tandoori-paneer-wrap.jpg" },
      { name: "Simply Veg Momos", price: 60, subcategory: "Momos", image: "/images/wraps/veg-momos.jpg" },
      { name: "Paneer Tikka Momos", price: 80, subcategory: "Momos", image: "/images/wraps/paneer-tikka-momos.jpg" },
    ],
  },
  {
    name: "Sides & Snacks",
    items: [
      { name: "Simply Salted Fries", price: 80, subcategory: "Fries", image: "/images/sides/salted-fries.jpg" },
      { name: "Peri Peri Fries", price: 95, subcategory: "Fries", image: "/images/sides/peri-peri-fries.jpg" },
      { name: "Masala Veg Corn Chaat", price: 99, subcategory: "Chaat Corner", image: "/images/sides/masala-veg-corn-chaat.jpg" },
      { name: "Magic Tornado", price: 75, subcategory: "Potato Tornado", image: "/images/sides/magic-tornado.jpg" },
      { name: "Cheese Corn Nuggets", price: 140, subcategory: "Shots & Nuggets", image: "/images/sides/cheese-corn-nuggets.jpg" },
      { name: "Cheese Garlic Bread", price: 60, subcategory: "Garlic Bread", image: "/images/sides/cheese-garlic-bread.jpg" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Vanilla Ice Cream", price: 35, subcategory: "Ice Cream", image: "/images/desserts/vanilla-ice-cream.jpg" },
      { name: "Chocolate Ice Cream", price: 55, subcategory: "Ice Cream", image: "/images/desserts/chocolate-ice-cream.jpg" },
      { name: "Hot Chocolate Fudge", price: 149, subcategory: "Choco Cream Sundae", image: "/images/desserts/hot-chocolate-fudge.jpg" },
      { name: "Brownie Special", price: 99, subcategory: "Brownie Special", image: "/images/desserts/brownie-special.jpg" },
      { name: "Brownie With Ice Cream", price: 129, subcategory: "Brownie Special", image: "/images/desserts/brownie-with-ice-cream.jpg" },
      { name: "Kitkat Choco", price: 139, subcategory: "Choco", image: "/images/desserts/kitkat-choco.jpg" },
    ],
  },
  {
    name: "Combo Deals",
    items: [
      { name: "Combo Deal 1", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-1.jpg" },
      { name: "Combo Deal 2", price: 269, subcategory: "Combo", image: "/images/combos/combo-deal-2.jpg" },
      { name: "Combo Deal 3", price: 249, subcategory: "Combo", image: "/images/combos/combo-deal-3.jpg" },
      { name: "Combo Deal 4", price: 215, subcategory: "Combo", image: "/images/combos/combo-deal-4.jpg" },
      { name: "Combo Deal 5", price: 259, subcategory: "Combo", image: "/images/combos/combo-deal-5.jpg" },
      { name: "Combo Deal 6", price: 219, subcategory: "Combo", image: "/images/combos/combo-deal-6.jpg" },
    ],
  },
];