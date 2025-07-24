import React from "react";
import CustomerTable from "../components/CustomerTable";
import ExcelUpload from "../components/ExcelUpload";
import { Container, Button, Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth={false} sx={{ px: 3 }}>
      <Card sx={{ mb: 3, boxShadow: 2, maxWidth: "90%", mx: "auto" }}>
        <CardContent>
          <ExcelUpload />
        </CardContent>
      </Card>
      <Card sx={{ boxShadow: 2, maxWidth: "90%", mx: "auto" }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              onClick={() => navigate("/add-customer")}
              sx={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              New Customer +
            </Button>
          </Box>
          <CustomerTable />
        </CardContent>
      </Card>
    </Container>
  );
}
