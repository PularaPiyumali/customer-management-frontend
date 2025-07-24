import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import CustomerForm from "./components/CustomerForm";
import EditCustomerPage from "./components/EditCustomerPage";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth={false} sx={{ px: 3 }}>
          <Box
            sx={{
              py: 3,
              borderBottom: "2px solid #000",
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Customer Management System
            </Typography>
          </Box>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-customer" element={<CustomerForm />} />
            <Route path="/edit-customer/:id" element={<EditCustomerPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}
