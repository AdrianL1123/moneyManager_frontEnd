import axios from "axios";

import { url } from "./data";

export const getExpenses = async (category) => {
  let params = {};
  if (category !== "Category") params.category = category;
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/expenses?${query.toString()}`);
  console.log(res.data);
  return res.data;
};

export const getExpense = async (id) => {
  //* to retrieve product from the API /products/:id
  const res = await axios.get(`${url}/expenses/${id}`);
  return res.data;
};

export const addExpense = async (data) => {
  const response = await axios.post(`${url}/expenses`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};

export const updateExpense = async (data) => {
  const response = await axios.put(
    `${url}/expenses/${data.id}`,
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

export const deleteExpense = async (data) => {
  const response = await axios.delete(`${url}/expenses/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token, // include token in the API
    },
  });
  return response.data;
};
