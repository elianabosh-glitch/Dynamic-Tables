import logo from './TMF icon.jpg';
import React, { useState } from "react";
import "./App.css";

// Import jsPDF and html2canvas for PDF export
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const generateId = () => Date.now() + Math.random();

  const createEmptyWeldRow = () => ({
    id: generateId(),
    WeldNo: "",
    WelderId: "",
    Date: "",
    WeldingProcedureSpecificationNo: "",
    WeldingProcess: "",
    Welder: "",
    PassNo: "",
    JointType: "", // base64 image string or empty
    ItemToItem: "",
    DescriptionEgJointType: "",
    ElectrodeBatch: "",
    DrawingNo: "",
    PrepCheckedBy: "",
    PrepInitials: "",
    FinalCheckedBy: "",
    FinalInitials: "",
    Mtu: "",
    NDEResult: "",
    NDEReport: "",
  });

  const createEmptyMaterialRow = () => ({
    id: generateId(),
    MaterialSupplier: "",
    MaterialCertificationNo: "",
    BatchNo: "",
    SerialHeatNo: "",
    Description: "",
    MaterialGrade: "",
    InServiceDate: "",
  });

  const [scopes, setScopes] = useState([]);

  // Drag and drop for Weld Joint Type image (first table)
  const handleFileDrop = (e, scopeId, rowId) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateWeldRowField(scopeId, rowId, "JointType", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Add a new scope with one weld row and one material row initially
  const addScope = () => {
    const newScope = {
      id: generateId(),
      sharedValue: "",
      weldRows: [createEmptyWeldRow()],
      materialRows: [createEmptyMaterialRow()],
    };
    setScopes([...scopes, newScope]);
  };

  // Shared info update
  const updateSharedValue = (scopeId, value) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId ? { ...scope, sharedValue: value } : scope
      )
    );
  };

  // Weld rows handlers
  const addWeldRow = (scopeId) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId
          ? { ...scope, weldRows: [...scope.weldRows, createEmptyWeldRow()] }
          : scope
      )
    );
  };

  const deleteWeldRow = (scopeId, rowId) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId
          ? {
              ...scope,
              weldRows: scope.weldRows.filter(row => row.id !== rowId),
            }
          : scope
      )
    );
  };

  const updateWeldRowField = (scopeId, rowId, field, value) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId
          ? {
              ...scope,
              weldRows: scope.weldRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
              ),
            }
          : scope
      )
    );
  };

  // Material rows handlers
  const addMaterialRow = (scopeId) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId
          ? { ...scope, materialRows: [...scope.materialRows, createEmptyMaterialRow()] }
          : scope
      )
    );
  };

  const updateMaterialRowField = (scopeId, rowId, field, value) => {
    setScopes(prev =>
      prev.map(scope =>
        scope.id === scopeId
          ? {
              ...scope,
              materialRows: scope.materialRows.map(row =>
                row.id === rowId ? { ...row, [field]: value } : row
              ),
            }
          : scope
      )
    );
  };

  // Export to PDF function
const exportToPdf = () => {
  const input = document.getElementById("app-root");

  html2canvas(input, {
    scale: 2  // ⬅️ Doubles resolution for clearer, larger text
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");

    const imgWidth = 297;
    const pageHeight = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }



      pdf.save("weld-history.pdf");
    });
  };

  const weldNoOptions = Array.from({ length: 25 }, (_, i) => `W${i + 1}`);
  const welderIdOptions = Array.from({ length: 5 }, (_, i) => `TMF-00${i + 1}`);
  const wpsOptions = Array.from({ length: 50 }, (_, i) =>
    `TMF-${(i + 1).toString().padStart(2, "0")}`
  );
  const weldingProcesses = [
    "MMAW", "SMAW", "GTAW", "GMAW",
    "GTAW/MMAW", "GTAW/SMAW", "GTAW/GMAW"
  ];
  const welderNames = [
    "Dion James", "Blair Denis", "Brody Alcock", "Josh King", "Jesse Zepperlen"
  ];

  return (
    <div className="App" id="app-root" style={{ padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dynamic Weld History App</h1>
        <img src={logo} alt="TMF Logo" className="logo" />
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={addScope} style={{ marginRight: 10 }}>Add Scope</button>
        <button onClick={exportToPdf}>Export to PDF</button>
      </div>

      {/* Scopes */}
      {scopes.map((scope, index) => (
        <div key={scope.id} style={{ border: "1px solid black", padding: 10, marginTop: 20 }}>
          <h2>Scope {index + 1}</h2>

          <label>Shared Info:</label>
          <input
            value={scope.sharedValue}
            onChange={(e) => updateSharedValue(scope.id, e.target.value)}
            placeholder="Shared info"
            style={{ marginBottom: 10 }}
          />

          {/* === First table: Weld History === */}
          <h3>Weld History</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th rowSpan="2">Weld No</th>
                <th rowSpan="2">Welder ID</th>
                <th rowSpan="2">Date</th>
                <th rowSpan="2">Welding Procedure Specification No</th>
                <th rowSpan="2">Welding Process</th>
                <th colSpan="1">Welder / Pass No</th>
                <th rowSpan="2" style={{ minWidth: 120 }}>Weld Joint Type<br />(Drag & Drop Image)</th>
                <th rowSpan="2">Item to Item</th>
                <th rowSpan="2">Description (e.g. Joint Type)</th>
                <th rowSpan="2">Electrode Batch</th>
                <th rowSpan="2">Drawing No</th>
                <th colSpan="2">Prep Check</th>
                <th colSpan="2">Final V.E.</th>
                <th colSpan="2">NDE: C=Compliant, NC=Non Compliant</th>
                <th rowSpan="2">Actions</th>
              </tr>
              <tr>
                <th>
                  <div>Welder</div>
                  <div>Pass No</div>
                </th>
                <th>Checked By</th>
                <th>Initials</th>
                <th>Checked By</th>
                <th>Initials</th>
                <th>Result</th>
                <th>Report #</th>
              </tr>
            </thead>
            <tbody>
              {scope.weldRows.map(row => (
                <tr key={row.id}>
                  <td>
                    <select
                      value={row.WeldNo}
                      onChange={e => updateWeldRowField(scope.id, row.id, "WeldNo", e.target.value)}
                    >
                      <option value="">Select</option>
                      {weldNoOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={row.WelderId}
                      onChange={e => updateWeldRowField(scope.id, row.id, "WelderId", e.target.value)}
                    >
                      <option value="">Select</option>
                      {welderIdOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="date"
                      value={row.Date}
                      onChange={e => updateWeldRowField(scope.id, row.id, "Date", e.target.value)}
                    />
                  </td>

                  <td>
                    <select
                      value={row.WeldingProcedureSpecificationNo}
                      onChange={e =>
                        updateWeldRowField(scope.id, row.id, "WeldingProcedureSpecificationNo", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {wpsOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={row.WeldingProcess}
                      onChange={e => updateWeldRowField(scope.id, row.id, "WeldingProcess", e.target.value)}
                    >
                      <option value="">Select</option>
                      {weldingProcesses.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={row.Welder}
                      onChange={e => updateWeldRowField(scope.id, row.id, "Welder", e.target.value)}
                      style={{ display: "block", marginBottom: "4px" }}
                    >
                      <option value="">Select Welder</option>
                      {welderNames.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <input
                      placeholder="Pass No"
                      value={row.PassNo}
                      onChange={e => updateWeldRowField(scope.id, row.id, "PassNo", e.target.value)}
                    />
                  </td>

                  <td
                    onDrop={(e) => handleFileDrop(e, scope.id, row.id)}
                    onDragOver={handleDragOver}
                    style={{
                      border: "2px dashed gray",
                      width: 120,
                      height: 80,
                      textAlign: "center",
                      verticalAlign: "middle",
                      cursor: "pointer",
                      position: "relative",
                      padding: 2,
                    }}
                    title="Drag & drop image here"
                  >
                    {row.JointType ? (
                      <img
                        src={row.JointType}
                        alt="Weld Joint"
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{ lineHeight: "80px", color: "#888" }}>Drop Image</div>
                    )}
                  </td>

                  <td>
                    <input
                      value={row.ItemToItem}
                      onChange={e => updateWeldRowField(scope.id, row.id, "ItemToItem", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      value={row.DescriptionEgJointType}
                      onChange={e => updateWeldRowField(scope.id, row.id, "DescriptionEgJointType", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      value={row.ElectrodeBatch}
                      onChange={e => updateWeldRowField(scope.id, row.id, "ElectrodeBatch", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      value={row.DrawingNo}
                      onChange={e => updateWeldRowField(scope.id, row.id, "DrawingNo", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="Checked By"
                      value={row.PrepCheckedBy}
                      onChange={e => updateWeldRowField(scope.id, row.id, "PrepCheckedBy", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Initials"
                      value={row.PrepInitials}
                      onChange={e => updateWeldRowField(scope.id, row.id, "PrepInitials", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="Checked By"
                      value={row.FinalCheckedBy}
                      onChange={e => updateWeldRowField(scope.id, row.id, "FinalCheckedBy", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Initials"
                      value={row.FinalInitials}
                      onChange={e => updateWeldRowField(scope.id, row.id, "FinalInitials", e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="M.T./U.T."
                      value={row.Mtu}
                      onChange={e => updateWeldRowField(scope.id, row.id, "Mtu", e.target.value)}
                    />
                  </td>

                  <td>
                    <select
                      value={row.NDEResult}
                      onChange={e => updateWeldRowField(scope.id, row.id, "NDEResult", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="C">C (Compliant)</option>
                      <option value="NC">NC (Non Compliant)</option>
                    </select>
                  </td>

                  <td>
                    <input
                      placeholder="Report #"
                      value={row.NDEReport}
                      onChange={e => updateWeldRowField(scope.id, row.id, "NDEReport", e.target.value)}
                    />
                  </td>

                  <td>
                    <button onClick={() => deleteWeldRow(scope.id, row.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => addWeldRow(scope.id)} style={{ marginTop: 10, marginBottom: 30 }}>
            Add Row
          </button>

          {/* === Second table: Welding and material traceability record === */}
          <h3>Welding and material traceability record</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
            <thead>
              <tr>
                <th>Weld No</th>
                <th>Welder ID</th>
                <th>Date</th>
                <th>Welding Procedure Specification No</th>
                <th>Welding Process</th>
                <th>
                  <div>Welder</div>
                  <div>Pass No</div>
                </th>
                <th style={{ minWidth: 120 }}>Weld Joint Type</th>
                <th>Item to Item</th>
                <th>Description (e.g. Joint Type)</th>
                <th>Electrode Batch</th>
                <th colSpan="6" style={{ textAlign: "center" }}>NDE</th>
              </tr>
              <tr>
                <th colSpan="10"></th>
                <th>Prep Check:</th>
                <th>Final Visual:</th>
                <th>M.T./U.T.</th>
                <th>Initials:</th>
                <th>Results:</th>
                <th>Report No:</th>
              </tr>
            </thead>
            <tbody>
              {scope.weldRows.map(row => (
                <tr key={"trace_" + row.id}>
                  <td><input value={row.WeldNo} readOnly /></td>
                  <td><input value={row.WelderId} readOnly /></td>
                  <td><input type="date" value={row.Date} readOnly /></td>
                  <td><input value={row.WeldingProcedureSpecificationNo} readOnly /></td>
                  <td><input value={row.WeldingProcess} readOnly /></td>
                  <td>
                    <div><input value={row.Welder} readOnly style={{ width: "100%" }} /></div>
                    <div><input value={row.PassNo} readOnly style={{ width: "100%" }} /></div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {row.JointType ? (
                      <img
                        src={row.JointType}
                        alt="Weld Joint"
                        style={{ maxWidth: 100, maxHeight: 70, objectFit: "contain" }}
                      />
                    ) : (
                      <div style={{ color: "#888" }}>No Image</div>
                    )}
                  </td>
                  <td><input value={row.ItemToItem} readOnly /></td>
                  <td><input value={row.DescriptionEgJointType} readOnly /></td>
                  <td><input value={row.ElectrodeBatch} readOnly /></td>

                  <td><input value={row.PrepCheckedBy} readOnly /></td>
                  <td><input value={row.FinalCheckedBy} readOnly /></td>
                  <td><input value={row.Mtu} readOnly /></td>
                  <td><input value={row.PrepInitials} readOnly /></td>
                  <td><input value={row.NDEResult} readOnly /></td>
                  <td><input value={row.NDEReport} readOnly /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === Third table: Material Records === */}
          <h3 style={{ marginTop: 40 }}>Material Records</h3>
          <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: 10 }}>
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
              {scope.materialRows.map(row => (
                <tr key={"mat_" + row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.MaterialSupplier}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "MaterialSupplier", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.MaterialCertificationNo}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "MaterialCertificationNo", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.BatchNo}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "BatchNo", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.SerialHeatNo}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "SerialHeatNo", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.Description}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "Description", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.MaterialGrade}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "MaterialGrade", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.InServiceDate}
                      onChange={e => updateMaterialRowField(scope.id, row.id, "InServiceDate", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addMaterialRow(scope.id)} style={{ marginTop: 10, marginBottom: 30 }}>
            Add Material Row
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
