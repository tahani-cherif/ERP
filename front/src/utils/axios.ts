import axios from 'axios';

const tocken = () => {
  const accesstoken = window.localStorage.getItem('token');
  console.log(accesstoken)
  
  return accesstoken;  // Ensure a blank line before this return statement
};

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (request) => {
    const token = tocken();
    // console.log(token);
    
    if (token) {
      if (request.headers) { // Ensure headers exist
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
    // console.log('send response', response.data);
    return response.data;
  },
  (error) => {
    console.log(error);
    // if (error.response.status === 404) {
    //   console.log("not found");
    // }
    return Promise.reject(error);
  },
);

export default api;