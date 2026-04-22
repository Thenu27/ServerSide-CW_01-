import { useEffect, useState } from "react";
import api from "../../components/Api/Api";
import "./AlumniProfilePage.css";
import ProfileSection from "../../components/Profile/ProfileSection/ProfileSection";
import DynamicListSection from "../../components/Profile/DynamicListSection/DynamicListSection";
import { useNavigate } from "react-router-dom";

const emptyDegree = {
  id: "",
  degreeName: "",
  institution: "",
  url: "",
  year: "",
};

const emptyCertification = {
  id: "",
  name: "",
  issuer: "",
  url: "",
  year: "",
};

const emptyLicence = {
  id: "",
  name: "",
  issuer: "",
  url: "",
  year: "",
};

const emptyCourse = {
  id: "",
  name: "",
  provider: "",
  url: "",
  year: "",
};

const emptyEmployment = {
  id: "",
  companyName: "",
  jobTitle: "",
  industrySector: "",
  startDate: "",
  endDate: "",
};

const emptyFormData = {
  id: "",
  fullName: "",
  bio: "",
  linkedIn: "",
  imageUrl: "",
  degrees: [emptyDegree],
  certifications: [emptyCertification],
  licences: [emptyLicence],
  courses: [emptyCourse],
  employmentHistory: [emptyEmployment],
};

const industryOptions = [
  { label: "Select Industry", value: "" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Finance", value: "Finance" },
  { label: "Banking", value: "Banking" },
  { label: "Education", value: "Education" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Telecommunications", value: "Telecommunications" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail", value: "Retail" },
  { label: "Marketing", value: "Marketing" },
  { label: "Consulting", value: "Consulting" },
  { label: "Government", value: "Government" },
  { label: "Media", value: "Media" },
  { label: "Logistics", value: "Logistics" },
  { label: "Other", value: "Other" },
];

const AlumniProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDynamicChange = (sectionName, index, e) => {
    const { name, value } = e.target;

    const updatedSection = [...formData[sectionName]];
    updatedSection[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      [sectionName]: updatedSection,
    }));
  };

  const addItem = (sectionName, template) => {
    setFormData((prev) => ({
      ...prev,
      [sectionName]: [...prev[sectionName], { ...template }],
    }));
  };

  const removeItemFromUI = (sectionName, index) => {
    const updatedSection = [...formData[sectionName]];
    updatedSection.splice(index, 1);

    if (updatedSection.length === 0) {
      if (sectionName === "degrees") updatedSection.push({ ...emptyDegree });
      if (sectionName === "certifications") updatedSection.push({ ...emptyCertification });
      if (sectionName === "licences") updatedSection.push({ ...emptyLicence });
      if (sectionName === "courses") updatedSection.push({ ...emptyCourse });
      if (sectionName === "employmentHistory") updatedSection.push({ ...emptyEmployment });
    }

    setFormData((prev) => ({
      ...prev,
      [sectionName]: updatedSection,
    }));
  };

  const normalizeProfileData = (profile) => {
    return {
      id: profile.id || "",
      fullName: profile.fullName || "",
      bio: profile.bio || "",
      linkedIn: profile.linkedIn || "",
      imageUrl: profile.imageUrl || "",
      degrees: profile.degrees && profile.degrees.length > 0 ? profile.degrees : [{ ...emptyDegree }],
      certifications:
        profile.certifications && profile.certifications.length > 0
          ? profile.certifications
          : [{ ...emptyCertification }],
      licences:
        profile.licences && profile.licences.length > 0
          ? profile.licences
          : [{ ...emptyLicence }],
      courses:
        profile.courses && profile.courses.length > 0
          ? profile.courses
          : [{ ...emptyCourse }],
      employmentHistory:
        profile.employmentHistory && profile.employmentHistory.length > 0
          ? profile.employmentHistory
          : [{ ...emptyEmployment }],
    };
  };

  const getMyProfile = async () => {
    try {
      const response = await api.get("/profile");

      if (response.data.profile) {
        console.log("profile:", response.data.profile);
        setFormData(normalizeProfileData(response.data.profile));
        setHasProfile(true);
      } else {
        setFormData(emptyFormData);
        setHasProfile(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setFormData(emptyFormData);
        setHasProfile(false);
      } else {
        console.error(err);
        alert("Error loading profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

 const createFullProfile = async () => {
  try {
    await api.post("/profile", {
      fullName: formData.fullName,
      bio: formData.bio,
      linkedIn: formData.linkedIn,
      imageUrl: formData.imageUrl,
    });
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving profile. All fields Required!");
    }
    return alert("Error saving profile");
  }

  try {
    for (const degree of formData.degrees) {
      if (
        degree.degreeName ||
        degree.institution ||
        degree.url ||
        degree.year
      ) {
        await api.post("/degree", {
          ...degree,
          year: degree.year ? Number(degree.year) : null,
        });
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving degrees. All fields Required!");
    }
    return alert("Error saving degrees");
  }

  try {
    for (const cert of formData.certifications) {
      if (cert.name || cert.issuer || cert.certUrl || cert.year) {
        await api.post("/certification", {
          ...cert,
          year: cert.year ? Number(cert.year) : null,
        });
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving certifications. All fields Required!");
    }
    return alert("Error saving certifications");
  }

  try {
    for (const licence of formData.licences) {
      if (
        licence.name ||
        licence.issuer ||
        licence.url ||
        licence.year
      ) {
        await api.post("/liscence", {
          ...licence,
          year: licence.year ? Number(licence.year) : null,
        });
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving licences. All fields Required!");
    }
    return alert("Error saving licences");
  }

  try {
    for (const course of formData.courses) {
      if (course.name || course.provider || course.url|| course.year) {
        await api.post("/course", {
          ...course,
          year: course.year ? Number(course.year) : null,
        });
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving courses. All fields Required!");
    }
    return alert("Error saving courses");
  }

  try {
    for (const job of formData.employmentHistory) {
      if (job.companyName && job.jobTitle) {
        await api.post("/employment", job);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Saving employment history. All fields Required!");
    }
    return alert("Error saving employment history");
  }

  alert("Profile created successfully!");
  getMyProfile();
};

const updateFullProfile = async () => {
  try {
    await api.put(`/profile`, {
      fullName: formData.fullName,
      bio: formData.bio,
      linkedIn: formData.linkedIn,
      imageUrl: formData.imageUrl,
    });
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating profile. All fields Required!");
    }
    return alert("Error updating profile");
  }

  try {
    for (const degree of formData.degrees) {
      const hasData =
        degree.degreeName ||
        degree.institution ||
        degree.url ||
        degree.year;

      if (!hasData) continue;

      const payload = {
        ...degree,
        year: degree.year ? Number(degree.year) : null,
      };

      if (degree.id) {
        await api.put(`/degree/${degree.id}`, payload);
      } else {
        await api.post("/degree", payload);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating degrees. All fields Required!");
    }
    return alert("Error updating degrees");
  }

  try {
    for (const cert of formData.certifications) {
      const hasData = cert.name || cert.issuer || cert.url|| cert.year;

      if (!hasData) continue;

      const payload = {
        ...cert,
        year: cert.year ? Number(cert.year) : null,
      };

      if (cert.id) {
        await api.put(`/certification/${cert.id}`, payload);
      } else {
        await api.post("/certification", payload);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating certifications. All fields Required!");
    }
    return alert("Error updating certifications");
  }

  try {
    for (const licence of formData.licences) {
      const hasData =
        licence.name || licence.issuer || licence.url || licence.year;

      if (!hasData) continue;

      const payload = {
        ...licence,
        year: licence.year ? Number(licence.year) : null,
      };

      if (licence.id) {
        await api.put(`/liscence/${licence.id}`, payload);
      } else {
        await api.post("/liscence", payload);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating licences. All fields Required!");
    }
    return alert("Error updating licences");
  }

  try {
    for (const course of formData.courses) {
      const hasData =
        course.name || course.provider || course.url|| course.year;

      if (!hasData) continue;

      const payload = {
        ...course,
        year: course.year ? Number(course.year) : null,
      };

      if (course.id) {
        await api.put(`/course/${course.id}`, payload);
      } else {
        await api.post("/course", payload);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating courses. All fields Required!");
    }
    return alert("Error updating courses");
  }

  try {
    for (const job of formData.employmentHistory) {
      const hasData = job.companyName && job.jobTitle;

      if (!hasData) continue;

      if (job.id) {
        await api.put(`/employment/${job.id}`, job);
      } else {
        await api.post("/employment", job);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return alert("Error Updating employment history. All fields Required!");
    }
    return alert("Error updating employment history");
  }

  alert("Profile updated successfully!");
  getMyProfile();
};

  const deleteItem = async (sectionName, itemId, index) => {
    try {
      let endpoint = "";

      if (sectionName === "degrees") endpoint = `/degree/${itemId}`;
      if (sectionName === "certifications") endpoint = `/certification/${itemId}`;
      if (sectionName === "licences") endpoint = `/liscence/${itemId}`;
      if (sectionName === "courses") endpoint = `/course/${itemId}`;
      if (sectionName === "employmentHistory") endpoint = `/employment/${itemId}`;

      if (itemId) {
        await api.delete(endpoint);
      }

      removeItemFromUI(sectionName, index);
    } catch (err) {
      alert(`Error deleting item from ${sectionName}`);
    }
  };

  const deleteFullProfile = async () => {
    const confirmed = window.confirm("Are you sure you want to delete the whole profile?");
    if (!confirmed) return;

    try {
      await api.delete(`/profile/${formData.id}`);
      alert("Profile deleted successfully!");
      setFormData(emptyFormData);
      setHasProfile(false);
      navigate("/profile");
    } catch (err) {
      alert("Error deleting full profile");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-brand">
          <h2>Alumni Profile</h2>
          <p>{hasProfile ? "Update your professional profile" : "Create your professional profile"}</p>
        </div>

        <div className="profile-form">
          <ProfileSection title="Basic Information">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>Biography</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>LinkedIn URL</label>
              <input
                type="text"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>Profile Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleBasicChange}
              />
            </div>
          </ProfileSection>

          <DynamicListSection
            title="Degrees"
            sectionName="degrees"
            items={formData.degrees}
            onChange={handleDynamicChange}
            onAdd={() => addItem("degrees", emptyDegree)}
            onRemove={(sectionName, index) => {
              const item = formData[sectionName][index];
              deleteItem(sectionName, item?.id, index);
            }}
            fields={[
              { label: "Degree Name", name: "degreeName", type: "text" },
              { label: "Institution", name: "institution", type: "text" },
              { label: "Degree URL", name: "url", type: "text" },
              { label: "Year", name: "year", type: "number" },
            ]}
          />

          <DynamicListSection
            title="Certifications"
            sectionName="certifications"
            items={formData.certifications}
            onChange={handleDynamicChange}
            onAdd={() => addItem("certifications", emptyCertification)}
            onRemove={(sectionName, index) => {
              const item = formData[sectionName][index];
              deleteItem(sectionName, item?.id, index);
            }}
            fields={[
              { label: "Certification Name", name: "name", type: "text" },
              { label: "Issuer", name: "issuer", type: "text" },
              { label: "Certification URL", name: "url", type: "text" },
              { label: "Year", name: "year", type: "number" },
            ]}
          />

          <DynamicListSection
            title="Licences"
            sectionName="licences"
            items={formData.licences}
            onChange={handleDynamicChange}
            onAdd={() => addItem("licences", emptyLicence)}
            onRemove={(sectionName, index) => {
              const item = formData[sectionName][index];
              deleteItem(sectionName, item?.id, index);
            }}
            fields={[
              { label: "Licence Name", name: "name", type: "text" },
              { label: "Issuer", name: "issuer", type: "text" },
              { label: "Licence URL", name: "url", type: "text" },
              { label: "Year", name: "year", type: "number" },
            ]}
          />

          <DynamicListSection
            title="Courses"
            sectionName="courses"
            items={formData.courses}
            onChange={handleDynamicChange}
            onAdd={() => addItem("courses", emptyCourse)}
            onRemove={(sectionName, index) => {
              const item = formData[sectionName][index];
              deleteItem(sectionName, item?.id, index);
            }}
            fields={[
              { label: "Course Name", name: "name", type: "text" },
              { label: "Provider", name: "provider", type: "text" },
              { label: "Course URL", name: "url", type: "text" },
              { label: "Year", name: "year", type: "number" },
            ]}
          />

          <DynamicListSection
            title="Employment History"
            sectionName="employmentHistory"
            items={formData.employmentHistory}
            onChange={handleDynamicChange}
            onAdd={() => addItem("employmentHistory", emptyEmployment)}
            onRemove={(sectionName, index) => {
              const item = formData[sectionName][index];
              deleteItem(sectionName, item?.id, index);
            }}
            fields={[
              { label: "Company", name: "companyName", type: "text" },
              { label: "Role", name: "jobTitle", type: "text" },
              {
                label: "Industry",
                name: "industrySector",
                type: "select",
                options: industryOptions,
              },
              { label: "Start Date", name: "startDate", type: "date" },
              { label: "End Date", name: "endDate", type: "date" },
            ]}
          />

          {!hasProfile ? (
            <button onClick={createFullProfile} className="btn-submit">
              Save Profile
            </button>
          ) : (
            <>
              <button onClick={updateFullProfile} className="btn-submit">
                Update Profile
              </button>

              <button onClick={deleteFullProfile} className="btn-delete">
                Delete Full Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfilePage;