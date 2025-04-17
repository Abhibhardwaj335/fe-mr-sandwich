import React, { useState } from "react";
import { menuCategories } from "../components/data/menuItems";
import MenuView from "../components/MenuView";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart } from "lucide-react";



interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
  count: number;
}

const OrderPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].name);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"menu" | "cart">("menu");

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  const handleAddItem = (item: CartItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev;
      return [...prev, { ...item, count: 1 }];
    });
  };

  const handleIncrease = (id: number) =>
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i))
    );

  const handleDecrease = (id: number) =>
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === id && i.count > 1 ? { ...i, count: i.count - 1 } : i
      )
    );

  const handleRemove = (id: number) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));

  const handleSubmit = () => {
    alert("✅ Order submitted!");
    setSelectedItems([]);
    setView("menu");
  };

  return (
    <CenteredFormLayout title="Place Order" icon={<ShoppingCart />}>
      {view === "menu" ? (
        <>
          {/* Top category buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {menuCategories.map((cat) => (
              <button
                key={cat.name}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  selectedCategory === cat.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {activeCategory && (
            <MenuView
              menuItems={activeCategory.items}
              onAddItem={handleAddItem}
              onNext={() => setView("cart")}
              showSubcategories={true}
            />
          )}
        </>
      ) : (
        <ReviewCart
          selectedItems={selectedItems}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onSubmit={handleSubmit}
        />
      )}
    </CenteredFormLayout>
  );
};

export default OrderPage;
