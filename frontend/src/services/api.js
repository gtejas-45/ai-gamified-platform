// Axios instance – every call automatically includes the Firebase JWT token
// React → this file → Flask backend → Gemini / Firebase Admin SDK

import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000,   // 30 s (AI calls can take a few seconds)
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor: attach Firebase ID token ────────────────────────────
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor: normalise error messages ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 401) return Promise.reject(new Error('Unauthorized. Please log in again.'))
    if (status === 403) return Promise.reject(new Error('You do not have permission to perform this action.'))
    if (status === 404) return Promise.reject(new Error('Resource not found.'))
    if (status === 413) return Promise.reject(new Error('File is too large.'))
    if (status === 429) return Promise.reject(new Error('Too many requests. Please wait a moment.'))
    if (status >= 500)  return Promise.reject(new Error('Server error. Please try again later.'))
    return Promise.reject(new Error(message || 'An unexpected error occurred.'))
  },
)

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register:    (data) => api.post('/api/auth/register', data),
  login:       (data) => api.post('/api/auth/login', data),
  getProfile:  ()     => api.get('/api/auth/profile'),
  updateProfile:(data)=> api.put('/api/auth/profile', data),
}

// ─── Classroom API ────────────────────────────────────────────────────────────
export const classroomAPI = {
  create:      (data)  => api.post('/api/classrooms', data),
  join:        (code)  => api.post('/api/classrooms/join', { code }),
  getAll:      ()      => api.get('/api/classrooms'),
  getById:     (id)    => api.get(`/api/classrooms/${id}`),
  getStudents: (id)    => api.get(`/api/classrooms/${id}/students`),
  remove:      (id)    => api.delete(`/api/classrooms/${id}`),
  removeStudent:(cId, sId) => api.delete(`/api/classrooms/${cId}/students/${sId}`),
}

// ─── Material API ─────────────────────────────────────────────────────────────
export const materialAPI = {
  upload:  (formData) => api.post('/api/materials/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,   // PDF processing can take longer
  }),
  getAll:  (classroomId) => api.get('/api/materials', { params: { classroomId } }),
  getById: (id)          => api.get(`/api/materials/${id}`),
  delete:  (id)          => api.delete(`/api/materials/${id}`),
}

// ─── AI API ──────────────────────────────────────────────────────────────────
export const aiAPI = {
  generateQuestions: (data) => api.post('/api/ai/generate-questions', data, { timeout: 60000 }),
  explainAnswer:     (data) => api.post('/api/ai/explain-answer', data),
  chat:              (data) => api.post('/api/ai/chat', data),
}

// ─── Question API ─────────────────────────────────────────────────────────────
export const questionAPI = {
  getAll:   (params)    => api.get('/api/questions', { params }),
  update:   (id, data)  => api.put(`/api/questions/${id}`, data),
  approve:  (id)        => api.post(`/api/questions/${id}/approve`),
  reject:   (id)        => api.post(`/api/questions/${id}/reject`),
  delete:   (id)        => api.delete(`/api/questions/${id}`),
}

// ─── Game API ─────────────────────────────────────────────────────────────────
export const gameAPI = {
  create:  (data) => api.post('/api/games', data),
  getAll:  (params) => api.get('/api/games', { params }),
  getById: (id)   => api.get(`/api/games/${id}`),
  start:   (id)   => api.post(`/api/games/${id}/start`),
  submit:  (id, data) => api.post(`/api/games/${id}/submit`, data),
}

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getStudent:   (id)  => api.get(`/api/analytics/student/${id}`),
  getClassroom: (id)  => api.get(`/api/analytics/classroom/${id}`),
}

// ─── Recommendations API ──────────────────────────────────────────────────────
export const recommendationsAPI = {
  get: (studentId) => api.get(`/api/recommendations/${studentId}`),
}

// ─── Health check ─────────────────────────────────────────────────────────────
export const healthCheck = () => api.get('/api/health')

export default api
