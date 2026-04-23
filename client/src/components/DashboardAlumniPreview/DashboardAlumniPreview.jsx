import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";
import { AuthContext } from "../../contexts/AuthContext";
import "./DashboardAlumniPreview.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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

const DashboardAlumniPreview = () => {
  const [alumni, setAlumni] = useState([]);
  const { loading, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const getProfilePreview = async () => {
    try {
      const response = await api.get("/profile/view-alumni");
      const rawProfiles = response.data.profiles.profiles || [];

      const mappedProfiles = rawProfiles.map((profile) => ({
        id: profile.id,
        name: profile.fullName,
        programme: profile.degrees?.[0]?.degreeName || "N/A",
        gradYear: profile.degrees?.[0]?.year || "N/A",
        industry: profile.employmentHistory?.[0]?.industrySector || "N/A",
        role: profile.employmentHistory?.[0]?.jobTitle || "N/A",
      }));

      setAlumni(mappedProfiles.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!loading && accessToken) {
      getProfilePreview();
    }
  }, [loading, accessToken]);

  if (loading) return <div className="dashboard-alumni-preview"><LoadingSpinner/></div>;

  return (
    <div className="dashboard-alumni-preview">
      <div className="dashboard-alumni-header">
        <div>
          <h2>Alumni Preview</h2>
          <p>Showing the first 5 alumni records</p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/view-alumni")}
        >
          View All Alumni
        </button>
      </div>

      <div className="dashboard-alumni-table-wrap">
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
            {alumni.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No alumni data available.</div>
                </td>
              </tr>
            ) : (
              alumni.map((a) => (
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

export default DashboardAlumniPreview;