import axios from "axios";
import { url } from "./data";

export const getSubscriptions = async (token) => {
  const res = await axios.get(`${url}/subscriptions`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
};

export const addNewSubscription = async (data) => {
  const response = await axios.post(
    `${url}/subscriptions`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return response.data;
};

export const updateSubscription = async (data) => {
  const res = await axios.put(
    `${url}/subscriptions/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return res.data;
};

export const deleteSubscription = async (data) => {
  const res = await axios.delete(`${url}/subscriptions/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
