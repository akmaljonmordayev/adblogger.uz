import api from './api';

const applicationService = {
  apply:    (adId, data)   => api.post(`/ad-applications/${adId}`, data).then(r => r.data),
  received: ()             => api.get('/ad-applications/received').then(r => r.data),
  sent:     ()             => api.get('/ad-applications/sent').then(r => r.data),
  messages: (appId)        => api.get(`/ad-applications/${appId}/messages`).then(r => r.data),
  send:     (appId, text)        => api.post(`/ad-applications/${appId}/messages`, { text }).then(r => r.data),
  editMsg:  (appId, msgId, text) => api.patch(`/ad-applications/${appId}/messages/${msgId}`, { text }).then(r => r.data),
  deleteMsg:(appId, msgId)       => api.delete(`/ad-applications/${appId}/messages/${msgId}`).then(r => r.data),
  status:   (appId, status)      => api.patch(`/ad-applications/${appId}/status`, { status }).then(r => r.data),
};

export default applicationService;
