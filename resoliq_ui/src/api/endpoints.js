import create from "@ant-design/icons/lib/components/IconFont";
import { POST, POST_LOGIN, GET, PATCH, DELETE } from "./config";

export const login = async (data) => {
  const response = await POST_LOGIN("auth/users/login/", data);
  return response;
};

export const get_profile = async (user) => {
  const response = await GET(`auth/users/${user}/`);
  return response.data;
};

export const users_list = async (page) => {
  const response = await GET(`auth/users/?page=${page}`);
  return response.data;
};

export const create_user = async (data) => {
  const response = await POST("auth/users/", data);
  return response;
};

export const change_password = async (data) => {
  const response = await POST(`auth/users/reset_password/`, data);
  return response;
};

export const update_user = async (user, data) => {
  const response = await PATCH(`auth/users/${user.username}/`, data);
  return response;
};

export const delete_user = async (user) => {
  const response = await DELETE(`auth/users/${user}/`);
  return response;
};

export const create_residue = async (data) => {
  const response = await POST("residues/", data);
  return response;
};

export const list_residues = async (page) => {
  const response = await GET(`residues/?page=${page}`);
  return response.data;
};

export const update_residue = async (id, data) => {
  const response = await PATCH(`residues/${id}/`, data);
  return response;
};

export const delete_residue = async (id) => {
  const response = await DELETE(`residues/${id}/`);
  return response;
};

export const create_driver = async (data) => {
  const response = await POST("drivers/", data);
  return response;
};

export const list_drivers = async () => {
  const response = await GET("drivers/");
  return response.data;
};

export const update_driver = async (id, data) => {
  const response = await PATCH(`drivers/${id}/`, data);
  return response;
};

export const delete_driver = async (id) => {
  const response = await DELETE(`drivers/${id}/`);
  return response;
};

export const list_clients = async (page) => {
  const response = await GET(`clients/?page=${page}`);
  return response.data;
};

export const create_client = async (values) => {
  const response = await POST("clients/", values);
  return response;
};
export const update_client = async (id, data) => {
  const response = await PATCH(`clients/${id}/`, data);
  return response;
};
export const delete_client = async (id) => {
  const response = await DELETE(`clients/${id}/`);
  return response;
};

export const list_register_residues = async () => {
  const response = await GET("register-residues/");
  return response;
};

export const create_register_residue = async (data) => {
  const response = await POST("register-residues/", data);
  return response.data;
};
export const update_register_residue = async (id, data) => {
  const response = await PATCH(`register-residues/${id}/`, data);
  return response;
};
export const delete_register_residue = async (id) => {
  const response = await DELETE(`register-residues/${id}/`);
  return response;
};

export const list_orders = async (page) => {
  const response = await GET(`orders/?page=${page}`);
  return response.data;
};

export const create_order = async (data) => {
  const response = await POST("orders/", data);
  return response;
};
export const update_order = async (id, data) => {
  const response = await PATCH(`orders/${id}/`, data);
  return response;
};
export const delete_order = async (id) => {
  const response = await DELETE(`orders/${id}/`);
  return response;
};

const api = {
  authenticated: { login: login, get_profile: get_profile },
  users: {
    list: users_list,
    create: create_user,
    update: update_user,
    delete: delete_user,
    change_password: change_password,
  },
  residues: {
    list: list_residues,
    create: create_residue,
    update: update_residue,
    delete: delete_residue,
  },
  clients: {
    list: list_clients,
    create: create_client,
    update: update_client,
    delete: delete_client,
  },
  drivers: {
    list: list_drivers,
    create: create_driver,
    update: update_driver,
    delete: delete_driver,
  },
  register_residues: {
    list: list_register_residues,
    create: create_register_residue,
    update: update_register_residue,
    delete: delete_register_residue,
  },
  orders: {
    list: list_orders,
    create: create_order,
    update: update_order,
    delete: delete_order,
  },
};

export default api;
