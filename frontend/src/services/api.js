const API_BASE = "http://localhost:8000/api";

export async function fetchClinicalForm() {
  const res = await fetch(`${API_BASE}/chat/form`);
  if (!res.ok) throw new Error("Failed to load form");
  return res.json();
}
