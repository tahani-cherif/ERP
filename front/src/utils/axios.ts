import axios from 'axios';

const tocken = () => {
  const accesstoken = window.localStorage.getItem('token');
  console.log(accesstoken);

  return accesstoken; // Ensure a blank line before this return statement
};

const api = axios.create({
  baseURL: 'http://51.195.216.235:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (request) => {
    const token = tocken();

    // console.log(token);

    if (token) {
      if (request.headers) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }

    // console.log('request sent');
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  },
);

export default api;
