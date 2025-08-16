import './App.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./TMF icon.jpg";
import React, { useState, useEffect, useRef} from 'react';
function ImageDropField({ value, onImageChange, style }) {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => onImageChange(reader.result);
        reader.readAsDataURL(file);
      } else alert("Please drop an image file.");
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? "3px dashed #4A90E2" : "3px dashed #ccc",
        borderRadius: "12px",
        width: "80px",
        height: "80px",
        margin: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
        transition: "border-color 0.3s, background-color 0.3s",
        userSelect: "none",
        ...style,
      }}
    >
      {value ? (
        <img
          src={value}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      ) : (
        <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
          Drop Image
        </p>
      )}
    </div>
  );
}


function ImageDropFieldWeldJointType({ value, onImageChange, style }) {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => onImageChange(reader.result);
        reader.readAsDataURL(file);
      } else alert("Please drop an image file.");
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? "3px dashed #4A90E2" : "3px dashed #ccc",
        borderRadius: "12px",
        width: "110px",
        height: "90px",
        margin: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
        transition: "border-color 0.3s, background-color 0.3s",
        userSelect: "none",
        ...style,
      }}
    >
      {value ? (
        <img
          src={value}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      ) : (
        <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
          Drop Image
        </p>
      )}
    </div>
  );
}

function ImageDropFieldWeldMap({ onImageChange, style, inputId, imagePreview: imageProp }) {
  const [dragActive, setDragActive] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(imageProp || null);

  // Update local preview if the prop changes (important for JSON reload)
  React.useEffect(() => {
    setImagePreview(imageProp || null);
  }, [imageProp]);

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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
          if (onImageChange) onImageChange(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please drop an image file.");
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
        border: dragActive ? "3px dashed #4A90E2" : "3px dashed #ccc",
        borderRadius: "12px",
        width: "800px",
        height: "800px",
        margin: "20px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
        transition: "border-color 0.3s, background-color 0.3s",
        userSelect: "none",
        ...style,
      }}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            height: "auto",
            width: "auto",
            borderRadius: "8px",
          }}
        />
      ) : (
        <p style={{ fontSize: "18px", color: "#666", textAlign: "center" }}>
          Drop Image
        </p>
      )}
    </div>
  );
}

function AutoResizeTextarea({ value, onChange, style }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to calculate scrollHeight correctly
      textareaRef.current.style.height = 'auto';
      // Set height to fit content
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 4 + 'px';
    }
  }, [value]);

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
        lineHeight: '1.4',     // ensures text fits vertically
        padding: '6px',        // extra padding to avoid clipping
        fontSize: '14px',      // matches PDF export size
        minHeight: '28px',     // ensures minimal height
        ...style,              // allows additional inline styles
      }}
    />
  );
}

function SupervisorSignatureInput({ value, onChange, style }) {
  const [dragActive, setDragActive] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(value || null);

  React.useEffect(() => {
    // Update preview whenever value (base64) changes
    if (value) setImagePreview(value);
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) return alert("Please drop an image file.");

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        if (onChange) onChange(reader.result); // store base64 directly in App state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? "3px dashed #4A90E2" : "3px dashed #ccc",
        borderRadius: "12px",
        width: "250px",
        height: "150px",
        margin: "10px auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        backgroundColor: dragActive ? "#f0f8ff" : "#fafafa",
        transition: "border-color 0.3s, background-color 0.3s",
        userSelect: "none",
        ...style,
      }}
    >
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Signature Preview"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
        />
      ) : (
        <p style={{ fontSize: "16px", color: "#666", textAlign: "center" }}>
          Drop Signature
        </p>
      )}
    </div>
  );
}

function App() {
const pdfExportRef = useRef();
const [columnName, setColumnName] = React.useState("M.T./U.T.");
const handleImageChange = (file) => {
    console.log('Selected image file:', file);
    // You can save file or preview URL to state here if needed
  };

// To update MTUT from input in Test Request to Weld History
const updateScopeField = (scopeId, fieldName, value) => {
  setScopes((prevScopes) =>
    prevScopes.map((scope) =>
      scope.id === scopeId
        ? { ...scope, [fieldName]: value } // update the field in that scope
        : scope
    )
  );
};

// Weld joint type image updater
const updateWeldJointImage = (scopeId, rowId, fieldName, value) => {
  setScopes((prevScopes) =>
    prevScopes.map((scope) => {
      if (scope.id === scopeId) {
        return {
          ...scope,
          weldHistoryRows: scope.weldHistoryRows.map((row) =>
            row.id === rowId ? { ...row, [fieldName]: value } : row
          ),
        };
      }
      return scope;
    })
  );
};
// --- Generic scope field updater ---
const updateScopeFieldImage = (scopeId, field, value) => {
  setScopes(prev =>
    prev.map(scope =>
      scope.id === scopeId ? { ...scope, [field]: value } : scope
    )
  );
};

// --- Weld Map image updater using the generic function ---
const updateWeldMapImage = (scopeId, file, fieldName) => {
  const reader = new FileReader();
  reader.onload = () => {
    updateScopeField(scopeId, fieldName, reader.result);
  };
  reader.readAsDataURL(file);
};

// state object: { [scopeId]: base64ImageData }

const [scopeDescription, setScopeDescription] = useState('');

// Export PDF function
const exportPDF = () => {
  const input = document.querySelector(".App");
  if (!input) {
    alert("Export area not found");
    return;
  }

  html2canvas(input, {
  scale: 2, 
  scrollY: -window.scrollY,
  useCORS: true,
})

    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 0.8); // compress PNG a bit
      const pdf = new jsPDF("portrait", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      let pdfImgHeight = pdfWidth / ratio;

      if (pdfImgHeight > pdfHeight) {
        pdfImgHeight = pdfHeight;
      }

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfImgHeight, undefined, "FAST");
      pdf.save("weld-history.pdf");
    })
    .catch((err) => {
      console.error("Error exporting PDF:", err);
      alert("Error exporting PDF: " + err.message);
    });
};
const generateId = () => Date.now() + Math.random();
  // Dropdown options
  const weldNoOptions = Array.from({ length: 25 }, (_, i) => `W${i + 1}`);
  const welderIdOptions = Array.from({ length: 5 }, (_, i) => `TMF-00${i + 1}`);
  const wpsOptions = Array.from({ length: 50 }, (_, i) => `TMF-${(i + 1).toString().padStart(2, "0")}`);
  const weldingProcesses = ["MMAW", "SMAW", "GTAW", "GMAW", "GTAW/MMAW", "GTAW/SMAW", "GTAW/GMAW"];
  const welderNames = ["Dion James", "Blair Denis", "Brody Alcock", "Josh King", "Jesse Zepperlen"];
  const passNoOptions = ["1", "2", "3", "4", "5"];
  const materialThicknessOptions = [...Array(24)].map((_, i) => `${i + 2} mm`,"Other");
  const materialTypeOptions = [
    "Grade 250", "Grade 350", "Grade 700", "AISI/SAE 1020", "AISI/SAE 1040","AISI/SAE 20MnV6", "ASTM A105","ASTM A106 Gr.B", "ASTM A106", "AISI 4130",
    "AISI/SAE 1020", "AISI/SAE 1045","Other"
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
    inServiceDate: "",

  });

  const createTraceabilityRow = () => ({
    id: generateId(),
    WeldNo: "",
    WelderId: "",
    Welddate: "",
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
    NDEReportdate: "",
    NDEResult: "",
    NDEReportNo: "",
  });

  const createWeldHistoryRow = () => ({
    id: generateId(),
    WeldNo: "",
    WelderId: "",
    Welddate: "",
    WeldingProcedureSpecificationNo: "",
    WeldingProcess: "",
    Welder: "",
    PassNo: "",
    JointTypeImage: "",
    ItemToItem: "",
    Description: "",
    ElectrodeBatchNo: "",
    DrawingNo: "",
    PrepCheckedBy: "",
    PrepInitials: "",
    FinalCheckedBy: "",
    FinalInitials: "",
    NDEWeldHistorydate: "",
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
//To update scope description independently
  const updateScopeDescription = (scopeId, newDescription) => {
  setScopes(scopes.map(scope => 
    scope.id === scopeId ? { ...scope, scopeDescription: newDescription } : scope
  ));
};
// Handles any row-level image field (Initial, WeldJointType, etc.)
const updateRowImage = (scopeId, rowId, fieldName, value) => {
  setScopes(prevScopes =>
    prevScopes.map(scope => {
      if (scope.id === scopeId) {
        return {
          ...scope,
          // update weldHistoryRows
          weldHistoryRows: scope.weldHistoryRows.map(row =>
            row.id === rowId ? { ...row, [fieldName]: value } : row
          ),
          // update traceabilityRows
          traceabilityRows: scope.traceabilityRows.map(row =>
            row.id === rowId ? { ...row, [fieldName]: value } : row
          ),
        };
      }
      return scope;
    })
  );
};
// Load JSON file and restore state including images
const loadData = (e) => {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);

      if (importedData.scopes) setScopes(importedData.scopes);
      if (importedData.projectInfo) setProjectInfo(importedData.projectInfo);

      // Restore supervisor signature
      if (importedData.supervisorSignature) {
        setSupervisorSignature(importedData.supervisorSignature);
      } else {
        setSupervisorSignature("");
      }
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  if (e.target.files[0]) fileReader.readAsText(e.target.files[0]);
};


// Code to load JSON file and set state
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null); // handle null/undefined
    if (typeof file === "string") return resolve(file); // already base64
    if (!(file instanceof File || file instanceof Blob)) {
      console.warn("Invalid file passed to fileToBase64:", file);
      return resolve(null);
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

// --- Export JSON ---
const exportData = async () => {
  const scopesClone = JSON.parse(JSON.stringify(scopes)); // deep clone

  for (const scope of scopesClone) {
    // Convert top-level scope images (weld maps)
    for (const key of ["weldMapImage1", "weldMapImage2"]) {
      if (scope[key]) scope[key] = await fileToBase64(scope[key]);
    }

    // Convert images in nested rows
    for (const rowArrayKey of ["materialRows", "traceabilityRows", "weldHistoryRows"]) {
      if (Array.isArray(scope[rowArrayKey])) {
        for (const row of scope[rowArrayKey]) {
          for (const rowKey in row) {
            if (row[rowKey]) row[rowKey] = await fileToBase64(row[rowKey]);
          }
        }
      }
    }
  }

  // Convert supervisor signature
  const supervisorSignatureBase64 = await fileToBase64(supervisorSignature);

  const dataToSave = {
    scopes: scopesClone,
    projectInfo,
    supervisorSignature: supervisorSignatureBase64,
  };

  const dataStr = JSON.stringify(dataToSave, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "weld-data-backup.json";
  a.click();

  URL.revokeObjectURL(url);
};

// --- Import JSON ---
const importData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.scopes) setScopes(data.scopes);
      if (data.projectInfo) setProjectInfo(data.projectInfo);
    } catch (err) {
      alert("Invalid backup file.");
    }
  };
  reader.readAsText(file);

  // Reset input so same file can be selected again
  event.target.value = null;
};


// Add a new scope with initial rows and scopeDescription
const addScope = () => {
  setScopes((prev) => [
    ...prev,
    {
      id: generateId(),
      scopeDescription: '',    // added scopeDescription field
      materialRows: [createMaterialRow()],
      traceabilityRows: [createTraceabilityRow()],
      weldHistoryRows: [createWeldHistoryRow()],
      weldMapImage1: null,                  // image for Weld Map 1
      weldMapText1: '',                // text under Weld Map 1
      weldMapImage2: null,                  // image for Weld Map 2
      weldMapText2: '',                // text under Weld Map 2
    },
  ]);
};

const deleteLastScope = () => {
  if (scopes.length > 1) {
    setScopes((prev) => prev.slice(0, -1));
  }
};


// Delete Traceability and Weld History row
const deleteTracandWeldHisRow = (scopeId) => {
  setScopes((prevScopes) =>
    prevScopes.map((scope) => {
      if (scope.id === scopeId) {
        return {
          ...scope,
          traceabilityRows: scope.traceabilityRows.slice(0, -1),
          weldHistoryRows: scope.weldHistoryRows.slice(0, -1),
        };
      }
      return scope;
    })
  );
};

//Handlers for Weld map
const updateWeldMapImageInScopes = (scopeId, file) => {
  setScopes((prev) =>
    prev.map((scope) =>
      scope.id === scopeId ? { ...scope, weldMapImage: file } : scope
    )
  );
};

// Measure test request column widths
const [columnWidths, setColumnWidths] = useState({});

useEffect(() => {
  const widths = {};
  const tr = document.querySelector("#testRequestTable thead tr"); // first header row
  if (tr) {
    Array.from(tr.children).forEach((th, i) => {
      widths[i] = th.offsetWidth;
    });
    setColumnWidths(widths);
  }
}, []);

// Update weld map text 1 and 2
const updateWeldMapText1 = (scopeId, text) => {
  setScopes((prev) =>
    prev.map((scope) =>
      scope.id === scopeId ? { ...scope, weldMapText1: text } : scope
    )
  );
};
const updateWeldMapText2 = (scopeId, value) => {
  setScopes(prev =>
    prev.map(s => s.id === scopeId ? { ...s, weldMapText2: value } : s)
  );
};
  // Update functions for project info
const updateProjectInfo = (field, value) => {
  console.log(`Updating projectInfo: ${field} = ${value}`);
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
          "Welddate",
          "WeldingProcedureSpecificationNo",
          "WeldingProcess",
          "Welder",
          "PassNo",
          "ItemToItem",
          "Description",
          "JointTypeImage",
          "NDEReportdate",
          "NDEReportNo",
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

  // Delete Material Register Rows

function deleteMaterialRow(scopeId) {
  setScopes((prevScopes) =>
    prevScopes.map((scope) => {
      if (scope.id !== scopeId) return scope;
      // Remove last row or you can pass specific row id if you want
      const updatedRows = scope.materialRows.slice(0, -1);
      return { ...scope, materialRows: updatedRows };
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
    // Tells PDF export which area is "App" so it knows what to print
  <div className="App">
    <div style={{ fontSize: "12pt", padding: 20 }}>
      <img src={logo} alt="logo" style={{ width: 200, marginBottom: 10 }} />
      <h1 style={{ lineHeight: 1.4 }}>Project Report </h1>

{/* Project Info */}
<div style={{ marginBottom: 20 }}>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 10,
      marginBottom: 10,
    }}
  >
    {/* Project Title */}
    <div>
      <label>Project Title:</label>
      <input
        value={projectInfo.title}
        onChange={(e) => updateProjectInfo("title", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.title}
      </div>
    </div>

    {/* Project No */}
    <div>
      <label>Project No:</label>
      <input
        value={projectInfo.number}
        onChange={(e) => updateProjectInfo("number", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.number}
      </div>
    </div>

    {/* Job Details */}
    <div>
      <label>Job Details:</label>
      <input
        value={projectInfo.jobDetails}
        onChange={(e) => updateProjectInfo("jobDetails", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.jobDetails}
      </div>
    </div>

    {/* Job Number */}
    <div>
      <label>Job No:</label>
      <input
        value={projectInfo.jobNumber}
        onChange={(e) => updateProjectInfo("jobNumber", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.jobNumber}
      </div>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
    }}
  >
    {/* Client */}
    <div>
      <label>Client:</label>
      <input
        value={projectInfo.client}
        onChange={(e) => updateProjectInfo("client", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.client}
      </div>
    </div>

    {/* Client Ref */}
    <div>
      <label>Client Ref:</label>
      <input
        value={projectInfo.clientRef}
        onChange={(e) => updateProjectInfo("clientRef", e.target.value)}
        style={{ height: '40px', padding: '4px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.clientRef}
      </div>
    </div>

    {/* Supervisor Name (read-only) */}
    <div>
      <label>Supervisor Name:</label>
      <input
        value={projectInfo.supervisorName}
        readOnly
        style={{
          height: '40px',
          padding: '4px',
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor:'#f0f0f0',
          textAlign: 'center'
        }}
      />
      <div
        style={{
          display: 'none',
          height: '40px',
          padding: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {projectInfo.supervisorName}
      </div>
    </div>
  </div>
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
  
  {/* Hidden file input */}
  <input
    type="file"
    id="fileInput"
    accept=".weldsave,.json,.txt"
    onChange={importData}
    style={{ display: "none" }}
  />
  
  {/* Styled label acts as button */}
  <label
    htmlFor="fileInput"
    style={{
      marginLeft: "10px",
      padding: "6px 12px",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "4px",
      cursor: "pointer",
      userSelect: "none",
      display: "inline-block",
    }}
  >
    Browse File
  </label>
</div>

{/* Scope Controls Row */}
<div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
  {/* Add Scope and Export PDF Left side buttons */}
  <div>
    <button onClick={addScope} style={{ marginRight: 10 }}>
      Add Scope
    </button>
    <button onClick={exportPDF}>
      Export to PDF
    </button>
  </div>

  {/* Spacer to push delete button to far right */}
  <div style={{ flex: 1 }}></div>

  {/* Delete Last Scope Right side button */}
  <button
    onClick={deleteLastScope}
    disabled={scopes.length === 0}
  >
    Delete Last Scope
  </button>
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
        whiteSpace: 'nowrap'
      }}
    >
      {/* Scope heading and description on same row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: '2em', margin: 0, marginRight: 120 }}>
          Scope {sIdx + 1}     
        </h2>
        <label
          htmlFor={`scopeDescription-${scope.id}`}
          style={{
            fontWeight: 'bold',
            fontSize: '2em',
            marginRight: 8,
            whiteSpace: 'nowrap'
          }}
        >
         Scope Description
        </label>
<td
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 0,
  }}
>
  <div
    contentEditable
    suppressContentEditableWarning
    onInput={(e) =>
      updateScopeDescription(scope.id, e.currentTarget.textContent)
    }
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",     // horizontal centering
      width: "100%",
      height: "100%",
      fontSize: "1.6em",
      lineHeight: "1.6em",
      padding: "8px",
      boxSizing: "border-box",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      outline: "none",         // looks like a textarea
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "2.5em",
    }}
    placeholder="Enter scope description"
  >
    {scope.scopeDescription || ""}
  </div>
</td>


      </div>

      {/* Material Certificate Register title */}
      <h3 style={{ margin: 0, marginBottom: 8 }}>
        Material Certificate Register
      </h3>
            <table
              border="1"
              cellPadding="5"
  style={{
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: 20,
    tableLayout: "fixed",  // <--- this enforces column widths strictly
  }}
            >
  <colgroup> {/* Set column widths here */}
    <col style={{ width: '20px' }} /> 
    <col style={{ width: '20px' }} />
    <col style={{ width: '20px' }} />
    <col style={{ width: '20px' }} />
    <col style={{ width: '80px' }} />
    <col style={{ width: '20px' }} />
    <col style={{ width: '20px' }} />
  </colgroup>

              <thead>
                <tr>
                  <th >Material Supplier</th>
                  <th >Material Certification No</th>
                  <th >Batch No</th>
                  <th >Serial/Heat No</th>
                  <th >Description</th>
                  <th >Material Grade</th>
                  <th >In Service Date</th>
                </tr>
              </thead>
              <tbody>
                {scope.materialRows.map((row) => (
                  <tr key={row.id}>
                    <td  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<AutoResizeTextarea 
  value={row.supplier}
  onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "supplier", e.target.value)
                        }
  rows={3}       // sets visible height
  style={{ textAlign: 'center', whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box',    resize: 'none',            // optional: prevent manual resize
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
  style={{ textAlign: 'center', whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box'}} // wrap + allow resize
                      />
                    </td>
          <td>
  <AutoResizeTextarea 
    value={row.batchNo}
    onChange={(e) =>
      updateMaterialRowField(scope.id, row.id, "batchNo", e.target.value)
    }
    style={{ 
      textAlign: 'center', 
      padding: '6px',        // ensure PDF text isn't clipped
      lineHeight: '1.4',     // vertical spacing for PDF
      width: '100%',
      boxSizing: 'border-box',
      whiteSpace: 'pre-wrap',
    }}
  />
</td>

                    <td>
                      <AutoResizeTextarea 
                        value={row.serialNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "serialNo", e.target.value)
                        }
                        rows={3}
                        style={{ textAlign: 'center', whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box'}} // wrap + allow resize
                      />
                    </td>
                    <td>
                      <AutoResizeTextarea 
                        value={row.description}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "description", e.target.value)
                        }
                        rows={3}
                        style={{ textAlign: 'center', whiteSpace: 'pre-wrap', width:'100%',boxSizing: 'border-box'}} // wrap + allow resize
                      />
                    </td>
      <td>
  <select
    style={{
      textAlign: 'center',
      height: '40px',       // taller dropdown
      padding: '4px',       // spacing inside
      boxSizing: 'border-box',
    }}
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
      style={{
        marginTop: 5,
        height: '40px',       // taller text box
        padding: '4px',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
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
    style={{
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box',
      height: '40px',     // taller date box
      padding: '4px',     // optional: keeps text away from edges
    }}
  />
</td>

                  </tr>
                ))}
              </tbody>
            
            </table>

{/* Add & Delete Row Buttons */}
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
  <div>
    <button onClick={() => addMaterialRow(scope.id)}>Add Row</button>
  </div>
  <div>
    <button onClick={() => deleteMaterialRow(scope.id)}>Delete Row</button>
  </div>
</div>
            {/* Test Request */}
            <h3>Test Request</h3>
            
            <table id="TestRequestTable"
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%", marginBottom: 5, tableLayout: "fixed" }}
            >
               <colgroup>
    <col style={{ width: '8px' }} />
    <col style={{ width: '8px' }} />
    <col style={{ width: '11px' }} />{/* Date Column width */}
    <col style={{ width: '10px' }} />{/* WPS No Column width */}
    <col style={{ width: '12px' }} />{/* Welding Process Column width */}
    <col style={{ width: '45px' }} />{/* Description Column width */}
    <col style={{ width: '11px' }} />{/* Material Thickness Column width */}
    <col style={{ width: '25px' }} />{/* Material type to Material Type column width */}
    <col style={{ width: '10px' }} />
    <col style={{ width: '8px' }} />
    <col style={{ width: '10px' }} />
    <col style={{ width: '8px' }} />
    <col style={{ width: '11px' }} />
    <col style={{ width: '10px' }} />
    <col style={{ width: '15px' }} />{/* Report No col width */}
  </colgroup>
              <thead>
                <tr>
                  <th colSpan={8}>Weld Details</th>
                  <th colSpan={4}>NDE Method</th>
                  <th colSpan={3}>NDE Report</th>
                  </tr>
                  <tr>
                  <th rowSpan={2} style={{ width: 60 }}>Weld No</th>
    <th rowSpan={2} style={{ width: 70 }}>Welder ID</th>
    <th rowSpan={2} style={{ width: 120 }}>Date</th>
    <th rowSpan={2} style={{ width: 60 }}>WPS No</th>
    <th
      rowSpan={2}
      style={{ padding: '6px', verticalAlign: 'middle', height: '60px', width: '100px' }}
    >
      <div style={{ lineHeight: 'normal', fontWeight: 'bold', fontSize: '14px' }}>
        Welding<br />Process
      </div>
    </th>
                  <th>Description</th>
                  <th>
  <div>
    Material<br />Thickness
  </div>
</th>

                  <th>Material Type to Material Type</th>
                  <th>Visual</th>
                  <th>Initial</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>
<input
  type="text"
  value={scope.mtutHeader || ""}
  onChange={(e) =>
    updateScopeField(scope.id, "mtutHeader", e.target.value)
  }
  style={{
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    fontWeight: "bold",
    border: "none",
    background: "transparent",
    cursor: "text",
  }}
/>
</th>
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
    value={row.WeldNo}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "WeldNo", e.target.value)
    }
    style={{
      textAlign: "center",
      height: "40px",       // taller dropdown
      padding: "4px",       // keeps text nicely spaced
      boxSizing: "border-box",
    }}
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
    value={row.WelderId}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "WelderId", e.target.value)
    }
    style={{
      textAlign: "center",
      height: "40px",       // taller dropdown
      padding: "4px",       // keeps text nicely spaced
      boxSizing: "border-box",
    }}
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
  <input
    type="date"
    value={row.Welddate || ""}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "Welddate", e.target.value)
    }
    style={{
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center",
      height: "40px",    // makes the date box taller
      padding: "4px",    // optional: keeps text from touching edges
    }}
  />
</td>


<td>
  <select
    value={row.WeldingProcedureSpecificationNo}
    onChange={(e) =>
      updateRowField(
        scope.id,
        row.id,
        "WeldingProcedureSpecificationNo",
        e.target.value
      )
    }
    style={{
      textAlign: "center",
      height: "40px",       // taller dropdown
      padding: "4px",       // keeps text nicely spaced
      boxSizing: "border-box",
    }}
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
    style={{
      textAlign: "center",
      height: "40px",      // makes the dropdown taller
      padding: "4px",      // optional: keeps text spaced nicely
      boxSizing: "border-box",
    }}
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
    style={{ textAlign: "center" }}
  />
</td>

<td>
  <select
    value={row.MaterialThickness}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "MaterialThickness", e.target.value)
    }
    style={{
      textAlign: "center",
      height: "40px",      // makes the dropdown taller
      padding: "4px",      // optional: keeps text spaced nicely
      boxSizing: "border-box",
    }}
  >
    <option value="">Select</option>
    {materialThicknessOptions.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
    <option value="Other">Other</option>
  </select>

  {row.MaterialThickness === "Other" && (
    <AutoResizeTextarea
      placeholder="Specify other"
      value={row.MaterialThicknessOther || ""}
      onChange={(e) =>
        updateRowField(scope.id, row.id, "MaterialThicknessOther", e.target.value)
      }
      style={{
        marginTop: 5,
        textAlign: "center",
        height: "40px",       // makes the text box taller
        padding: "4px",       // optional: spacing inside
        boxSizing: "border-box",
      }}
    />
  )}
</td>


<td>
  <AutoResizeTextarea
    value={row.MaterialTypeToMaterialType}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "MaterialTypeToMaterialType", e.target.value)
    }
    style={{ textAlign: "center" }}
  />
</td>

<td>
  <AutoResizeTextarea
    value={row.Visual}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "Visual", e.target.value)
    }
    style={{ textAlign: "center" }}
  />
</td>

<td style={{ width: 15, height: 50, verticalAlign: "middle" }}>
<ImageDropField
  value={row.Initial}
  onImageChange={(base64) =>
    updateRowImage(scope.id, row.id, "Initial", base64)
  }
/>
</td>

{/* Change MTUT header by user input and update Weld History MTUT header with same input */} 
<td>
  <AutoResizeTextarea
    value={row.MTUT}
    onChange={(e) => {
      const value = e.target.value;
      updateRowField(scope.id, row.id, "MTUT", value);
    }}
    style={{ textAlign: "center" }}
  />
</td>


<td style={{ width: 15, height: 50, verticalAlign: "middle" }}>
<ImageDropField
  value={row.Initial}
  onImageChange={(base64) =>
    updateRowImage(scope.id, row.id, "Initial", base64)
  }
/>
</td>

{/* NDE report columns */}
<td>
  <input
    type="date"
    value={row.NDEReportdate || ""}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "NDEReportdate", e.target.value)
    }
    style={{
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center",
      height: "40px",   // makes the date box taller
      padding: "4px",   // optional: keeps text from touching edges
    }}
  />
</td>


<td>
  <AutoResizeTextarea
    value={row.Results}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "Results", e.target.value)
    }
    style={{ textAlign: "center" }}
  />
</td>

<td>
  <AutoResizeTextarea
    value={row.NDEReportNo}
    onChange={(e) =>
      updateRowField(scope.id, row.id, "NDEReportNo", e.target.value)
    }
    style={{ textAlign: "center" }}
  />
</td>

                  </tr>
                ))}
              </tbody>
            </table>

              {/* Add & Delete Row Buttons in same row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20
                }}
              >
                <button onClick={() => addRow(scope.id)}>Add Row</button>

                <button
                  onClick={() => deleteTracandWeldHisRow(scope.id)}
                  disabled={
                    scope.traceabilityRows.length === 0 ||
                    scope.weldHistoryRows.length === 0
                  }
                >
                  Delete Row
                </button>
              </div>

{/* Weld History */}
<h3>Weld History</h3>
<table   style={{
    tableLayout: "fixed",
    width: "100%",
    borderCollapse: "collapse",
  }} className="weldHistory">
  <colgroup>
    {/* First 5 columns: match Test Request exactly */}
    <col style={{ width: '4%' }} /> {/* Weld No */}
    <col style={{ width: '3.8%' }} /> {/* Welder ID */}
    <col style={{ width: '5.6%' }} /> {/* Date */}
    <col style={{ width: '4.9%' }} /> {/* WPS No */}
    <col style={{ width: '5.9%' }} /> {/* Welding Process */}

    {/* Middle columns: widest is Description + Item to Item */}
    <col style={{ width: '6%' }} /> {/* Welder & Pass No */}
    <col style={{ width: '4.8%' }} /> {/* Weld Joint Type */}
    <col style={{ width: '16%' }} /> {/* Item to Item and description */}
    <col style={{ width: '8%' }} /> {/* Electrode Batch No */}
    <col style={{ width: '4.8%' }} /> {/* Drawing No */}
    <col style={{ width: '4.4%' }} /> {/* Prep checked by*/}
    <col style={{ width: '4%' }} /> {/* Final Visual */}
    <col style={{ width: '5.8%' }} /> {/* Date */}

    {/* NDE columns: same width as Test Request */}
    <col style={{ width: '5.2%' }} /> {/* MTUT */}
    <col style={{ width: '4%' }} /> {/* Initials */}
    <col style={{ width: '5.2%' }} /> {/* Result */}
    <col style={{ width: '7.2%' }} /> {/* Report No */}
  </colgroup>
  <thead>
    <tr>
    <th rowSpan={2}>Weld No</th>
    <th rowSpan={2}>Welder ID</th>
    <th rowSpan={2}>Date</th>
    <th rowSpan={2}>WPS No</th>
    <th rowSpan={2}>
      <div>
        Welding<br />Process
      </div>
    </th>

      <th rowSpan={2}>Welder Pass No</th>
      <th rowSpan={2}>Weld Joint Type</th>
      <th rowSpan={2}> <div>Item to Item<br />Description</div></th>
      <th rowSpan={2}>Electrode Batch No</th>
      <th rowSpan={2}>Drawing No</th>
      <th colSpan={7} style={{ textAlign: 'center' }}>NDE</th>
    </tr>
    <tr>
      <th>Prep Checked<br />By</th>
      <th>Final Visual</th>
      <th>Date</th>
      <th>{scope.mtutHeader || "M.T./U.T."}</th>
      <th>Initials</th>
      <th>Result</th>
      <th>Report No</th>
    </tr>
  </thead>

<tbody>
  {scope.weldHistoryRows.map((row) => (
    <tr key={row.id}>
      {/* First 5 columns (auto-populated from Test Request) */}
      <td style={{ minWidth: columnWidths[0] + 'px', maxWidth: columnWidths[0] + 'px', textAlign: 'center' }}>{row.WeldNo}</td>
      <td style={{ minWidth: columnWidths[1] + 'px', maxWidth: columnWidths[1] + 'px', textAlign: 'center' }}>{row.WelderId}</td>
      <td style={{ minWidth: columnWidths[2] + 'px', maxWidth: columnWidths[2] + 'px', textAlign: 'center' }}>{row.Welddate}</td>
      <td style={{ minWidth: columnWidths[3] + 'px', maxWidth: columnWidths[3] + 'px', textAlign: 'center' }}>{row.WeldingProcedureSpecificationNo}</td>
      <td style={{ minWidth: columnWidths[4] + 'px', maxWidth: columnWidths[4] + 'px', textAlign: 'center' }}>{row.WeldingProcess}</td>

      {/* Middle columns (editable/flexible) */}
      <td style={{ textAlign: 'center' }}>
  <select
    value={row.welderNames}
    onChange={(e) => updateRowField(scope.id, row.id, "welderNames", e.target.value)}
    style={{
      textAlign: 'center',
      height: '40px',      // makes the dropdown taller
      padding: '4px',      // optional: keeps text away from edges
      boxSizing: 'border-box',
    }}
  >
    <option value="">Select Welder Name</option>
    {welderNames.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>

  <AutoResizeTextarea
    value={row.PassNoOptions}
    onChange={(e) => updateRowField(scope.id, row.id, "PassNoOptions", e.target.value)}
    placeholder="PassNo"
    style={{ textAlign: 'center' }}
  />
</td>

      <td style={{ textAlign: 'center' }}>
<ImageDropFieldWeldJointType
  value={row.WeldJointType}
  onImageChange={(base64) =>
    updateWeldJointImage(scope.id, row.id, "WeldJointType", base64)
  }
/>
      </td>
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.ItemToItem}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, 'ItemToItem', e.target.value)}
          placeholder="Item To Item"
          style={{ textAlign: 'center' }}
        />
        <AutoResizeTextarea
          value={row.Description}
          readOnly
          style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}
          placeholder="Description"
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.ElectrodeBatchNo}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "ElectrodeBatchNo", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.DrawingNo}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "DrawingNo", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>

      {/* Last 7 columns (NDE) */}
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.PrepCheckedBy}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "PrepCheckedBy", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.FinalVisual}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "FinalVisual", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>
<td style={{ textAlign: 'center' }}>
  <input
    type="date"
    value={row.NDEReportdate || ''}
    onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "NDEReportdate", e.target.value)}
    style={{
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'center',
      height: '40px',       // makes the date box taller
      padding: '4px',       // optional: keeps text away from edges
    }}
  />
</td>

      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.Mtu}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "Mtu", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
<ImageDropField
  value={row.Initial}
  onImageChange={(base64) =>
    updateRowImage(scope.id, row.id, "Initial", base64)
  }
/>
      </td>
      <td style={{ textAlign: 'center' }}>
        <AutoResizeTextarea
          value={row.Results}
          onChange={(e) => updateWeldHistoryRowField(scope.id, row.id, "Results", e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </td>
      <td style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
        {row.NDEReportNo?.split(' ').map((part, i) => (
          <React.Fragment key={i}>
            {part}{i < row.NDEReportNo.split(' ').length - 1 && <br />}
          </React.Fragment>
        ))}
      </td>
    </tr>
  ))}
</tbody>
</table>
<div style={{ marginTop: '20px' }}>
  <h3>Weld Map and Another Image</h3>
  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
{/* Weld Map 1 */}
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h4>Weld Map 1</h4>
<ImageDropFieldWeldMap
  inputId="weldMapInput"
  imagePreview={scope.weldMapImage1}
  onImageChange={(file) => updateWeldMapImage(scope.id, file, "weldMapImage1")}
/>
<AutoResizeTextarea
  value={scope.weldMapText1}
  onChange={(e) => updateWeldMapText1(scope.id, e.target.value)}
  placeholder="Enter Weld Map notes..."
  style={{
    width: '300px',       // adjust width to match image or preference
    fontSize: '14px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'vertical',
    marginTop: '10px',
    textAlign: 'center',   // centers text horizontally
  }}
/>

</div>

{/* Weld Map 2 */}
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h4>Weld Map 2</h4>
<ImageDropFieldWeldMap
  inputId="secondImageInput"
  imagePreview={scope.weldMapImage2}
  onImageChange={(file) => updateWeldMapImage(scope.id, file, "weldMapImage2")}
/>
<AutoResizeTextarea
  value={scope.weldMapText2}
  onChange={(e) => updateWeldMapText2(scope.id, e.target.value)}
  placeholder="Enter Weld Map notes..."
  style={{
    width: '300px',       // adjust width to match image or preference
    fontSize: '14px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'vertical',
    marginTop: '10px',
    textAlign: 'center',   // centers text horizontally
  }}
/>

</div>
</div>
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
  value={supervisorSignature}
  onChange={setSupervisorSignature}
/>
</label>
              <label>
                Final Completion Date:
<input
  type="date"
  value={finalCompletionDate}
  onChange={(e) => setFinalCompletionDate(e.target.value)}
  style={{
    marginLeft: 10,
    height: '40px',        // taller box
    padding: '4px',        // optional: keep text from touching edges
    boxSizing: 'border-box',
    textAlign: 'center'    // optional: center date text horizontally
  }}
/>

              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default App;






