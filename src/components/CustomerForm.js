import React, { useState, useEffect } from "react";
import api from "../services/api";

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

  //Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        console.log("Fetching master data...");

        const [citiesResponse, countriesResponse] = await Promise.all([
          api.get("api/customers/cities"),
          api.get("api/customers/countries"),
        ]);

        console.log("Cities Response:", citiesResponse);
        console.log("Cities Data:", citiesResponse.data);
        console.log("Countries Response:", countriesResponse);
        console.log("Countries Data:", countriesResponse.data);

        setCities(citiesResponse.data);
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
        });
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
      //Find the selected city and update both cityId and cityName
      const selectedCity = cities.find((city) => city.id === parseInt(value));
      console.log("Selected city:", selectedCity);
      newAddresses[index].cityId = value;
      newAddresses[index].cityName = selectedCity ? selectedCity.name : "";
    } else if (field === "countryName") {
      //Update countryName
      console.log("Selected country:", value);
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

    //Filter out empty family members
    const filteredForm = {
      ...form,
      familyMembers: form.familyMembers.filter(
        (member) =>
          member.familyMemberName.trim() !== "" ||
          member.nicNumber.trim() !== "" ||
          member.dateOfBirth.trim() !== ""
      ),
    };

    console.log("Submitting form data:");
    console.log("Original form:", form);
    console.log("Filtered form:", filteredForm);
    console.log("Form JSON:", JSON.stringify(filteredForm, null, 2));

    try {
      let response;

      if (existing?.id) {
        console.log(`Updating customer with ID: ${existing.id}`);
        console.log("PUT Request URL:", `api/customers/${existing.id}`);
        console.log("PUT Request Data:", filteredForm);

        response = await api.put(`api/customers/${existing.id}`, filteredForm);

        console.log("Update Response:", response);
        console.log("Update Response Data:", response.data);
        console.log("Update Response Status:", response.status);
        console.log("Update Response Headers:", response.headers);

        alert("Customer updated!");
      } else {
        console.log("Creating new customer");
        console.log("POST Request URL:", "api/customers");
        console.log("POST Request Data:", filteredForm);

        response = await api.post("api/customers", filteredForm);

        console.log("Create Response:", response);
        console.log("Create Response Data:", response.data);
        console.log("Create Response Status:", response.status);
        console.log("Create Response Headers:", response.headers);

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
      console.error("Submit Error:", err);
      console.error("Error Message:", err.message);
      console.error("Error Response:", err.response);
      console.error("Error Status:", err.response?.status);
      console.error("Error Data:", err.response?.data);
      console.error("Error Headers:", err.response?.headers);
      console.error(
        "Full Error Object:",
        JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
      );

      alert("Error occurred!");
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "20px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e0e0e0",
      overflow: "hidden",
    },
    cardHeader: {
      backgroundColor: "#ffffff",
      color: "#000000",
      padding: "24px 30px",
      borderBottom: "1px solid #e0e0e0",
    },
    cardTitle: {
      margin: 0,
      fontSize: "24px",
      fontWeight: "600",
      letterSpacing: "0.5px",
    },
    cardBody: {
      padding: "30px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    input: {
      padding: "12px 16px",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "16px",
      marginBottom: "15px",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      backgroundColor: "#ffffff",
    },
    inputFocus: {
      borderColor: "#000000",
      boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
      outline: "none",
    },
    select: {
      padding: "12px 16px",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "16px",
      backgroundColor: "#ffffff",
      color: "#333333",
      cursor: "pointer",
      marginBottom: "15px",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 0.2s ease",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#000000",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    buttonSecondary: {
      padding: "10px 16px",
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "2px solid #000000",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    buttonDanger: {
      padding: "8px 12px",
      backgroundColor: "#dc3545",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    section: {
      marginTop: "10px",
      padding: "20px",
      border: "2px solid #f0f0f0",
      borderRadius: "10px",
      backgroundColor: "#fafafa",
    },
    sectionTitle: {
      margin: "0 0 20px 0",
      fontSize: "18px",
      fontWeight: "600",
      color: "#333333",
      borderBottom: "3px solid #000000",
      paddingBottom: "8px",
      display: "inline-block",
    },
    flexRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "15px",
    },
    addressGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginBottom: "15px",
    },
    familyMemberCard: {
      marginBottom: "20px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "2px solid #e9ecef",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    cardHeaderInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    cardTitleInner: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#495057",
    },
    submitButton: {
      padding: "16px 24px",
      fontSize: "18px",
      fontWeight: "600",
      marginTop: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 30px",
      color: "#6c757d",
      fontSize: "18px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              {existing ? "Update" : "Create"} Customer
            </h2>
          </div>
          <div style={styles.loadingContainer}>Loading master data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            {existing ? "Update" : "Create"} Customer
          </h2>
        </div>

        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Basic Information */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Basic Information</h3>

              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                }}
              />

              <div style={styles.addressGrid}>
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
            </div>

            {/* Mobile Numbers Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Mobile Numbers</h3>
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
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#c82333";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#dc3545";
                      }}
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
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#000000";
                }}
              >
                + Add Mobile Number
              </button>
            </div>

            {/* Addresses Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Addresses</h3>
              {form.addresses.map((addr, index) => (
                <div key={index} style={styles.familyMemberCard}>
                  <div style={styles.cardHeaderInner}>
                    <span style={styles.cardTitleInner}>
                      Address {index + 1}
                    </span>
                    {form.addresses.length > 1 && (
                      <button
                        type="button"
                        style={styles.buttonDanger}
                        onClick={() => removeAddress(index)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#c82333";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#dc3545";
                        }}
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
                        handleAddressChange(
                          index,
                          "countryName",
                          e.target.value
                        )
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
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#000000";
                }}
              >
                + Add Address
              </button>
            </div>

            {/* Family Members Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Family Members</h3>
              {form.familyMembers.map((member, index) => (
                <div key={index} style={styles.familyMemberCard}>
                  <div style={styles.cardHeaderInner}>
                    <span style={styles.cardTitleInner}>
                      Family Member {index + 1}
                    </span>
                    {form.familyMembers.length > 1 && (
                      <button
                        type="button"
                        style={styles.buttonDanger}
                        onClick={() => removeFamilyMember(index)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#c82333";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#dc3545";
                        }}
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
                        handleFamilyMemberChange(
                          index,
                          "nicNumber",
                          e.target.value
                        )
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
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#000000";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#000000";
                }}
              >
                + Add Family Member
              </button>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.submitButton,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#333333";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#000000";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {existing ? "Update Customer" : "Create Customer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
