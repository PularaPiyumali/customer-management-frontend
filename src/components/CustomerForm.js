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

  //State to hold validation errors
  const [errors, setErrors] = useState({});
  //State for displaying general messages (e.g., success/error from API)
  const [message, setMessage] = useState({ text: "", type: "" });

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch master data (cities and countries)
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
        setMessage({
          text: "Error loading cities and countries data.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    //Basic Information Validation
    if (!form.name.trim()) {
      newErrors.name = "Full Name is required.";
      isValid = false;
    }
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
      isValid = false;
    }
    if (!form.nicNumber.trim()) {
      newErrors.nicNumber = "NIC Number is required.";
      isValid = false;
    } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(form.nicNumber)) {
      newErrors.nicNumber =
        "Invalid NIC Number format. Use 9 digits + V/X or 12 digits.";
      isValid = false;
    }

    //Mobile Numbers Validation
    if (
      form.mobileNumbers.length === 0 ||
      form.mobileNumbers[0].trim() === ""
    ) {
      newErrors.mobileNumbers = "At least one mobile number is required.";
      isValid = false;
    } else {
      form.mobileNumbers.forEach((num, index) => {
        if (!num.trim()) {
          newErrors[`mobileNumbers[${index}]`] =
            "Mobile number cannot be empty.";
          isValid = false;
        } else if (!/^\d{10}$/.test(num)) {
          newErrors[`mobileNumbers[${index}]`] =
            "Mobile number must be 10 digits.";
          isValid = false;
        }
      });
    }

    //Addresses Validation
    if (form.addresses.length === 0) {
      newErrors.addresses = "At least one address is required.";
      isValid = false;
    } else {
      form.addresses.forEach((addr, index) => {
        if (!addr.addressLine1.trim()) {
          newErrors[`addresses[${index}].addressLine1`] =
            "Address Line 1 is required.";
          isValid = false;
        }
        if (!addr.cityId) {
          newErrors[`addresses[${index}].cityId`] = "City is required.";
          isValid = false;
        }
        if (!addr.countryName) {
          newErrors[`addresses[${index}].countryName`] = "Country is required.";
          isValid = false;
        }
      });
    }

    //Family Members Validation
    form.familyMembers.forEach((member, index) => {
      const isMemberFilled =
        member.familyMemberName.trim() ||
        member.nicNumber.trim() ||
        member.dateOfBirth.trim();
      if (isMemberFilled) {
        if (!member.familyMemberName.trim()) {
          newErrors[`familyMembers[${index}].familyMemberName`] =
            "Family Member Name is required.";
          isValid = false;
        }
        if (!member.nicNumber.trim()) {
          newErrors[`familyMembers[${index}].nicNumber`] =
            "NIC Number is required.";
          isValid = false;
        } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(member.nicNumber)) {
          newErrors[`familyMembers[${index}].nicNumber`] =
            "Invalid NIC Number format. Use 9 digits + V/X or 12 digits.";
          isValid = false;
        }
        if (!member.dateOfBirth) {
          newErrors[`familyMembers[${index}].dateOfBirth`] =
            "Date of Birth is required.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  //Handle changes for main form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    //Clear error for the field being changed
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: undefined }));
  };

  //Handle changes for mobile numbers array
  const handleMobileChange = (index, value) => {
    const newNumbers = [...form.mobileNumbers];
    newNumbers[index] = value;
    setForm({ ...form, mobileNumbers: newNumbers });
    //Clear error for the specific mobile number field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`mobileNumbers[${index}]`]: undefined,
    }));
  };

  //Add a new mobile number input field
  const addMobile = () => {
    setForm({ ...form, mobileNumbers: [...form.mobileNumbers, ""] });
  };

  //Remove a mobile number input field
  const removeMobile = (index) => {
    const newNumbers = form.mobileNumbers.filter((_, i) => i !== index);
    setForm({ ...form, mobileNumbers: newNumbers });
    //Clear any errors related to the removed mobile number
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`mobileNumbers[${index}]`];
      return updatedErrors;
    });
  };

  //Handle changes for address array fields
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
    //Clear error for the specific address field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`addresses[${index}].${field}`]: undefined,
    }));
  };

  //Add a new address input group
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

  //Remove an address input group
  const removeAddress = (index) => {
    const newAddresses = form.addresses.filter((_, i) => i !== index);
    setForm({ ...form, addresses: newAddresses });
    //Clear any errors related to the removed address
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`addresses[${index}].addressLine1`];
      delete updatedErrors[`addresses[${index}].cityId`];
      delete updatedErrors[`addresses[${index}].countryName`];
      return updatedErrors;
    });
  };

  //Handle changes for family members array fields
  const handleFamilyMemberChange = (index, field, value) => {
    const newFamilyMembers = [...form.familyMembers];
    newFamilyMembers[index][field] = value;
    setForm({ ...form, familyMembers: newFamilyMembers });
    //Clear error for the specific family member field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`familyMembers[${index}].${field}`]: undefined,
    }));
  };

  //Add a new family member input group
  const addFamilyMember = () => {
    setForm({
      ...form,
      familyMembers: [
        ...form.familyMembers,
        { familyMemberName: "", nicNumber: "", dateOfBirth: "" },
      ],
    });
  };

  //Remove a family member input group
  const removeFamilyMember = (index) => {
    const newFamilyMembers = form.familyMembers.filter((_, i) => i !== index);
    setForm({ ...form, familyMembers: newFamilyMembers });
    //Clear any errors related to the removed family member
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`familyMembers[${index}].familyMemberName`];
      delete updatedErrors[`familyMembers[${index}].nicNumber`];
      delete updatedErrors[`familyMembers[${index}].dateOfBirth`];
      return updatedErrors;
    });
  };

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validate the form before submission
    if (!validateForm()) {
      setMessage({
        text: "Please correct the errors in the form.",
        type: "error",
      });
      return;
    }

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

        setMessage({ text: "Customer updated successfully!", type: "success" });
      } else {
        console.log("Creating new customer");
        console.log("POST Request URL:", "api/customers");
        console.log("POST Request Data:", filteredForm);

        response = await api.post("api/customers", filteredForm);

        console.log("Create Response:", response);
        console.log("Create Response Data:", response.data);
        console.log("Create Response Status:", response.status);
        console.log("Create Response Headers:", response.headers);

        setMessage({ text: "Customer created successfully!", type: "success" });
        //Reset form after successful creation
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
        setErrors({});
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

      setMessage({ text: "Error occurred during submission.", type: "error" });
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "20px auto",
      padding: "20px",
      fontFamily: "Inter, sans-serif",
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
      marginBottom: "5px",
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
      marginBottom: "5px",
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
    errorMessage: {
      color: "#dc3545",
      fontSize: "12px",
      marginTop: "5px",
      marginBottom: "10px",
    },
    messageBox: {
      padding: "10px 15px",
      borderRadius: "8px",
      marginBottom: "20px",
      textAlign: "center",
      fontWeight: "bold",
    },
    successMessage: {
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
    },
    errorMessageStyle: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
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
          {message.text && (
            <div
              style={{
                ...styles.messageBox,
                ...(message.type === "success"
                  ? styles.successMessage
                  : styles.errorMessageStyle),
              }}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Basic Information */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Basic Information</h3>

              <input
                style={{
                  ...styles.input,
                  borderColor: errors.name
                    ? styles.errorMessage.color
                    : styles.input.borderColor,
                }}
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.inputFocus)
                }
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name
                    ? styles.errorMessage.color
                    : "#e0e0e0";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.name && (
                <div style={styles.errorMessage}>{errors.name}</div>
              )}

              <div style={styles.addressGrid}>
                <div>
                  <input
                    style={{
                      ...styles.input,
                      borderColor: errors.dateOfBirth
                        ? styles.errorMessage.color
                        : styles.input.borderColor,
                    }}
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                  {errors.dateOfBirth && (
                    <div style={styles.errorMessage}>{errors.dateOfBirth}</div>
                  )}
                </div>
                <div>
                  <input
                    style={{
                      ...styles.input,
                      borderColor: errors.nicNumber
                        ? styles.errorMessage.color
                        : styles.input.borderColor,
                    }}
                    type="text"
                    name="nicNumber"
                    placeholder="NIC Number"
                    value={form.nicNumber}
                    onChange={handleChange}
                  />
                  {errors.nicNumber && (
                    <div style={styles.errorMessage}>{errors.nicNumber}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Numbers Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Mobile Numbers</h3>
              {form.mobileNumbers.map((num, index) => (
                <div key={index} style={styles.flexRow}>
                  <input
                    style={{
                      ...styles.input,
                      flex: 1,
                      marginBottom: 0,
                      borderColor: errors[`mobileNumbers[${index}]`]
                        ? styles.errorMessage.color
                        : styles.input.borderColor,
                    }}
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
              {errors.mobileNumbers && (
                <div style={styles.errorMessage}>{errors.mobileNumbers}</div>
              )}
              {form.mobileNumbers.map(
                (_, index) =>
                  errors[`mobileNumbers[${index}]`] && (
                    <div
                      key={`mobile-error-${index}`}
                      style={styles.errorMessage}
                    >
                      {errors[`mobileNumbers[${index}]`]}
                    </div>
                  )
              )}
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
                    style={{
                      ...styles.input,
                      borderColor: errors[`addresses[${index}].addressLine1`]
                        ? styles.errorMessage.color
                        : styles.input.borderColor,
                    }}
                    type="text"
                    placeholder="Address Line 1"
                    value={addr.addressLine1}
                    onChange={(e) =>
                      handleAddressChange(index, "addressLine1", e.target.value)
                    }
                  />
                  {errors[`addresses[${index}].addressLine1`] && (
                    <div style={styles.errorMessage}>
                      {errors[`addresses[${index}].addressLine1`]}
                    </div>
                  )}

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
                    <div>
                      <select
                        style={{
                          ...styles.select,
                          borderColor: errors[`addresses[${index}].cityId`]
                            ? styles.errorMessage.color
                            : styles.select.borderColor,
                        }}
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
                      {errors[`addresses[${index}].cityId`] && (
                        <div style={styles.errorMessage}>
                          {errors[`addresses[${index}].cityId`]}
                        </div>
                      )}
                    </div>
                    <div>
                      <select
                        style={{
                          ...styles.select,
                          borderColor: errors[`addresses[${index}].countryName`]
                            ? styles.errorMessage.color
                            : styles.select.borderColor,
                        }}
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
                      {errors[`addresses[${index}].countryName`] && (
                        <div style={styles.errorMessage}>
                          {errors[`addresses[${index}].countryName`]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {errors.addresses && (
                <div style={styles.errorMessage}>{errors.addresses}</div>
              )}
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
                    style={{
                      ...styles.input,
                      borderColor: errors[
                        `familyMembers[${index}].familyMemberName`
                      ]
                        ? styles.errorMessage.color
                        : styles.input.borderColor,
                    }}
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
                  {errors[`familyMembers[${index}].familyMemberName`] && (
                    <div style={styles.errorMessage}>
                      {errors[`familyMembers[${index}].familyMemberName`]}
                    </div>
                  )}

                  <div style={styles.addressGrid}>
                    <div>
                      <input
                        style={{
                          ...styles.input,
                          borderColor: errors[
                            `familyMembers[${index}].nicNumber`
                          ]
                            ? styles.errorMessage.color
                            : styles.input.borderColor,
                        }}
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
                      {errors[`familyMembers[${index}].nicNumber`] && (
                        <div style={styles.errorMessage}>
                          {errors[`familyMembers[${index}].nicNumber`]}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        style={{
                          ...styles.input,
                          borderColor: errors[
                            `familyMembers[${index}].dateOfBirth`
                          ]
                            ? styles.errorMessage.color
                            : styles.input.borderColor,
                        }}
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
                      {errors[`familyMembers[${index}].dateOfBirth`] && (
                        <div style={styles.errorMessage}>
                          {errors[`familyMembers[${index}].dateOfBirth`]}
                        </div>
                      )}
                    </div>
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
