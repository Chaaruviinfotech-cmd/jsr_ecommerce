import axios from 'axios';

const BASE_URL =  'https://shriramsabji.mandipro.com/jsr_ecommerce/';
const TIMEOUT_MS = 10000;
console.log("BASE_URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export default axiosInstance;
