import { useState } from "react";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Gift,
  MessageCircle,
  QrCode,
  Ticket,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
} from "lucide-react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

interface MainLayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const navItems = [
  { to: "/", label: "Order", icon: <Home /> },
  { to: "/customer-dashboard", label: "Customer Dashboard", icon: <LayoutDashboard /> },
  { to: "/expense-dashboard", label: "Expense Dashboard", icon: <LayoutDashboard /> },
  { to: "/send-whatsapp", label: "Send WhatsApp", icon: <MessageCircle /> },
  { to: "/rewards", label: "Manage Rewards", icon: <Gift /> },
  { to: "/coupons", label: "Manage Coupons", icon: <Ticket /> },
  { to: "/generate-qr", label: "Generate QR", icon: <QrCode /> },
  { to: "/login", label: "Login", icon: <LogIn /> },
];

export default function MainLayout({ children, isAuthenticated, setIsAuthenticated }: MainLayoutProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole"); // Clear the role
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDrawer = (open: boolean) => () => {
    setMobileOpen(open);
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!isAuthenticated) {
      return ["/login"].includes(item.to);
    } else {
      return item.to !== "/login";
    }
  });

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <div className="text-2xl font-bold mb-6">🍔 Mr. Sandwich</div>
      <List>
        {filteredNavItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={toggleDrawer(false)}
            sx={{
              borderRadius: "8px",
              marginBottom: "6px",
              "&.active": {
                backgroundColor: "#DBEAFE",
                color: "#1D4ED8",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {isAuthenticated && (
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogOut />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="bg-white shadow-md p-4 hidden md:block" style={{ minWidth: "250px", width: "18%", maxWidth: "300px" }}>
        <div className="text-2xl font-bold mb-6">🍔 Mr. Sandwich</div>
        <nav className="space-y-2">
          {filteredNavItems.map((item) => (
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
        {isAuthenticated && (
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200"
            >
              <LogOut />
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="block md:hidden">
            <IconButton onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mx-auto md:mx-0">
             {isAuthenticated ? `Welcome Back, Admin! 🍔` : `Welcome to Mr. Sandwich! 🍔`}
          </h1>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
