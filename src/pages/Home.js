import React from "react";
import CustomerTable from "../components/CustomerTable";
import ExcelUpload from "../components/ExcelUpload";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customer Management System
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/add-customer")}
        >
          Add New Customer
        </Button>
      </Box>
      <ExcelUpload />
      <CustomerTable />
    </Container>
  );
}
