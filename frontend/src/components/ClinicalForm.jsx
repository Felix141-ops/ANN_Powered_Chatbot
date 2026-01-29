export default function ClinicalForm() {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Clinical Data Entry</h4>
        <span className="tag">ANN Input Layer</span>
      </div>

      <form className="clinical-form">
        <div className="form-row">
          <div className="form-group">
            <label>Glucose Level (mg/dL)</label>
            <input type="number" placeholder="e.g: " />
          </div>

          <div className="form-group">
            <label>BMI (kg/m²)</label>
            <input type="number" step="0.1" placeholder="e.g: "/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age (years)</label>
            <input type="number" placeholder="e.g: 25"/>
          </div>

          <div className="form-group">
            <label>Insulin (μU/mL)</label>
            <input type="number" placeholder="e.g: "/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pregnancies (Count)</label>
            <input type="number" placeholder="e.g: 2"/>
          </div>

          <div className="form-group">
            <label>Blood Pressure (Diastolic only in mmHg)</label>
            <input type="number" placeholder="e.g: "/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SkinFold Thickness (mm)</label>
            <input type="number" placeholder="e.g: 35"/>
          </div>

          <div className="form-group">
            <label>Diabetes Pedigree Function</label>
            <input type="number" step="0.001" placeholder="e.g: "/>
          </div>
        </div>

        <button className="submit-btn">Submit for Analysis</button>
      </form>
    </div>
  );
}
