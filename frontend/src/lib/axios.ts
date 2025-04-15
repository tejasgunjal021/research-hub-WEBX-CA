import axios from "axios";

// Create an Axios instance and type it accordingly
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

console.log("Base URL:", axiosInstance.defaults.baseURL);

export default axiosInstance;
