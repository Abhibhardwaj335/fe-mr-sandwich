import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import SendWhatsApp from "./SendWhatsApp";
import ManageRewards from "./ManageRewards";
import { Box, Button } from "@mui/material";

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button variant="contained" component={Link} to="/" sx={{ mr: 2 }}>
          Customer Form
        </Button>
        <Button variant="contained" component={Link} to="/send-whatsapp" sx={{ mr: 2 }}>
          Send WhatsApp
        </Button>
        <Button variant="contained" component={Link} to="/rewards">
          Manage Rewards
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/send-whatsapp" element={<SendWhatsApp />} />
        <Route path="/rewards" element={<ManageRewards />} />
      </Routes>
    </Router>
  );
};

export default App;