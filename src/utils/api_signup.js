import axios from "axios";
import { url } from "./data";

export const getSignUp = async (data) => {
  const res = await axios.post(`${url}/users/signup`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getUsers = async (data) => {
  let params = {};
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/users?${query.toString()}`);
  return res.data;
};

export const addUser = async (data) => {
  const response = await axios.post(
    `${url}/users/userAdd`,
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
