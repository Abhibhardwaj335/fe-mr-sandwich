import React, { useState } from "react";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  UserPlus,
  Gift,
  MessageCircle,
  QrCode,
  Ticket,
  LayoutDashboard,
  LogIn,
  Menu
} from "lucide-react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <div className="text-2xl font-bold mb-6">🍔 Mr. Sandwich</div>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.to}
            button
            component={NavLink}
            to={item.to}
            onClick={toggleDrawer(false)}
            className={({ isActive }: any) =>
              `rounded-lg px-3 py-2 transition-all ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
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

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top AppBar */}
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          {/* Mobile menu icon */}
          <div className="block md:hidden">
            <IconButton onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mx-auto md:mx-0">
            {navItems.find((item) => item.to === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
