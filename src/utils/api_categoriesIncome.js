import axios from "axios";
import { url } from "./data";

export const getCategoriesIncome = async () => {
  const response = await axios.get(`${url}/categoriesIncome`);
  return response.data;
};

export const addNewCategoriesIncome = async (data) => {
  const response = await axios.post(
    `${url}/categoriesIncome`,
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

export const updateCategoryIncome = async (data) => {
  const response = await axios.put(
    `${url}/categoriesIncome/${data._id}`,
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

export const deleteCategoryIncome = async (data) => {
  const response = await axios.delete(`${url}/categoriesIncome/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};
