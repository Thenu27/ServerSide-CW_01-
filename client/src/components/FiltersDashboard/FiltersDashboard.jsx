
    const FiltersDashboard = ({ filters, setFilters, onApply, onReset }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    return(
        <div className="filters-container">
            <div className="filter-group">
                <label htmlFor="programme">Programme</label>
                <select
                id="programme"
                name="programme"
                value={filters.programme}
                onChange={handleChange}
                >
                <option value="">All Programmes</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business Management">Business Management</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cyber Security">Cyber Security</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="graduationYear">Graduation Year</label>
                <select
                id="graduationYear"
                name="graduationYear"
                value={filters.graduationYear}
                onChange={handleChange}
                >
                <option value="">All Years</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="industrySector">Industry Sector</label>
                <select
                id="industrySector"
                name="industrySector"
                value={filters.industrySector}
                onChange={handleChange}
                >
                <option value="">All Industries</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Education">Education</option>
                </select>
            </div>

            <div className="filter-buttons">
                <button type="button" onClick={onApply}>
                Apply Filters
                </button>
                <button type="button" onClick={onReset} className="reset-btn">
                Reset
                </button>
            </div>
            </div>
    )
  }

export default FiltersDashboard;