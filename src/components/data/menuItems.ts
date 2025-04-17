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
      { id: 1, name: "Oreo Cream Shake", price: 99, subcategory: "Cream Shakes", image: "https://via.placeholder.com/150" },
      { id: 2, name: "Blue Lagoon", price: 89, subcategory: "Mocktails", image: "https://via.placeholder.com/150" },
      { id: 3, name: "Cold Coffee", price: 109, subcategory: "Special Cold Coffee", image: "https://via.placeholder.com/150" },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      { id: 4, name: "Brown Club Paneer", price: 129, subcategory: "Brown Club Grilled", image: "https://via.placeholder.com/150" },
      { id: 5, name: "Veg Multigrain Delight", price: 159, subcategory: "Mr. Sandwich Special-Multigrain", image: "https://via.placeholder.com/150" },
    ],
  },
  {
    name: "Pizza",
    items: [
      { id: 6, name: "Regular Margherita", price: 120, subcategory: "Regular pizza", image: "https://via.placeholder.com/150" },
      { id: 7, name: "Paneer Tikka Premium", price: 199, subcategory: "Premium pizza", image: "https://via.placeholder.com/150" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { id: 8, name: "Brownie with Ice Cream", price: 179, subcategory: "Brownie Special", image: "https://via.placeholder.com/150" },
      { id: 9, name: "Vanilla Ice Cream", price: 40, subcategory: "Ice Cream", image: "https://via.placeholder.com/150" },
    ],
  },
];
