import React, { useState } from "react";
import axios from "axios";

export default function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/customers/bulk-upload", formData);
      alert("Upload successful!");
      setFile(null);
      // Reset file input
      document.getElementById("file-input").value = "";
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  const removeFile = () => {
    setFile(null);
    document.getElementById("file-input").value = "";
  };

  const styles = {
    container: {
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef",
    },
    title: {
      margin: "0 0 20px 0",
      fontSize: "18px",
      fontWeight: "600",
      color: "#343a40",
    },
    uploadArea: {
      border: `2px dashed ${dragActive ? "#007bff" : "#dee2e6"}`,
      borderRadius: "8px",
      padding: "40px 20px",
      textAlign: "center",
      backgroundColor: dragActive ? "#f8f9ff" : "white",
      transition: "all 0.3s ease",
      cursor: "pointer",
      marginBottom: "15px",
    },
    uploadText: {
      margin: "10px 0",
      fontSize: "16px",
      color: "#6c757d",
    },
    fileInput: {
      display: "none",
    },
    browseButton: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    fileInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#e8f5e8",
      border: "1px solid #c3e6c3",
      borderRadius: "4px",
      marginBottom: "15px",
    },
    fileName: {
      fontSize: "14px",
      color: "#155724",
      fontWeight: "500",
    },
    removeButton: {
      padding: "4px 8px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px",
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
    },
    uploadButton: {
      padding: "12px 24px",
      backgroundColor: file ? "#28a745" : "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: file ? "pointer" : "not-allowed",
      fontSize: "16px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
    },
    uploadButtonHover: {
      backgroundColor: file ? "#218838" : "#6c757d",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Bulk Upload Customers</h3>

      <div
        style={styles.uploadArea}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div>📁</div>
        <p style={styles.uploadText}>
          Drag and drop an Excel file here, or{" "}
          <span style={{ color: "#007bff", fontWeight: "500" }}>browse</span>
        </p>
        <p style={{ fontSize: "12px", color: "#868e96", margin: "5px 0 0 0" }}>
          Supports .xlsx and .xls files
        </p>
      </div>

      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        style={styles.fileInput}
      />

      {file && (
        <div style={styles.fileInfo}>
          <span style={styles.fileName}>📄 {file.name}</span>
          <button
            style={styles.removeButton}
            onClick={removeFile}
            type="button"
          >
            Remove
          </button>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button
          style={styles.uploadButton}
          onClick={handleUpload}
          disabled={!file}
          onMouseEnter={(e) => {
            if (file) e.target.style.backgroundColor = "#218838";
          }}
          onMouseLeave={(e) => {
            if (file) e.target.style.backgroundColor = "#28a745";
          }}
        >
          {file ? "⬆️ Upload Excel File" : "📄 Select a file first"}
        </button>
      </div>
    </div>
  );
}
