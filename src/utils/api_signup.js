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
