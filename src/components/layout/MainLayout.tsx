// components/layout/MainLayout.tsx

import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, UserPlus, Gift, MessageCircle, QrCode, Ticket, LayoutDashboard, LogIn } from "lucide-react";

const navItems = [
  { to: "/order", label: "Order", icon: <Home /> },
  { to: "/generate-qr", label: "Generate QR", icon: <QrCode /> },
  { to: "/", label: "Customer Form", icon: <UserPlus /> },
  { to: "/send-whatsapp", label: "Send WhatsApp", icon: <MessageCircle /> },
  { to: "/rewards", label: "Manage Rewards", icon: <Gift /> },
  { to: "/coupons", label: "Manage Coupons", icon: <Ticket /> },
  { to: "/customer-dashboard", label: "Customer Dashboard", icon: <LayoutDashboard /> },
  { to: "/login", label: "Login", icon: <LogIn /> },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-md p-4 hidden md:block">
        <div className="text-2xl font-bold mb-6">🍔 Mr. Sandwich</div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top AppBar */}
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find((item) => item.to === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
