const BASE_URL = "http://192.168.0.110:3000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error || `Erro ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // ── Categories ──────────────────────────────────────────────────────────────
  getCategories: () => request("/categories"),

  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),

  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, { method: "DELETE" }),

  // ── Transactions ─────────────────────────────────────────────────────────────
  // month e year são opcionais (ex: getTransactions(6, 2026))
  getTransactions: (month, year) => {
    const params = new URLSearchParams();
    if (month != null) params.append("month", month);
    if (year  != null) params.append("year",  year);
    const query = params.toString();
    return request(`/transactions${query ? `?${query}` : ""}`);
  },

  createTransaction: (data) =>
    request("/transactions", { method: "POST", body: JSON.stringify(data) }),

  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),
};
