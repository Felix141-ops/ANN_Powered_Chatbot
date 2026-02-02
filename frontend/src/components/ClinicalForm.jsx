import { useEffect, useState } from "react";
import { fetchClinicalForm } from "../services/api";

export default function ClinicalForm() {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinicalForm()
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function handleChange(id, value) {
    setValues(prev => ({ ...prev, [id]: value }));
  }

  if (loading) return <p>Loading clinical form…</p>;
  if (!form) return <p>Unable to load form.</p>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>{form.title}</h4>
        <span className="tag">ANN Input Layer</span>
      </div>

      <p className="form-description">{form.description}</p>

      <form className="clinical-form">
        {form.fields.map(field => (
          <div className="form-group" key={field.id}>
            <label>
              {field.label}
              <span className="unit">({field.unit})</span>
            </label>

            <input
              type={field.type}
              min={field.min}
              max={field.max}
              value={values[field.id] || ""}
              onChange={e => handleChange(field.id, e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="button"
          className="submit-btn"
          disabled={Object.keys(values).length !== form.fields.length}
        >
          Submit for Analysis
        </button>
      </form>
    </div>
  );
}
