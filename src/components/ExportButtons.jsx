import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

function ExportButtons({ data, columns, fileName }) {
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    const rows = data.map((item) => columns.map((col) => item[col]));

    autoTable(doc, {
      head: [columns],
      body: rows,
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="btn-group">
      <button
        className="btn btn-success btn-sm me-2"
        onClick={downloadExcel}
        disabled={data.length === 0}
      >
        <FaFileExcel /> Excel
      </button>

      <button
        className="btn btn-danger btn-sm"
        onClick={downloadPDF}
        disabled={data.length === 0}
      >
        <FaFilePdf /> PDF
      </button>
    </div>
  );
}

export default ExportButtons;
