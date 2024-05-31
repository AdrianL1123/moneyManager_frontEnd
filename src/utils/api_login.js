import axios from "axios";
import { url } from "./data";

export const getLogin = async (data) => {
  const res = await axios.post(
    `${url}/users/login`,
    JSON.stringify(data), //* data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return res.data;
};
