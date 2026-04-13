import "./ExportReportSection.css";

const ExportReportSection = () => {
  const handleExportCSV = () => {
    console.log("Export CSV clicked");
  };

  const handleExportPDF = () => {
    console.log("Export PDF clicked");
  };

  const handleDownloadReport = () => {
    console.log("Download Report clicked");
  };

  return (
    <div className="export-report-card">
      <h3>Export / Report</h3>
      <p className="export-report-description">
        Export filtered data and generate downloadable reports.
      </p>

      <div className="export-report-actions">
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleExportPDF}>Export PDF</button>
        <button onClick={handleDownloadReport}>Download Report</button>
      </div>
    </div>
  );
};

export default ExportReportSection;