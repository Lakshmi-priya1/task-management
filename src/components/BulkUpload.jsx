import * as XLSX from "xlsx";

function BulkUpload({ setTasks }) {

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedTasks = jsonData.map((row) => ({
        id: Date.now() + Math.random(),
        title: row.Title || "",
        description: row.Description || "",
        status: row.Status || "Pending",
        dueDate: row.DueDate || ""
      }));

      setTasks((prev) => [...prev, ...formattedTasks]);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <label className="btn btn-outline-dark">
  <i className="bi bi-upload me-1"></i> Bulk Upload
  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    hidden
    onChange={handleFileUpload}
  />
</label>
  );
}

export default BulkUpload;