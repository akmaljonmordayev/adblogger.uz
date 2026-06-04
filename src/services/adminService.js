import api from "./api";

// ── Dashboard ──────────────────────────────────────────────────────────────────
export const adminDashboardService = {
  getStats: () => api.get("/admin/dashboard").then((r) => r.data.data || r.data),
};

// ── Applications ───────────────────────────────────────────────────────────────
export const adminApplicationsService = {
  getAll: (params) => api.get("/admin/applications", { params }).then((r) => r.data),
  approve: (id) => api.patch(`/admin/applications/${id}/approve`).then((r) => r.data),
  reject: (id, reason) => api.patch(`/admin/applications/${id}/reject`, { reason }).then((r) => r.data),
};

// ── Users ──────────────────────────────────────────────────────────────────────
export const adminUsersService = {
  getAll: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  getOne: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  update: (id, data) => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
};

// ── Bloggers ───────────────────────────────────────────────────────────────────
export const adminBloggersService = {
  getAll: (params) => api.get("/admin/bloggers", { params }).then((r) => r.data),
  verify: (id, isVerified) =>
    api.patch(`/admin/bloggers/${id}/verify`, { isVerified }).then((r) => r.data),
  block: (id, isBlocked) =>
    api.patch(`/admin/bloggers/${id}/block`, { isBlocked }).then((r) => r.data),
  freeze: (id, isFrozen) =>
    api.patch(`/admin/bloggers/${id}/freeze`, { isFrozen }).then((r) => r.data),
  remove: (id) => api.delete(`/admin/bloggers/${id}`).then((r) => r.data),
};

// ── Ads ────────────────────────────────────────────────────────────────────────
export const adminAdsService = {
  getAll: (params) => api.get("/admin/ads", { params }).then((r) => r.data),
  changeStatus: (id, status) =>
    api.patch(`/admin/ads/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/admin/ads/${id}`).then((r) => r.data),
};

// ── Blogs ──────────────────────────────────────────────────────────────────────
export const adminBlogsService = {
  getAll: (params) => api.get("/admin/blogs", { params }).then((r) => r.data),
  create: (formData) =>
    api
      .post("/admin/blogs", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  update: (id, formData) =>
    api
      .patch(`/admin/blogs/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  remove: (id) => api.delete(`/admin/blogs/${id}`).then((r) => r.data),
};

// ── Categories ─────────────────────────────────────────────────────────────────
export const adminCategoriesService = {
  getAll: () => api.get("/admin/categories").then((r) => r.data),
  create: (data) => api.post("/admin/categories", data).then((r) => r.data),
  update: (id, data) => api.patch(`/admin/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),
  syncCounts: () => api.post("/admin/categories/sync-counts").then((r) => r.data),
};

// ── FAQs ───────────────────────────────────────────────────────────────────────
export const adminFaqsService = {
  getAll: () => api.get("/admin/faqs").then((r) => r.data),
  create: (data) => api.post("/admin/faqs", data).then((r) => r.data),
  update: (id, data) => api.patch(`/admin/faqs/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/admin/faqs/${id}`).then((r) => r.data),
};

// ── Contacts ───────────────────────────────────────────────────────────────────
export const adminContactsService = {
  getAll: (params) => api.get("/admin/contacts", { params }).then((r) => r.data),
  getOne: (id) => api.get(`/admin/contacts/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/admin/contacts/${id}/status`, { status }).then((r) => r.data),
  reply: (id, reply) =>
    api.patch(`/admin/contacts/${id}/reply`, { reply }).then((r) => r.data),
  remove: (id) => api.delete(`/admin/contacts/${id}`).then((r) => r.data),
};

// ── Campaigns ──────────────────────────────────────────────────────────────────
export const adminCampaignsService = {
  getAll: (params) => api.get("/admin/campaigns", { params }).then((r) => r.data),
};

// ── Businesses ─────────────────────────────────────────────────────────────────
export const adminBusinessesService = {
  getAll: (params) => api.get("/admin/businesses", { params }).then((r) => r.data),
};
