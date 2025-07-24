import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import CustomerForm from "./CustomerForm";

export default function EditCustomerPage() {
  const { id } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`api/customers/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  if (loading) return <div>Loading customer data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customerData) return <div>Customer not found</div>;

  return <CustomerForm existing={customerData} />;
}
