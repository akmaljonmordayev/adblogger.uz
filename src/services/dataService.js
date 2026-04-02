import api from "./api";

export const adsService = {
  getAll: async (params) => {
    const response = await api.get("/ads", { params });
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/ads", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/ads/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },
};

export const blogService = {
  getPosts: async (params) => {
    const response = await api.get("/posts", { params });
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  createPost: async (data) => {
    const response = await api.post("/posts", data);
    return response.data;
  },
  updatePost: async (id, data) => {
    const response = await api.patch(`/posts/${id}`, data);
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};
