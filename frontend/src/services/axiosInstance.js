import axios from 'axios';

// Tạo một axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor để thêm token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Authorization Header:', `Bearer ${token}`);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi và làm mới token khi cần
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 403 và đảm bảo không thử lại nhiều lần
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gửi yêu cầu làm mới token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:3000/api/auth/refresh-token', {
          refreshToken,
        });

        // Lưu token mới vào localStorage
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);

        // Cập nhật header Authorization với token mới
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Thực hiện lại yêu cầu gốc với token mới
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        // Xử lý khi không thể làm mới token, có thể redirect người dùng đến trang đăng nhập
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
