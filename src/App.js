import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import CustomerForm from "./components/CustomerForm";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-customer" element={<CustomerForm />} />
          <Route path="/edit-customer/:id" element={<CustomerForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
