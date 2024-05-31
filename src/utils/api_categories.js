import axios from "axios";
import { url } from "./data";

export const getCategories = async () => {
  const response = await axios.get(`${url}/categories`);
  return response.data;
};

export const addNewCategories = async (data) => {
  const response = await axios.post(`${url}/categories`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};

export const updateCategory = async (data) => {
  const response = await axios.put(
    `${url}/categories/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return response.data;
};

export const deleteCategory = async (data) => {
  const response = await axios.delete(`${url}/categories/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};
