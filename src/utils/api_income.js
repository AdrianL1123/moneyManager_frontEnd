import axios from "axios";

import { url } from "./data";

export const getIncomes = async (category, token) => {
  let params = {};
  if (category !== "Category") params.category = category;
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/incomes?${query.toString()}`);
  return res.data;
};

export const getIncome = async (id) => {
  //* to retrieve product from the API /products/:id
  const res = await axios.get(`${url}/incomes/${id}`);
  return res.data;
};

export const addIncome = async (data) => {
  const response = await axios.post(`${url}/incomes`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};

export const updateIncome = async (data) => {
  const response = await axios.put(
    `${url}/incomes/${data.id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token, // include token in the API
      },
    }
  );
  return response.data;
};

export const deleteIncome = async (data) => {
  const response = await axios.delete(`${url}/incomes/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token, // include token in the API
    },
  });
  return response.data;
};
