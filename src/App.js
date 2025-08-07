import React, { useState } from "react";
import './App.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./TMF icon.jpg";
function App() {
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
  const saveData = () => { /*...*/ };
  const loadData = (event) => { /*...*/ };
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
    PassNo: "",
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

  // Add a new scope with initial rows
  const addScope = () => {
    setScopes((prev) => [
      ...prev,
      {
        id: generateId(),
        materialRows: [createMaterialRow()],
        traceabilityRows: [createTraceabilityRow()],
        weldHistoryRows: [createWeldHistoryRow()],
      },
    ]);
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
  const updateTraceabilityRowField = (scopeId, rowId, field, value) => {
    setScopes((prev) =>
      prev.map((scope) => {
        if (scope.id !== scopeId) return scope;

        const updatedTraceabilityRows = scope.traceabilityRows.map((row) =>
          row.id === rowId ? { ...row, [field]: value } : row
        );

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

  // Handle drag & drop image for Joint Type in Traceability table
  const handleFileDrop = (e, scopeId, rowId) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateTraceabilityRowField(scopeId, rowId, "JointTypeImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Save and trigger download
;
  return (
  
    <div style={{ fontSize: "12pt", padding: 20 }}>
      <img src={logo} alt="logo" style={{ width: 200, marginBottom: 10 }} />
      <h1 style={{ lineHeight: 1.4 }}>Weld History</h1>

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
        <div>Design Standard - AS 4041-2006 Pressure Piping.</div>
        <div>Manufacture Standard - AS 4458-1997 (R2016) Pressure Equipment.</div>
        <div>Weld Standard - AS 3992-2020 Pressure Equipment.</div>
        <div>Inspections Required - AS 4037-1999 Pressure Equipment.</div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={addScope} style={{ marginRight: 10 }}>
          Add Scope
        </button>
        <button onClick={ exportPDF}>Export to PDF</button>
      </div>

<div>
  {/* Your existing UI */}

  <button onClick={saveData}>Save Work</button>

  <input
    type="file"
    accept="application/json"
    onChange={loadData}
    style={{ marginLeft: 20 }}
  />
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
            <h3>Material Certificate Register</h3>
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
                  <th>Material Thickness</th>
                </tr>
              </thead>
              <tbody>
                {scope.materialRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="text"
                        value={row.supplier}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "supplier", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.certNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "certNo", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.batchNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "batchNo", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.serialNo}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "serialNo", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
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
                        <input
                          placeholder="Specify other"
                          type="text"
                          value={row.gradeOther}
                          onChange={(e) =>
                            updateMaterialRowField(scope.id, row.id, "gradeOther", e.target.value)
                          }
                          style={{ marginTop: 5 }}
                        />
                      )}
                    </td>
                    <td>
                      <select
                        value={row.thickness}
                        onChange={(e) =>
                          updateMaterialRowField(scope.id, row.id, "thickness", e.target.value)
                        }
                      >
                        {materialThicknessOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      {row.thickness === "Other" && (
                        <input
                          placeholder="Specify other"
                          type="text"
                          value={row.thicknessOther}
                          onChange={(e) =>
                            updateMaterialRowField(scope.id, row.id, "thicknessOther", e.target.value)
                          }
                          style={{ marginTop: 5 }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Welding and Material Traceability Record */}
            <h3>Welding and Material Traceability Record</h3>
            <table
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse", width: "100%", marginBottom: 5 }}
            >
              <thead>
                <tr>
                  <th>Weld No</th>
                  <th>Welder ID</th>
                  <th>Date</th>
                  <th>WPS No</th>
                  <th>Welding Process</th>
                  <th>Welder</th>
                  <th>Pass No</th>
                  <th>Weld Joint Type<br/>(Drag & Drop Image)</th>
                  <th>Item to Item</th>
                  <th>Description e.g. Joint Type</th>
                  <th>Electrode Batch No</th>
                  <th colSpan={6}>NDE</th>
                </tr>
                <tr>
                  <th colSpan={11}></th>
                  <th>Prep Check</th>
                  <th>Final Visual</th>
                  <th>M.T./U.T.</th>
                  <th>Initials</th>
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
                          updateTraceabilityRowField(scope.id, row.id, "WeldNo", e.target.value)
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
                        value={row.WelderId}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "WelderId", e.target.value)
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
                      <input
                        type="date"
                        value={row.Date}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "Date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={row.WeldingProcedureSpecificationNo}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "WeldingProcedureSpecificationNo", e.target.value)
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
                          updateTraceabilityRowField(scope.id, row.id, "WeldingProcess", e.target.value)
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
                      <select
                        value={row.Welder}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "Welder", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {welderNames.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.PassNo}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "PassNo", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {passNoOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
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
                      <input
                        type="text"
                        value={row.ItemToItem}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "ItemToItem", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.Description}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "Description", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.ElectrodeBatchNo}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "ElectrodeBatchNo", e.target.value)
                        }
                      />
                    </td>

                    {/* NDE columns */}
                    <td>
                      <input
                        type="text"
                        value={row.NDEPrepCheck}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEPrepCheck", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.NDEFinalVisual}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEFinalVisual", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.NDEMTUT}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEMTUT", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.NDEInitials}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEInitials", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.NDEResult}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEResult", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.NDEReportNo}
                        onChange={(e) =>
                          updateTraceabilityRowField(scope.id, row.id, "NDEReportNo", e.target.value)
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
                  <th>Weld No</th>
                  <th>Welder ID</th>
                  <th>WPS No</th>
                  <th>Welder</th>
                  <th>Pass No</th>
                  <th>Weld Joint Type</th>
                  <th>Prep Checked By</th>
                  <th>Prep Initials</th>
                  <th>Final Checked By</th>
                  <th>Final Initials</th>
                  <th>M.T./U.T.</th>
                  <th>Result</th>
                  <th>Report No</th>
                </tr>
              </thead>
              <tbody>
                {scope.weldHistoryRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.WeldNo}</td>
                    <td>{row.WelderId}</td>
                    <td>{row.WeldingProcedureSpecificationNo}</td>
                    <td>{row.Welder}</td>
                    <td>{row.PassNo}</td>
                    <td>
                      {row.JointTypeImage ? (
                        <img
                          src={row.JointTypeImage}
                          alt="Joint Type"
                          style={{ maxWidth: 80, maxHeight: 50 }}
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.PrepCheckedBy}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "PrepCheckedBy", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.PrepInitials}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "PrepInitials", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.FinalCheckedBy}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "FinalCheckedBy", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.FinalInitials}
                        onChange={(e) =>
                          updateWeldHistoryRowField(scope.id, row.id, "FinalInitials", e.target.value)
                        }
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
                    <td>{row.NDEResult}</td>
                    <td>{row.NDEReport}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
                <input
                  type="text"
                  value={supervisorSignature}
                  onChange={(e) => setSupervisorSignature(e.target.value)}
                  style={{ marginLeft: 10 }}
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





