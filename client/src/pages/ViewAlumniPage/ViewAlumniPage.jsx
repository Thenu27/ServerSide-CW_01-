import { useState } from "react";
import "./ViewAlumniPage.css";

const alumniData = [
  { id: 1, name: "Aisha Khan", programme: "Computer Science", gradYear: 2022, industry: "IT", role: "Software Engineer" },
  { id: 2, name: "Ben Matthews", programme: "Business Administration", gradYear: 2020, industry: "Finance", role: "Financial Analyst" },
  { id: 3, name: "Clara Lee", programme: "Marketing", gradYear: 2021, industry: "Marketing", role: "Brand Strategist" },
  { id: 4, name: "Daniel Rossi", programme: "Data Science", gradYear: 2023, industry: "IT", role: "Data Analyst" },
  { id: 5, name: "Emma Patel", programme: "Healthcare Management", gradYear: 2019, industry: "Healthcare", role: "Operations Manager" },
  { id: 6, name: "Felix Nguyen", programme: "Computer Science", gradYear: 2024, industry: "IT", role: "Frontend Developer" },
  { id: 7, name: "Grace Hoffman", programme: "Business Administration", gradYear: 2018, industry: "Finance", role: "Investment Associate" },
  { id: 8, name: "Hassan Al-Amin", programme: "Marketing", gradYear: 2022, industry: "Marketing", role: "Digital Marketing Lead" },
  { id: 9, name: "Isla Fernandez", programme: "Data Science", gradYear: 2021, industry: "Finance", role: "Quantitative Analyst" },
  { id: 10, name: "James Okafor", programme: "Healthcare Management", gradYear: 2020, industry: "Healthcare", role: "Clinical Coordinator" },
  { id: 11, name: "Karen Yip", programme: "Computer Science", gradYear: 2018, industry: "IT", role: "DevOps Engineer" },
  { id: 12, name: "Liam Torres", programme: "Marketing", gradYear: 2024, industry: "Marketing", role: "Content Strategist" },
];

const programmes = ["All programmes", ...new Set(alumniData.map((a) => a.programme))];
const years = ["All years", ...new Set(alumniData.map((a) => a.gradYear)).values()].sort((a, b) => (a === "All years" ? -1 : b - a));
const industries = ["All industries", ...new Set(alumniData.map((a) => a.industry))];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function getAvatarClass(name) {
  const classes = ["avatar-blue", "avatar-teal", "avatar-pink", "avatar-amber", "avatar-purple", "avatar-green"];
  return classes[name.charCodeAt(0) % classes.length];
}

function getIndustryClass(industry) {
  const map = {
    IT: "badge-it",
    Finance: "badge-finance",
    Marketing: "badge-marketing",
    Healthcare: "badge-healthcare",
    Education: "badge-education",
  };
  return map[industry] || "badge-default";
}

const ViewAlumniPage = () => {
  const [programme, setProgramme] = useState("All programmes");
  const [year, setYear] = useState("All years");
  const [industry, setIndustry] = useState("All industries");
  const [search, setSearch] = useState("");

  const filtered = alumniData.filter((a) => {
    const matchProg = programme === "All programmes" || a.programme === programme;
    const matchYear = year === "All years" || a.gradYear === Number(year);
    const matchInd = industry === "All industries" || a.industry === industry;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchProg && matchYear && matchInd && matchSearch;
  });

  const handleReset = () => {
    setProgramme("All programmes");
    setYear("All years");
    setIndustry("All industries");
    setSearch("");
  };

  return (
    <div className="alumni-page">

      <div className="page-header">
        <h1>Alumni directory</h1>
        <p>Browse and filter alumni records by programme, year, or industry</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total alumni</div>
          <div className="stat-value">1,284</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Programmes</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Industries</div>
          <div className="stat-value">8</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grad years</div>
          <div className="stat-value">2005–2024</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Programme</label>
          <select value={programme} onChange={(e) => setProgramme(e.target.value)}>
            {programmes.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Graduation year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Industry sector</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Search name</label>
          <input
            type="text"
            placeholder="e.g. Aisha Khan"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-reset" onClick={handleReset}>Reset</button>
      </div>

      <div className="results-meta">
        <span>Showing {filtered.length} of {alumniData.length} alumni</span>
        <span>Sorted by name</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Full name</th>
              <th>Programme</th>
              <th>Grad year</th>
              <th>Industry</th>
              <th>Current role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No alumni match the selected filters.</div>
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="td-name">
                      <div className={`avatar ${getAvatarClass(a.name)}`}>
                        {getInitials(a.name)}
                      </div>
                      <span className="name-text">{a.name}</span>
                    </div>
                  </td>
                  <td>{a.programme}</td>
                  <td>{a.gradYear}</td>
                  <td>
                    <span className={`badge ${getIndustryClass(a.industry)}`}>
                      {a.industry}
                    </span>
                  </td>
                  <td>{a.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ViewAlumniPage;