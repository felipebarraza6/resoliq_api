import axios from "axios";

//const BASE_URL = "http://localhost:8000/api/";
const BASE_URL = "http://45.236.131.227:8000/api/";

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
