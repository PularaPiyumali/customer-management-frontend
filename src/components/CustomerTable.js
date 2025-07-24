import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/customers`, {
        params: {
          page,
          size,
          sort: `${orderBy},${direction}`,
        },
      });
      setCustomers(response.data.content || []);
      setTotal(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setTotal(0);
    }
    setLoading(false);
  }, [page, size, orderBy, direction]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSort = (field) => {
    const isAsc = orderBy === field && direction === "asc";
    setOrderBy(field);
    setDirection(isAsc ? "desc" : "asc");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(0);
  };

  const formatMobileNumbers = (mobileNumbers) => {
    if (!mobileNumbers || mobileNumbers.length === 0) return "N/A";
    return mobileNumbers.join(", ");
  };

  const formatAddresses = (addresses) => {
    if (!addresses || addresses.length === 0) return "N/A";
    return addresses
      .map(
        (addr) =>
          `${addr.addressLine1 || ""} ${addr.addressLine2 || ""}, ${
            addr.cityName || ""
          }, ${addr.countryName || ""}`
      )
      .join(" | ");
  };

  const formatFamilyMembers = (familyMembers) => {
    if (!familyMembers || familyMembers.length === 0) return "N/A";
    return familyMembers.map((member) => member.familyMemberName).join(", ");
  };

  const styles = {
    container: {
      marginTop: "30px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    header: {
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
    },
    title: {
      margin: 0,
      fontSize: "20px",
      fontWeight: "600",
      color: "#343a40",
    },
    tableContainer: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
    },
    th: {
      padding: "12px 8px",
      backgroundColor: "#f8f9fa",
      borderBottom: "2px solid #dee2e6",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#495057",
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.2s ease",
      minWidth: "100px",
    },
    thHover: {
      backgroundColor: "#e9ecef",
    },
    td: {
      padding: "12px 8px",
      borderBottom: "1px solid #dee2e6",
      fontSize: "12px",
      color: "#495057",
      maxWidth: "150px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    tdWide: {
      maxWidth: "200px",
    },
    sortableHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sortIcon: {
      fontSize: "10px",
      opacity: 0.6,
    },
    editButton: {
      padding: "6px 12px",
      backgroundColor: "#000000",
      color: "white",
      border: "1px solid #000000",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: "500",
      textDecoration: "none",
      display: "inline-block",
      transition: "all 0.2s ease",
    },
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderTop: "1px solid #dee2e6",
    },
    paginationInfo: {
      fontSize: "14px",
      color: "#6c757d",
    },
    paginationControls: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    pageButton: {
      padding: "8px 12px",
      border: "1px solid #000000",
      backgroundColor: "#000000",
      color: "white",
      cursor: "pointer",
      borderRadius: "4px",
      fontSize: "14px",
      transition: "all 0.2s ease",
    },
    pageButtonActive: {
      backgroundColor: "#000000",
      color: "white",
      borderColor: "#000000",
    },
    pageButtonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      backgroundColor: "#000000",
      color: "white",
    },
    select: {
      padding: "6px 10px",
      border: "1px solid #000000",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "#000000",
      color: "white",
    },
    loading: {
      textAlign: "center",
      padding: "40px",
      color: "#6c757d",
    },
    noData: {
      textAlign: "center",
      padding: "40px",
      color: "#6c757d",
      fontSize: "16px",
    },
    tooltip: {
      position: "relative",
      cursor: "help",
    },
  };

  const totalPages = Math.ceil(total / size);
  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, total);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Customer Directory</h3>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th
                style={styles.th}
                onClick={() => handleSort("name")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.thHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
              >
                <div style={styles.sortableHeader}>
                  <span>Name</span>
                </div>
              </th>
              <th
                style={styles.th}
                onClick={() => handleSort("dateOfBirth")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.thHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
              >
                <div style={styles.sortableHeader}>
                  <span>DOB</span>
                </div>
              </th>
              <th
                style={styles.th}
                onClick={() => handleSort("nicNumber")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.thHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
              >
                <div style={styles.sortableHeader}>
                  <span>NIC</span>
                </div>
              </th>
              <th style={{ ...styles.th, cursor: "default" }}>
                Mobile Numbers
              </th>
              <th style={{ ...styles.th, cursor: "default" }}>Addresses</th>
              <th style={{ ...styles.th, cursor: "default" }}>
                Family Members
              </th>
              <th style={{ ...styles.th, cursor: "default" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={styles.loading}>
                  <div>Loading customers...</div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  <div>No customers found</div>
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr
                  key={customer.id || index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa",
                  }}
                >
                  <td style={styles.td} title={customer.name}>
                    {customer.name || "N/A"}
                  </td>
                  <td style={styles.td}>
                    {customer.dateOfBirth
                      ? new Date(customer.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td style={styles.td} title={customer.nicNumber}>
                    {customer.nicNumber || "N/A"}
                  </td>
                  <td
                    style={{ ...styles.td, ...styles.tdWide }}
                    title={formatMobileNumbers(customer.mobileNumbers)}
                  >
                    {formatMobileNumbers(customer.mobileNumbers)}
                  </td>
                  <td
                    style={{ ...styles.td, ...styles.tdWide }}
                    title={formatAddresses(customer.addresses)}
                  >
                    {formatAddresses(customer.addresses)}
                  </td>
                  <td
                    style={{ ...styles.td, ...styles.tdWide }}
                    title={formatFamilyMembers(customer.familyMembers)}
                  >
                    {formatFamilyMembers(customer.familyMembers)}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        (window.location.href = `/edit-customer/${customer.id}`)
                      }
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#333333";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#000000";
                        e.target.style.color = "white";
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <div style={styles.paginationInfo}>
          Showing {total > 0 ? startItem : 0} to {endItem} of {total} entries
        </div>

        <div style={styles.paginationControls}>
          <label style={{ fontSize: "14px", marginRight: "10px" }}>
            Rows per page:
            <select
              value={size}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              style={styles.select}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button
            style={{
              ...styles.pageButton,
              ...(page === 0 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            onMouseEnter={(e) => {
              if (page !== 0) {
                e.target.style.backgroundColor = "#333333";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== 0) {
                e.target.style.backgroundColor = "#000000";
              }
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: "14px", margin: "0 10px" }}>
            Page {page + 1} of {totalPages}
          </span>

          <button
            style={{
              ...styles.pageButton,
              ...(page >= totalPages - 1 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            onMouseEnter={(e) => {
              if (page < totalPages - 1) {
                e.target.style.backgroundColor = "#333333";
              }
            }}
            onMouseLeave={(e) => {
              if (page < totalPages - 1) {
                e.target.style.backgroundColor = "#000000";
              }
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
