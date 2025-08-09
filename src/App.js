import './App.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./TMF icon.jpg";
import React, { useState, useEffect, useRef, useCallback } from 'react';
function ImageDropField({ onImageChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
          if (onImageChange) onImageChange(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please drop an image file.');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
          if (onImageChange) onImageChange(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? '3px dashed #4A90E2' : '3px dashed #ccc',
        borderRadius: '12px',
        width: '400px',
        height: '300px',
        margin: '20px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
        transition: 'border-color 0.3s, background-color 0.3s',
        userSelect: 'none',
      }}
      onClick={() => document.getElementById('imageUploadInput').click()}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
        />
      ) : (
        <>
          <p style={{ fontSize: '18px', color: '#666', textAlign: 'center' }}>
            Drag & Drop an image here, or click to select
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('imageUploadInput').click();
            }}
            style={{
              padding: '8px 16px',
              fontSize: '16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4A90E2',
              color: '#fff',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Select Image
          </button>
        </>
      )}
      <input
        id="imageUploadInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
function AutoResizeTextarea({ value, onChange }) {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height to get correct scrollHeight
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // set height to fit content
    }
  }, [value]); // re-run when value changes
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      rows={3}
      style={{
        whiteSpace: 'pre-wrap',
        width: '100%',
        boxSizing: 'border-box',
        resize: 'none',
        overflow: 'hidden',
        overflowWrap: 'break-word',
      }}
    />
  );
}
function SupervisorSignatureInput({ supervisorSignature, setSupervisorSignature }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSupervisorSignature(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSupervisorSignature(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      style={{
        border: "2px dashed #999",
        borderRadius: 6,
        width: 150,
        height: 80,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#999",
        position: "relative",
        marginLeft: 10,
      }}
      title="Click or drag & drop signature image here"
    >
      {supervisorSignature ? (
        <img
          src={supervisorSignature}
          alt="Supervisor Signature"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      ) : (
        <span>Drop Signature</span>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
function App() {
const handleImageChange = (file) => {
    console.log('Selected image file:', file);
    // You can save file or preview URL to state here if needed
  };
const [scopeDescription, setScopeDescription] = useState('');
const exportPDF = () => {
  const input = document.getElementById("exportable-area");
  if (!input) {
    alert("Export area not found");
    return;
  }

  html2canvas(input, {
    scale: 2, // increase resolution
    scrollY: -window.scrollY, // to avoid clipping if page is scrolled
    useCORS: true, // allow cross-origin images (like your logo)
  })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "pt", "a4"); // or 'landscape' if you prefer
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image height to keep aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      let pdfImgHeight = pdfWidth / ratio;

      // If the canvas height is taller than one page, you need to split into pages:
      if (pdfImgHeight > pdfHeight) {
        // For very tall content, you might want to add multiple pages (advanced)
        // For now, just fit to one page (may compress)
        pdfImgHeight = pdfHeight;
      }

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfImgHeight);
      pdf.save("weld-history.pdf");
    })
    .catch((err) => {
      console.error("Error exporting PDF:", err);
      alert("Error exporting PDF: " + err.message);
    });};const generateId = () => Date.now() + Math.random();
  // Dropdown options
  const weldNoOptions = Array.from({ length: 25 }, (_, i) => `W${i + 1}`);
  const welderIdOptions = Array.from({ length: 5 }, (_, i) => `TMF-00${i + 1}`);
  const wpsOptions = Array.from({ length: 50 }, (_, i) => `TMF-${(i + 1).toString().padStart(2, "0")}`);
  const weldingProcesses = ["MMAW", "SMAW", "GTAW", "GMAW", "GTAW/MMAW", "GTAW/SMAW", "GTAW/GMAW"];
  const welderNames = ["Dion James", "Blair Denis", "Brody Alcock", "Josh King", "Jesse Zepperlen"];
  const passNoOptions = ["1", "2", "3", "4", "5"];
  const materialThicknessOptions = [...Array(24)].map((_, i) => `${i + 2} mm`);
  const materialTypeOptions = [
    "Grade 250 to Grade 250", "Grade 250 to Grade 350", "Grade 350 to Grade 350",
    "Grade 350 to Grade 700", "Grade 350 to AISI/SAE 1020", "Grade 350 to AISI/SAE 1040",
    "Grade 350 to AISI/SAE 20MnV6", "Grade 700 to Grade 700", "ASTM A105 to ASTM A105",
    "ASTM A105 to ASTM A106 Gr.B", "ASTM A106 Gr.B to ASTM A106", "ASTM A105 to AISI 4130",
    "ASTM A106 Gr.B to AISI 4130", "AISI 4130 to AISI 4130", "Grade 350 to AISI 4130",
    "AISI/SAE 1020 to AISI/SAE 4130", "AISI/SAE 1040 to AISI/SAE 4130", "AISI/SAE 1045 to AISI/SAE 4130",
    "Other"
  ];

  // Create empty rows
  const createMaterialRow = () => ({
    id: generateId(),
    supplier: "",
    certNo: "",
    batchNo: "",
    serialNo: "",
    description: "",
    grade: "",
    gradeOther: "",
    thickness: "",
    thicknessOther: "",
  });

  const createTraceabilityRow = () => ({
    id: generateId(),
    WeldNo: "",
    WelderId: "",
    Date: "",
    WeldingProcedureSpecificationNo: "",
    WeldingProcess: "",
    Welder: "",
    JointTypeImage: "",
    ItemToItem: "",
    Description: "",
    ElectrodeBatchNo: "",
    NDEPrepCheck: "",
    NDEFinalVisual: "",
    NDEMTUT: "",
    NDEInitials: "",
    NDEResult: "",
    NDEReportNo: "",
  });

  const createWeldHistoryRow = () => ({
    id: generateId(),
    WeldNo: "",
    WelderId: "",
    WeldingProcedureSpecificationNo: "",
    Welder: "",
    PassNo: "",
    JointTypeImage: "",
    PrepCheckedBy: "",
    PrepInitials: "",
    FinalCheckedBy: "",
    FinalInitials: "",
    Mtu: "",
    NDEResult: "",
    NDEReport: "",
  });

  // State
  const [scopes, setScopes] = useState([]);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    number: "",
    jobDetails: "",
    jobNumber: "",
    client: "",
    clientRef: "",
    supervisorName: "Dion James",
  });
  const [supervisorSignature, setSupervisorSignature] = useState("");
  const [finalCompletionDate, setFinalCompletionDate] = useState("");

//save data in local storage
useEffect(() => {
  const stored = localStorage.getItem("weldAppData");
  if (stored) {
    setScopes(JSON.parse(stored));
  }
}, []);

// Auto-save every time scopes changes
useEffect(() => {
  localStorage.setItem("weldAppData", JSON.stringify(scopes));
}, [scopes]);

const loadData = (e) => {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      setScopes(importedData);
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  if (e.target.files[0]) {
    fileReader.readAsText(e.target.files[0]);
  }
};

const exportData = () => {
  const dataStr = JSON.stringify(scopes, null, 2); // Pretty format
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "weld-data-backup.json";
  a.click();

  URL.revokeObjectURL(url);
};
const importData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      setScopes(data);
    } catch (err) {
      alert("Invalid backup file.");
    }
  };
  reader.readAsText(file);
};


  // Add a new scope with initial rows
const addScope = () => {
  setScopes((prev) => [
    ...prev,
    {
      id: generateId(),
      materialRows: [createMaterialRow()],
      traceabilityRows: [createTraceabilityRow()],
      weldHistoryRows: [createWeldHistoryRow()],
      weldMapImage: null, // for storing the image file or data
      weldMapText: '',    // for storing the text from AutoResizeTextarea
    },
  ]);
};

//Handlers for Weld map
const updateWeldMapImage = (scopeId, file) => {
  setScopes((prev) =>
    prev.map((scope) =>
      scope.id === scopeId ? { ...scope, weldMapImage: file } : scope
    )
  );
};

const updateWeldMapText = (scopeId, text) => {
  setScopes((prev) =>
    prev.map((scope) =>
      scope.id === scopeId ? { ...scope, weldMapText: text } : scope
    )
  );
};
  // Update functions for project info
  const updateProjectInfo = (field, value) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }));
  };
  // Update material row field
  const updateMaterialRowField = (scopeId, rowId, field, value) => {
    setScopes((prev) =>
      prev.map((scope) => {
        if (scope.id !== scopeId) return scope;
        return {
          ...scope,
          materialRows: scope.materialRows.map((row) =>
            row.id === rowId ? { ...row, [field]: value } : row
          ),
        };
      })
    );
  };

// Update traceability row field and sync Weld History on shared fields
const updateRowField = (scopeId, rowId, field, value) => {
  setScopes((prev) =>
    prev.map((scope) => {
      if (scope.id !== scopeId) return scope;

      const updateRowsArray = (rows) =>
        rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row));

      // Update traceabilityRows with the new field value
      const updatedTraceabilityRows = updateRowsArray(scope.traceabilityRows);

      // Sync Weld History for matching row index (assuming same index)
      const weldHistoryRows = [...scope.weldHistoryRows];
      const traceabilityIndex = scope.traceabilityRows.findIndex((r) => r.id === rowId);

      if (traceabilityIndex >= 0 && weldHistoryRows[traceabilityIndex]) {
        const whRow = { ...weldHistoryRows[traceabilityIndex] };
        // Fields to sync from traceability to weld history
        const syncFields = [
          "WeldNo",
          "WelderId",
          "WeldingProcedureSpecificationNo",
          "WeldingProcess",
          "Welder",
          "PassNo",
          "JointTypeImage",
        ];
        if (syncFields.includes(field)) {
          whRow[field] = value;
        }
        // Sync NDE fields from traceability to weld history if relevant
        if (field === "NDEResult") whRow.NDEResult = value;
        if (field === "NDEReportNo") whRow.NDEReport = value;

        weldHistoryRows[traceabilityIndex] = whRow;
      }
      return {
        ...scope,
        traceabilityRows: updatedTraceabilityRows,
        weldHistoryRows,
      };
    })
  );
};
//create Empty Material register row fields
// Define this near the top of your component (or file if outside)
const createEmptyMaterialRow = () => ({
  id: Date.now(), // or a better unique id generator
  supplier: '',
  certificationNo: '',
  batchNo: '',
});
  // Update weld history row field (only editable fields)
  const updateWeldHistoryRowField = (scopeId, rowId, field, value) => {
    setScopes((prev) =>
      prev.map((scope) => {
        if (scope.id !== scopeId) return scope;
        return {
          ...scope,
          weldHistoryRows: scope.weldHistoryRows.map((row) =>
            row.id === rowId ? { ...row, [field]: value } : row
          ),
        };
      })
    );
  };

  // Add row to Traceability and Weld History simultaneously
  const addRow = (scopeId) => {
    setScopes((prev) =>
      prev.map((scope) => {
        if (scope.id !== scopeId) return scope;
        return {
          ...scope,
          traceabilityRows: [...scope.traceabilityRows, createTraceabilityRow()],
          weldHistoryRows: [...scope.weldHistoryRows, createWeldHistoryRow()],
        };
      })
    );
  };

  // Add Material Register Rows

  function addMaterialRow(scopeId) {
  setScopes(prevScopes =>
    prevScopes.map(scope => {
      if (scope.id === scopeId) {
        return {
          ...scope,
          materialRows: [...scope.materialRows, createEmptyMaterialRow()],
        };
      }
      return scope;
    })
  );
}
  // Handle drag & drop image for Joint Type in Traceability table
const handleFileDrop = (e, scopeId, rowId, fieldName) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    // Use a generic update function with fieldName
    updateRowField(scopeId, rowId, fieldName, reader.result);
  };
  reader.readAsDataURL(file);
};

const handleDragOver = (e) => e.preventDefault();

  // Save and trigger download
;
  return (
  
    <div style={{ fontSize: "12pt", padding: 20 }}>
      <img src={logo} alt="logo" style={{ width: 200, marginBottom: 10 }} />
      <h1 style={{ lineHeight: 1.4 }}>Project Report </h1>

      {/* Project Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <label>
          Project Title:
          <input
            value={projectInfo.title}
            onChange={(e) => updateProjectInfo("title", e.target.value)}
          />
        </label>
        <label>
          Project No:
          <input
            value={projectInfo.number}
            onChange={(e) => updateProjectInfo("number", e.target.value)}
          />
        </label>
        <label>
          Job Details:
          <input
            value={projectInfo.jobDetails}
            onChange={(e) => updateProjectInfo("jobDetails", e.target.value)}
          />
        </label>
        <label>
          Job No:
          <input
            value={projectInfo.jobNumber}
            onChange={(e) => updateProjectInfo("jobNumber", e.target.value)}
          />
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <label>
          Client:
          <input
            value={projectInfo.client}
            onChange={(e) => updateProjectInfo("client", e.target.value)}
          />
        </label>
        <label>
          Client Ref:
          <input
            value={projectInfo.clientRef}
            onChange={(e) => updateProjectInfo("clientRef", e.target.value)}
          />
        </label>
        <label>
          Supervisor Name:
          <input value={projectInfo.supervisorName} readOnly />
        </label>
      </div>

      {/* Welding Requirement Details */}
      <div
        style={{
          border: "1px solid #999",
          padding: 10,
          marginBottom: 15,
          fontSize: "0.9rem",
          lineHeight: 1.3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <strong>Welding Requirement Details:</strong>
        <div>Design Standard - AS 4041-2006 Pressure Piping. Manufacture Standard - AS 4458-1997 (R2016) Pressure Equipment. Weld Standard - AS 3992-2020 Pressure Equipment.Inspections Required - AS 4037-1999 Pressure Equipment.</div>
        </div>
      {/* Controls */}
      <div style={{ marginBottom: "20px" }}>
  <button onClick={exportData}>Download Backup</button>
  <input
    type="file"
    accept="application/json"
    onChange={importData}
    style={{ marginLeft: "10px" }}
  />
</div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={addScope} style={{ marginRight: 10 }}>
          Add Scope
        </button>
        <button onClick={ exportPDF}>Export to PDF</button>
      </div>

<div style={{ marginBottom: 20 }}>
</div>
      <div id="exportable-area">
        {scopes.map((scope, sIdx) => (
          <div
            key={scope.id}
            style={{
              border: "1px solid black",
              padding: 15,
              marginBottom: 40,
            }}
          >
            <h2>Scope {sIdx + 1}</h2>
  


            {/* Material Certificate Register */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
  <h3 style={{ margin: 0, marginRight: 16 }}>Material Certificate Register</h3>
  
  <label htmlFor="scopeDescription" style={{ fontWeight: 'bold', marginRight: 8, whiteSpace: 'nowrap' }}>
    Scope Description
  </label>
 <AutoResizeTextarea
    id="scopeDescription"
    value={scopeDescription}
    onChange={(e) => setScopeDescription(e.target.value)}
    style={{ padding: 8, fontSize: 14, boxSizing: 'border-box', width: '250px' }}
    placeholder="Enter scope description"
  />
</div>
            <table
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%", marginBottom: 20 }}
            >
              <thead>
                <tr>
                  <th>Material Supplier</th>
                  <th>Material Certification No</th>
                  <th>Batch No</th>
                  <th>Serial/Heat No</th>
                  <th>Description</th>
                  <th>Material Grade</th>
                  <th>In Service Date</th>
                </tr>
              </thead>
              <tbody>
                {scope.materialRows.map((row) => (
                  <tr key={row.id}>
                    <td>
<AutoResizeTextarea 
  value={row.supplier}
  onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "supplier", e.target.value)
                        }
  rows={3}       // sets visible height
  style={{ whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box',    resize: 'none',            // optional: prevent manual resize
    overflowWrap: 'break-word' // wrap long words if needed
    }} // wrap + allow resize
/>
                    </td>
                    <td>
                      <AutoResizeTextarea  
                        value={row.certNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "certNo", e.target.value)
                        }
                          rows={3}       // sets visible height
  style={{ whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box'}} // wrap + allow resize
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea 
                        value={row.batchNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "batchNo", e.target.value)
                        }
                      rows={3}       // sets visible height
  style={{ whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box'}} // wrap + allow resize
  />
                    </td>
                    <td>
                      <AutoResizeTextarea 
                        value={row.serialNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "serialNo", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea 
                        value={row.description}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "description", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={row.grade}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "grade", e.target.value)
                        }
                      >
                        {materialTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {row.grade === "Other" && (
                        <AutoResizeTextarea 
                          placeholder="Specify other"
                          value={row.gradeOther}
                          onChange={(e) =>
                            updateMaterialRowField(scope.id, row.id, "gradeOther", e.target.value)
                          }
                          style={{ marginTop: 5 }}
                        />
                      )}
                    </td>
<td>
  <input
    type="date"
    value={row.inServiceDate || ''}
    onChange={(e) =>
      updateMaterialRowField(scope.id, row.id, "inServiceDate", e.target.value)
    }
    style={{ width: '100%', boxSizing: 'border-box' }}
  />
</td>
                  </tr>
                ))}
              </tbody>
{/* Add Row Button */}
<div style={{ marginBottom: 20 }}>
  <button onClick={() => addMaterialRow(scope.id)}>Add Row</button>
</div>
            </table>

            {/* Test Request */}
            <h3>Test Request</h3>
            <table
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%", marginBottom: 5 }}
            >
              <thead>
                <tr>
                  <th colSpan={7}>Weld Details</th>
                  <th colSpan={4}>NDE Method</th>
                  <th colSpan={3}>NDE Report</th>
                  </tr>
                  <tr>
                  <th>Welder ID</th>
                  <th>Weld No</th>
                  <th>WPS No</th>
                  <th>Welding Process</th>
                  <th>Description</th>
                  <th>Material Thickness</th>
                  <th>Material Type to Material Type</th>
                  <th>Visual</th>
                  <th>Initial</th>
                  <th>M.T./U.T.</th>
                  <th>Initial</th>
                  <th>Date</th>
                  <th>Results</th>
                  <th>Report No</th>
                </tr>
              </thead>
              <tbody>
                {scope.traceabilityRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <select
                        value={row.WelderId}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "WelderId", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {welderIdOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.WeldNo}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "WeldNo", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {weldNoOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.WeldingProcedureSpecificationNo}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "WeldingProcedureSpecificationNo", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {wpsOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.WeldingProcess}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "WeldingProcess", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {weldingProcesses.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.Description}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "Description", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={row.MaterialThickness}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "MaterialThickness", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {materialThicknessOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.MaterialTypeToMaterialType}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "MaterialTypeToMaterialType", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.Visual}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "Visual", e.target.value)
                        }
                      />
                    </td>
<td
  onDrop={(e) => handleFileDrop(e, scope.id, row.id, "Initial")}
  onDragOver={handleDragOver}
  style={{
    width: 80,
    height: 50,
    border: "1px dashed #999",
    textAlign: "center",
    verticalAlign: "middle",
    cursor: "pointer",
  }}
  title="Drag & drop image here"
>
  {row.JointTypeImage ? (
    <img
      src={row.Prepinitials}
      alt="Initial"
      style={{ maxWidth: "100%", maxHeight: "48px" }}
    />
  ) : (
    <div style={{ fontSize: 10, color: "#999", marginTop: 12 }}>
      Drop Image
    </div>
  )}
</td>

                    <td>
                      <AutoResizeTextarea
                        value={row.ItemToItem}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "ItemToItem", e.target.value)
                        }
                      />
                    </td>
                    <td
                      onDrop={(e) => handleFileDrop(e, scope.id, row.id)}
                      onDragOver={handleDragOver}
                      style={{
                        width: 80,
                        height: 50,
                        border: "1px dashed #999",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                      title="Drag & drop image here"
                    >
                      {row.JointTypeImage ? (
                        <img
                          src={row.JointTypeImage}
                          alt="Joint Type"
                          style={{ maxWidth: "100%", maxHeight: "48px" }}
                        />
                      ) : (
                        <div style={{ fontSize: 10, color: "#999", marginTop: 12 }}>
                          Drop Image
                        </div>
                      )}
                    </td>
                    {/* NDE report columns */}
                    <td>
                    <input
                        type="date"
                        value={row.NDEPrepCheck || ''}
                        onChange={(e) =>
                        updateRowField(scope.id, row.id, "Date", e.target.value)
                           }
                           style={{ width: '100%', boxSizing: 'border-box', padding: 6 }}
                         />
                       </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.Results}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "Results", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.ReportNo}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "ReportNo", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Row Button (adds rows to Traceability and Weld History) */}
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => addRow(scope.id)}>Add Row</button>
            </div>

            {/* Weld History */}
            <h3>Weld History</h3>
            <table
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
<thead>
  <tr>
    <th rowSpan={2}>Weld No</th>
    <th rowSpan={2}>Welder ID</th>
    <th rowSpan={2}>Date</th>
    <th rowSpan={2}>WPS No</th>
    <th rowSpan={2}>Welding Process</th>
    <th
      rowSpan={2}
      style={{ padding: '6px', verticalAlign: 'middle', height: '60px', width: '80px' }}
    >
      <div style={{ lineHeight: 'normal', fontWeight: 'bold', fontSize: '14px' }}>
        Welder<br />Pass No
      </div>
    </th>
    <th rowSpan={2}>Weld Joint Type</th>
    <th
      rowSpan={2}
      style={{ padding: '6px', verticalAlign: 'middle', height: '60px', width: '120px' }}
    >
      <div style={{ lineHeight: 'normal', fontWeight: 'bold', fontSize: '14px' }}>
        Item to Item<br />Description
      </div>
    </th>
    <th rowSpan={2}>Electrode Batch No</th>

    {/* NDE grouped header spanning 7 columns */}
    <th colSpan={7} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
      NDE
    </th>
  </tr>
  <tr>
    {/* NDE sub-headers in second row only */}
    <th>Prep Checked By</th>
    <th>Final Visual</th>
    <th>Date</th>
    <th>M.T./U.T.</th>
    <th>Initials</th>
    <th>Result</th>
    <th>Report No</th>
  </tr>
</thead>


              <tbody>
                {scope.weldHistoryRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.WeldNo}</td>
                    <td>{row.WelderId}</td>
                    <td>
                    <input
                        type="date"
                        value={row.NDEPrepCheck || ''}
                        onChange={(e) =>
                        updateRowField(scope.id, row.id, "Date", e.target.value)
                           }
                           style={{ width: '100%', boxSizing: 'border-box', padding: 6 }}
                         />
                       </td>
                    <td>{row.WeldingProcedureSpecificationNo}</td>
                    <td>{row.WeldingProcess}</td>
                                       <td>
                      <select
                        value={row.welderNames}
                        onChange={(e) =>
                          updateRowField(scope.id, row.id, "welderNames", e.target.value)
                        }
                      >
                        <option value="">Select Welder Name</option>
                        {welderNames.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
  <select
    value={row.PassNoOptions}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "PassNo", e.target.value)
    }
    style={{ width: '100%' }}
  >
    <option value="">Select Pass No</option>
    {passNoOptions.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
                    </td>
                    <td
  onDrop={(e) => handleFileDrop(e, scope.id, row.id, "Weld Joint Type")}
  onDragOver={handleDragOver}
  style={{
    width: 80,
    height: 50,
    border: "1px dashed #999",
    textAlign: "center",
    verticalAlign: "middle",
    cursor: "pointer",
  }}
  title="Drag & drop image here"
>
  {row.JointTypeImage ? (
    <img
      src={row.WeldJointType}
      alt="Initial"
      style={{ maxWidth: "100%", maxHeight: "48px" }}
    />
  ) : (
    <div style={{ fontSize: 10, color: "#999", marginTop: 12 }}>
      Drop Image
    </div>
  )}
</td>
<td style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
  <AutoResizeTextarea
    value={row.itemToItem}
    onChange={(e) => updateRowField(scope.id, row.id, 'itemToItem', e.target.value)}
    placeholder="Item To Item"
  />
  <AutoResizeTextarea
    value={row.description}
    onChange={(e) => updateRowField(scope.id, row.id, 'description', e.target.value)}
    placeholder="Description"
  />
</td>
                    <td>
                      <AutoResizeTextarea
                        value={row.ElectrodeBatchNo}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "Electrode Batch No", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.PrepCheckedBy}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "PrepCheckedBy", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea
                        value={row.FinalVisual}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "FinalVisual", e.target.value)
                        }
                      />
                    </td>
                    <td>
                    <input
                        type="date"
                        value={row.NDEPrepCheck || ''}
                        onChange={(e) =>
                        updateRowField(scope.id, row.id, "Date", e.target.value)
                           }
                           style={{ width: '100%', boxSizing: 'border-box', padding: 6 }}
                         />
                       </td>
                    <td>
                      <input
                        type="text"
                        value={row.Mtu}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "Mtu", e.target.value)
                        }
                      />
                    </td>
                                        <td
                      onDrop={(e) => handleFileDrop(e, scope.id, row.id)}
                      onDragOver={handleDragOver}
                      style={{
                        width: 80,
                        height: 50,
                        border: "1px dashed #999",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                      }}
                      title="Drag & drop image here"
                    >
                      {row.JointTypeImage ? (
                        <img
                          src={row.JointTypeImage}
                          alt="Joint Type"
                          style={{ maxWidth: "100%", maxHeight: "48px" }}
                        />
                      ) : (
                        <div style={{ fontSize: 10, color: "#999", marginTop: 12 }}>
                          Drop Image
                        </div>
                      )}
                    </td>
                                        <td>
                      <AutoResizeTextarea
                        value={row.Results}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "Results", e.target.value)
                        }
                      />
                    </td>
                                        <td>
                      <AutoResizeTextarea
                        value={row.ReportNo}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "ReportNo", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
<div style={{ marginTop: '20px' }}>
  <h3>Weld Map</h3>
  <ImageDropField
    onImageChange={(file) => updateWeldMapImage(scope.id, file)}
  />
  <AutoResizeTextarea
    value={scope.weldMapText}
    onChange={(e) => updateWeldMapText(scope.id, e.target.value)}
    placeholder="Enter Weld Map notes..."
    style={{
      width: '400px',
      marginTop: '10px',
      fontSize: '14px',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #ccc',
    }}
  />
</div>
            {/* Supervisor Signature and Completion Date */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
<label>
  Supervisor Signature:
  <SupervisorSignatureInput
    supervisorSignature={supervisorSignature}
    setSupervisorSignature={setSupervisorSignature}
  />
</label>
              <label>
                Final Completion Date:
                <input
                  type="date"
                  value={finalCompletionDate}
                  onChange={(e) => setFinalCompletionDate(e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;






