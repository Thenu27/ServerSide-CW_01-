import { useState } from "react";
import api from "../../components/Api/Api";
import "./AlumniProfilePage.css";
import ProfileSection from "../../components/Profile/ProfileSection/ProfileSection";
import DynamicListSection from "../../components/Profile/DynamicListSection/DynamicListSection";
import { useNavigate } from "react-router-dom";

const AlumniProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    linkedIn: "",
    imageUrl: "",
    degrees: [
      {
        degreeName: "",
        university: "",
        degreeUrl: "",
        completionDate: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        certUrl: "",
        completionDate: "",
      },
    ],
    licences: [
      {
        name: "",
        issuer: "",
        licenceUrl: "",
        completionDate: "",
      },
    ],
    courses: [
      {
        name: "",
        provider: "",
        courseUrl: "",
        completionDate: "",
      },
    ],
    employmentHistory: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
      },
    ],
  });

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
      [sectionName]: [...prev[sectionName], template],
    }));
  };

  const removeItem = (sectionName, index) => {
    const updatedSection = [...formData[sectionName]];
    updatedSection.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      [sectionName]: updatedSection,
    }));
  };

  const createProfile = async () => {
    try {
      const response = await api.post("/profile/create", formData);
      console.log("Profile created:", response.data);
      window.alert("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      window.alert("Error creating profile!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-brand">
          <h2>Create Alumni Profile</h2>
          <p>Complete your professional profile</p>
        </div>

        <div className="profile-form">
          <ProfileSection title="Basic Information">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>Biography</label>
              <textarea
                name="bio"
                placeholder="Write a short professional bio"
                value={formData.bio}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>LinkedIn URL</label>
              <input
                type="text"
                name="linkedIn"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedIn}
                onChange={handleBasicChange}
              />
            </div>

            <div className="field">
              <label>Profile Image URL</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/profile.jpg"
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
            onAdd={() =>
              addItem("degrees", {
                degreeName: "",
                university: "",
                degreeUrl: "",
                completionDate: "",
              })
            }
            onRemove={removeItem}
            fields={[
              { label: "Degree Name", name: "degreeName", type: "text" },
              { label: "University", name: "university", type: "text" },
              { label: "Degree URL", name: "degreeUrl", type: "text" },
              { label: "Completion Date", name: "completionDate", type: "date" },
            ]}
          />

          <DynamicListSection
            title="Certifications"
            sectionName="certifications"
            items={formData.certifications}
            onChange={handleDynamicChange}
            onAdd={() =>
              addItem("certifications", {
                name: "",
                issuer: "",
                certUrl: "",
                completionDate: "",
              })
            }
            onRemove={removeItem}
            fields={[
              { label: "Certification Name", name: "name", type: "text" },
              { label: "Issuer", name: "issuer", type: "text" },
              { label: "Certification URL", name: "certUrl", type: "text" },
              { label: "Completion Date", name: "completionDate", type: "date" },
            ]}
          />

          <DynamicListSection
            title="Licences"
            sectionName="licences"
            items={formData.licences}
            onChange={handleDynamicChange}
            onAdd={() =>
              addItem("licences", {
                name: "",
                issuer: "",
                licenceUrl: "",
                completionDate: "",
              })
            }
            onRemove={removeItem}
            fields={[
              { label: "Licence Name", name: "name", type: "text" },
              { label: "Issuer", name: "issuer", type: "text" },
              { label: "Licence URL", name: "licenceUrl", type: "text" },
              { label: "Completion Date", name: "completionDate", type: "date" },
            ]}
          />

          <DynamicListSection
            title="Courses"
            sectionName="courses"
            items={formData.courses}
            onChange={handleDynamicChange}
            onAdd={() =>
              addItem("courses", {
                name: "",
                provider: "",
                courseUrl: "",
                completionDate: "",
              })
            }
            onRemove={removeItem}
            fields={[
              { label: "Course Name", name: "name", type: "text" },
              { label: "Provider", name: "provider", type: "text" },
              { label: "Course URL", name: "courseUrl", type: "text" },
              { label: "Completion Date", name: "completionDate", type: "date" },
            ]}
          />

          <DynamicListSection
            title="Employment History"
            sectionName="employmentHistory"
            items={formData.employmentHistory}
            onChange={handleDynamicChange}
            onAdd={() =>
              addItem("employmentHistory", {
                company: "",
                role: "",
                startDate: "",
                endDate: "",
              })
            }
            onRemove={removeItem}
            fields={[
              { label: "Company", name: "company", type: "text" },
              { label: "Role", name: "role", type: "text" },
              { label: "Start Date", name: "startDate", type: "date" },
              { label: "End Date", name: "endDate", type: "date" },
            ]}
          />

          <button onClick={createProfile} className="btn-submit">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfilePage;