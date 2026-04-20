import { useState, useEffect, useContext, useMemo } from "react";
import "./ViewAlumniPage.css";
import api from "../../components/Api/Api";
import { AuthContext } from "../../contexts/AuthContext";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function getAvatarClass(name) {
  const classes = [
    "avatar-blue",
    "avatar-teal",
    "avatar-pink",
    "avatar-amber",
    "avatar-purple",
    "avatar-green",
  ];
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
  const [alumni, setAlumni] = useState([]);
  const [programme, setProgramme] = useState("All programmes");
  const [filterYear, setFilterYear] = useState("All years");
  const [industry, setIndustry] = useState("All industries");
  const [search, setSearch] = useState("");

  const { loading, accessToken } = useContext(AuthContext);

const getProfile = async () => {
  try {
    const response = await api.get("/profile/view-alumni");
    console.log("response:", response);

    const rawProfiles = response.data.profiles.profiles || [];

    const mappedProfiles = rawProfiles.map((profile) => ({
      id: profile.id,
      name: profile.fullName,
      programme: profile.degrees?.[0]?.degreeName || "N/A",
      gradYear: profile.degrees?.[0]?.year || "N/A",
      industry: profile.employmentHistory?.[0]?.industrySector || "N/A",
      role: profile.employmentHistory?.[0]?.jobTitle || "N/A",
    }));

    setAlumni(mappedProfiles);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    if (!loading && accessToken) {
      getProfile();
    }
  }, [loading, accessToken]);

  const programmes = useMemo(() => {
    return ["All programmes", ...new Set(alumni.map((a) => a.programme))];
  }, [alumni]);

  const years = useMemo(() => {
    return ["All years", ...new Set(alumni.map((a) => a.gradYear))].sort((a, b) => {
      if (a === "All years") return -1;
      if (b === "All years") return 1;
      return b - a;
    });
  }, [alumni]);

  const industries = useMemo(() => {
    return ["All industries", ...new Set(alumni.map((a) => a.industry))];
  }, [alumni]);

  const filtered = alumni.filter((a) => {
    const matchProg =
      programme === "All programmes" || a.programme === programme;

    const matchYear =
      filterYear === "All years" || a.gradYear === Number(filterYear);

    const matchInd =
      industry === "All industries" || a.industry === industry;

    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());

    return matchProg && matchYear && matchInd && matchSearch;
  });

  const handleReset = () => {
    setProgramme("All programmes");
    setFilterYear("All years");
    setIndustry("All industries");
    setSearch("");
  };

  if (loading) return "Loading...";

  return (
    <div className="alumni-page">
      <div className="page-header">
        <h1>Alumni directory</h1>
        <p>Browse and filter alumni records by programme, year, or industry</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total alumni</div>
          <div className="stat-value">{alumni.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Programmes</div>
          <div className="stat-value">{programmes.length - 1}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Industries</div>
          <div className="stat-value">{industries.length - 1}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grad years</div>
          <div className="stat-value">
            {alumni.length > 0 ? `${Math.min(...alumni.map((a) => a.gradYear))}–${Math.max(...alumni.map((a) => a.gradYear))}` : "N/A"}
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Programme</label>
          <select value={programme} onChange={(e) => setProgramme(e.target.value)}>
            {programmes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Graduation year</label>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Industry sector</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {industries.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search name</label>
          <input
            type="text"
            placeholder="e.g. Thenuka IIT"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="results-meta">
        <span>
          Showing {filtered.length} of {alumni.length} alumni
        </span>
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
                  <div className="empty-state">
                    No alumni match the selected filters.
                  </div>
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