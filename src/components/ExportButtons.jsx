import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Button,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  PictureAsPdf,
  TableChart,
} from "@mui/icons-material";

function ExportButtons({ data = [], columns = [], fileName = "data" }) {

  const isDisabled = data.length === 0;

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    const rows = data.map((item) =>
      columns.map((col) => item[col] ?? "-")
    );

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <Stack direction="row" spacing={1}>
      
      <Tooltip title="Export as Excel">
        <span>
          <Button
            onClick={downloadExcel}
            disabled={isDisabled}
            startIcon={<TableChart />}
            variant="contained"
            color="success"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              boxShadow: "none",
            }}
          >
            Excel
          </Button>
        </span>
      </Tooltip>

      <Tooltip title="Export as PDF">
        <span>
          <Button
            onClick={downloadPDF}
            disabled={isDisabled}
            startIcon={<PictureAsPdf />}
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              boxShadow: "none",
            }}
          >
            PDF
          </Button>
        </span>
      </Tooltip>

    </Stack>
  );
}

export default ExportButtons;