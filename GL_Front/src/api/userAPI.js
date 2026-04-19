import useAxiosPrivate from './useAxiosPrivate';

const useUserAPI = () => {
  const axiosPrivate = useAxiosPrivate();

  return {
    getMe: () =>
      axiosPrivate.get('/api/users/me'),

    getAllUsers: (page = 0, size = 10) =>
      axiosPrivate.get('/api/users', { params: { page, size } }),

    getUserById: (userId) =>
      axiosPrivate.get(`/api/users/${userId}`),

    createUser: (userData) =>
      axiosPrivate.post('/api/users', userData),

    updateUser: (userId, userData) =>
      axiosPrivate.put(`/api/users/${userId}`, userData),

    deleteUser: (userId) =>
      axiosPrivate.delete(`/api/users/${userId}`),

    getUsersByRole: (role) =>
      axiosPrivate.get(`/api/users/role/${role}`),

    getTechnicians: () =>
      axiosPrivate.get('/api/users/role/TECHNICIEN'),

    searchUsers: (query) =>
      axiosPrivate.get('/api/users/search', { params: { q: query } }),

    toggleUserStatus: (userId, active) =>
      axiosPrivate.patch(`/api/users/${userId}/status`, { active }),

    getProfile: () =>
      axiosPrivate.get('/api/users/profile'),

    updateProfile: (userData) =>
      axiosPrivate.put('/api/users/profile', userData),

    getActiveUsers: () =>
      axiosPrivate.get('/api/users/active'),
  };
};

export default useUserAPI;