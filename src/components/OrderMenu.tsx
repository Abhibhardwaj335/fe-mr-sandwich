import React from "react";
import { menuItems } from "@/data/menuItems";
import type { MenuItem } from "@/data/menuItems";

const OrderMenu = () => {
  const groupedMenu = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div>
      {Object.entries(groupedMenu).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-xl font-bold mt-4 mb-2">{category}</h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border p-2 rounded">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                <h3 className="font-semibold">{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMenu;
