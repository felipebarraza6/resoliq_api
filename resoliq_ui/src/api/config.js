import axiosImport from "axios";

const axios = axiosImport?.default || axiosImport;

const getDefaultBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    return "http://localhost:8000/api/";
  }
  return "http://137.184.152.245:8001/api/";
};

const BASE_URL = process.env.REACT_APP_API_URL || getDefaultBaseUrl();

export const Axios = axios.create({
  baseURL: BASE_URL,
});

export const POST_LOGIN = async (endpoint, data) => {
  const request = await Axios.post(endpoint, data);
  return request;
};

export const GET = async (endpoint) => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const request = await Axios.get(endpoint, options);
  return request;
};

export const POST = async (endpoint, data) => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const request = await Axios.post(endpoint, data, options);
  return request;
};

export const PATCH = async (endpoint, data) => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const request = await Axios.patch(endpoint, data, options);
  return request;
};

export const DELETE = async (endpoint) => {
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const request = await Axios.delete(endpoint, options);
  return request;
};
