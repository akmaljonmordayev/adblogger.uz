import api from './api';

const orderService = {
  create:    (bloggerId, data)        => api.post(`/blogger-orders/${bloggerId}`, data).then(r => r.data),
  myOrders:  ()                       => api.get('/blogger-orders').then(r => r.data),
  messages:  (orderId)                => api.get(`/blogger-orders/${orderId}/messages`).then(r => r.data),
  send:      (orderId, text)          => api.post(`/blogger-orders/${orderId}/messages`, { text }).then(r => r.data),
  editMsg:   (orderId, msgId, text)   => api.patch(`/blogger-orders/${orderId}/messages/${msgId}`, { text }).then(r => r.data),
  deleteMsg: (orderId, msgId)         => api.delete(`/blogger-orders/${orderId}/messages/${msgId}`).then(r => r.data),
  status:    (orderId, status)        => api.patch(`/blogger-orders/${orderId}/status`, { status }).then(r => r.data),
  block:     (orderId)                => api.post(`/blogger-orders/${orderId}/block`).then(r => r.data),
  unblock:   (orderId)                => api.delete(`/blogger-orders/${orderId}/block`).then(r => r.data),
};

export default orderService;
