import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomerForm from "../components/CustomerForm";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios.get(`/api/customers/${id}`).then((res) => setCustomer(res.data));
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  return <CustomerForm existing={customer} />;
}
