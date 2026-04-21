import "./ProfileSection.css";

const ProfileSection = ({ title, children }) => {
  return (
    <div className="profile-section">
      <h3>{title}</h3>
      <div className="profile-section-content">{children}</div>
    </div>
  );
};

export default ProfileSection;