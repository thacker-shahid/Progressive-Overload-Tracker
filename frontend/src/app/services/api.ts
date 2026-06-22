const API_BASE = "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("gym-tracker-token");
}

async function request(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  verify: (email: string, code: string) =>
    request("/auth/verify", { method: "POST", body: JSON.stringify({ email, code }) }),

  resendCode: (email: string) =>
    request("/auth/resend-code", { method: "POST", body: JSON.stringify({ email }) }),

  forgotPassword: (email: string) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, code, newPassword }) }),

  getMe: () => request("/auth/me"),

  logout: () => request("/auth/logout", { method: "POST" }),
};

// ── User ──────────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => request("/users/profile"),

  updateProfile: (data: Record<string, any>) =>
    request("/users/profile", { method: "PUT", body: JSON.stringify(data) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request("/users/change-password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
};

// ── Exercises ─────────────────────────────────────────────────────────────────

export const exerciseApi = {
  getAll: (params?: { bodyPart?: string; muscle?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/exercises${query ? `?${query}` : ""}`);
  },

  getGrouped: () => request("/exercises/grouped"),

  getById: (id: string) => request(`/exercises/${id}`),
};

// ── Workouts ──────────────────────────────────────────────────────────────────

export const workoutApi = {
  getAll: () => request("/workouts"),

  getByExercise: (exerciseId: string) => request(`/workouts/${exerciseId}`),

  save: (exerciseId: string, data: { bodyPart: string; muscle: string; exerciseName: string; logs: any[] }) =>
    request(`/workouts/${exerciseId}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (exerciseId: string) => request(`/workouts/${exerciseId}`, { method: "DELETE" }),
};

// ── Contact ───────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    request("/contact", { method: "POST", body: JSON.stringify(data) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    return request(`/admin/users${query.toString() ? `?${query}` : ""}`);
  },
  updateUser: (id: string, data: Record<string, any>) =>
    request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: string) => request(`/admin/users/${id}`, { method: "DELETE" }),

  // Exercises
  createExercise: (data: { bodyPart: string; muscle: string; name: string; imageUrl?: string; videoUrl?: string }) =>
    request("/admin/exercises", { method: "POST", body: JSON.stringify(data) }),
  updateExercise: (id: string, data: Record<string, any>) =>
    request(`/admin/exercises/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExercise: (id: string) => request(`/admin/exercises/${id}`, { method: "DELETE" }),
  reorderBodyParts: (order: string[]) =>
    request("/admin/exercises-reorder/body-parts", { method: "PUT", body: JSON.stringify({ order }) }),
  reorderMuscles: (bodyPart: string, order: string[]) =>
    request("/admin/exercises-reorder/muscles", { method: "PUT", body: JSON.stringify({ bodyPart, order }) }),
  reorderExercises: (order: string[]) =>
    request("/admin/exercises-reorder/exercises", { method: "PUT", body: JSON.stringify({ order }) }),

  // Contacts
  getContacts: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return request(`/admin/contacts${query.toString() ? `?${query}` : ""}`);
  },
  markContactRead: (id: string) => request(`/admin/contacts/${id}/read`, { method: "PUT" }),
  deleteContact: (id: string) => request(`/admin/contacts/${id}`, { method: "DELETE" }),
};
