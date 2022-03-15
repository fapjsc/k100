import axios from "axios";

export const authFetch = axios.create({
  baseURL: "/j",
});

authFetch.interceptors.request.use(
  (config) => {
    config.headers.common["login_session"] = `${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error.response);
    if (error.response.status === 401) {
      alert("401 error");
    }
    return Promise.reject(error);
  }
);
