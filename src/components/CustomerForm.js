import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CustomerForm({ existing }) {
  const [form, setForm] = useState(
    existing || {
      name: "",
      dateOfBirth: "",
      nicNumber: "",
      mobileNumbers: [""],
      addresses: [
        {
          addressLine1: "",
          addressLine2: "",
          cityId: "",
          cityName: "",
          countryName: "",
        },
      ],
      familyMembers: [
        {
          familyMemberName: "",
          nicNumber: "",
          dateOfBirth: "",
        },
      ],
    }
  );

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [citiesResponse, countriesResponse] = await Promise.all([
          axios.get("/api/customers/cities"),
          axios.get("/api/customers/countries"),
        ]);
        setCities(citiesResponse.data);
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        alert("Error loading cities and countries data");
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (index, value) => {
    const newNumbers = [...form.mobileNumbers];
    newNumbers[index] = value;
    setForm({ ...form, mobileNumbers: newNumbers });
  };

  const addMobile = () => {
    setForm({ ...form, mobileNumbers: [...form.mobileNumbers, ""] });
  };

  const removeMobile = (index) => {
    const newNumbers = form.mobileNumbers.filter((_, i) => i !== index);
    setForm({ ...form, mobileNumbers: newNumbers });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...form.addresses];

    if (field === "cityId") {
      // Find the selected city and update both cityId and cityName
      const selectedCity = cities.find((city) => city.id === parseInt(value));
      newAddresses[index].cityId = value;
      newAddresses[index].cityName = selectedCity ? selectedCity.name : "";
    } else if (field === "countryName") {
      // Only update countryName, no countryId needed
      newAddresses[index].countryName = value;
    } else {
      newAddresses[index][field] = value;
    }

    setForm({ ...form, addresses: newAddresses });
  };

  const addAddress = () => {
    setForm({
      ...form,
      addresses: [
        ...form.addresses,
        {
          addressLine1: "",
          addressLine2: "",
          cityId: "",
          cityName: "",
          countryName: "",
        },
      ],
    });
  };

  const removeAddress = (index) => {
    const newAddresses = form.addresses.filter((_, i) => i !== index);
    setForm({ ...form, addresses: newAddresses });
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const newFamilyMembers = [...form.familyMembers];
    newFamilyMembers[index][field] = value;
    setForm({ ...form, familyMembers: newFamilyMembers });
  };

  const addFamilyMember = () => {
    setForm({
      ...form,
      familyMembers: [
        ...form.familyMembers,
        { familyMemberName: "", nicNumber: "", dateOfBirth: "" },
      ],
    });
  };

  const removeFamilyMember = (index) => {
    const newFamilyMembers = form.familyMembers.filter((_, i) => i !== index);
    setForm({ ...form, familyMembers: newFamilyMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existing?.id) {
        await axios.put(`/api/customers/${existing.id}`, form);
        alert("Customer updated!");
      } else {
        await axios.post("/api/customers", form);
        alert("Customer created!");
        setForm({
          name: "",
          dateOfBirth: "",
          nicNumber: "",
          mobileNumbers: [""],
          addresses: [
            {
              addressLine1: "",
              addressLine2: "",
              cityId: "",
              cityName: "",
              countryName: "",
            },
          ],
          familyMembers: [
            { familyMemberName: "", nicNumber: "", dateOfBirth: "" },
          ],
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred!");
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "20px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "16px",
      marginBottom: "10px",
    },
    select: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "16px",
      backgroundColor: "white",
      cursor: "pointer",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    buttonSecondary: {
      padding: "8px 12px",
      backgroundColor: "#f5f5f5",
      color: "#333",
      border: "1px solid #ccc",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    buttonDanger: {
      padding: "8px 12px",
      backgroundColor: "#d32f2f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    section: {
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      backgroundColor: "#fafafa",
    },
    sectionTitle: {
      margin: "0 0 15px 0",
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      borderBottom: "2px solid #1976d2",
      paddingBottom: "5px",
    },
    flexRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    addressGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginBottom: "10px",
    },
    familyMemberCard: {
      marginBottom: "15px",
      padding: "15px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      border: "1px solid #ddd",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#666",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>👤 {existing ? "Update" : "Create"} Customer</h2>
        <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
          ⏳ Loading master data...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>👤 {existing ? "Update" : "Create"} Customer</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Basic Information</h3>

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="nicNumber"
            placeholder="NIC Number"
            value={form.nicNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mobile Numbers Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📱 Mobile Numbers</h3>
          {form.mobileNumbers.map((num, index) => (
            <div key={index} style={styles.flexRow}>
              <input
                style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                type="tel"
                placeholder={`Mobile ${index + 1}`}
                value={num}
                onChange={(e) => handleMobileChange(index, e.target.value)}
              />
              {form.mobileNumbers.length > 1 && (
                <button
                  type="button"
                  style={styles.buttonDanger}
                  onClick={() => removeMobile(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={addMobile}
          >
            + Add Mobile Number
          </button>
        </div>

        {/* Addresses Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏠 Addresses</h3>
          {form.addresses.map((addr, index) => (
            <div key={index} style={styles.familyMemberCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Address {index + 1}</span>
                {form.addresses.length > 1 && (
                  <button
                    type="button"
                    style={styles.buttonDanger}
                    onClick={() => removeAddress(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                style={styles.input}
                type="text"
                placeholder="Address Line 1"
                value={addr.addressLine1}
                onChange={(e) =>
                  handleAddressChange(index, "addressLine1", e.target.value)
                }
              />

              <input
                style={styles.input}
                type="text"
                placeholder="Address Line 2"
                value={addr.addressLine2}
                onChange={(e) =>
                  handleAddressChange(index, "addressLine2", e.target.value)
                }
              />

              <div style={styles.addressGrid}>
                <select
                  style={styles.select}
                  value={addr.cityId}
                  onChange={(e) =>
                    handleAddressChange(index, "cityId", e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

                <select
                  style={styles.select}
                  value={addr.countryName}
                  onChange={(e) =>
                    handleAddressChange(index, "countryName", e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={addAddress}
          >
            + Add Address
          </button>
        </div>

        {/* Family Members Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👨‍👩‍👧‍👦 Family Members</h3>
          {form.familyMembers.map((member, index) => (
            <div key={index} style={styles.familyMemberCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Family Member {index + 1}</span>
                {form.familyMembers.length > 1 && (
                  <button
                    type="button"
                    style={styles.buttonDanger}
                    onClick={() => removeFamilyMember(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                style={styles.input}
                type="text"
                placeholder="Family Member Name"
                value={member.familyMemberName}
                onChange={(e) =>
                  handleFamilyMemberChange(
                    index,
                    "familyMemberName",
                    e.target.value
                  )
                }
              />

              <div style={styles.addressGrid}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="NIC Number"
                  value={member.nicNumber}
                  onChange={(e) =>
                    handleFamilyMemberChange(index, "nicNumber", e.target.value)
                  }
                />
                <input
                  style={styles.input}
                  type="date"
                  placeholder="Date of Birth"
                  value={member.dateOfBirth}
                  onChange={(e) =>
                    handleFamilyMemberChange(
                      index,
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={addFamilyMember}
          >
            + Add Family Member
          </button>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            padding: "15px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {existing ? "📝 Update Customer" : "➕ Create Customer"}
        </button>
      </form>
    </div>
  );
}
