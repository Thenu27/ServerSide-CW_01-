import "./AlumniPreviewSection.css";

const AlumniPreviewSection = ({ data }) => {

  const dummyData = [
    {
      name: "John Perera",
      degree: "BSc Software Engineering",
      role: "Software Engineer",
      company: "WSO2",
      year: 2022,
    },
    {
      name: "Nethmi Silva",
      degree: "BSc Data Science",
      role: "Data Analyst",
      company: "Dialog",
      year: 2021,
    },
    {
      name: "Kasun Fernando",
      degree: "BSc Computer Science",
      role: "UI/UX Designer",
      company: "99x",
      year: 2023,
    },
    {
      name: "Ayesha Jayasinghe",
      degree: "BSc Information Systems",
      role: "Project Manager",
      company: "IFS",
      year: 2020,
    },
    {
      name: "Ravindu Senanayake",
      degree: "BSc Software Engineering",
      role: "Lecturer",
      company: "IIT",
      year: 2019,
    },
  ];

  const previewData = data && data.length > 0 ? data.slice(0, 5) : dummyData;

  // const handleViewAlumni = () => {
  //   console.log("Navigate")
  // };

  return (
    <div className="alumni-preview-card">
      <div className="alumni-preview-header">
        <h3>Alumni Overview</h3>
        <button onClick={handleViewAlumni}>View Alumni</button>
      </div>

      <div className="alumni-preview-table-wrapper">
        <table className="alumni-preview-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Degree</th>
              <th>Role</th>
              <th>Company</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {previewData.map((alumnus, index) => (
              <tr key={index}>
                <td>{alumnus.name}</td>
                <td>{alumnus.degree}</td>
                <td>{alumnus.role}</td>
                <td>{alumnus.company}</td>
                <td>{alumnus.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumniPreviewSection;