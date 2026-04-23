import "./DynamicListSection.css";

const DynamicListSection = ({
  title,
  sectionName,
  items,
  fields,
  onChange,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="dynamic-section">
      <div className="dynamic-section-header">
        <h3>{title}</h3>
        <button type="button" className="add-btn" onClick={onAdd}>
          + Add
        </button>
      </div>

      {items.map((item, index) => (
        <div className="dynamic-item-card" key={index}>
          <div className="dynamic-grid">
            {fields.map((field) => (
              <div className="field" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={item[field.name]}
                  onChange={(e) => onChange(sectionName, index, e)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => onRemove(sectionName, index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicListSection;