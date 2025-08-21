import axios from "axios";

// POST API
export const postApi = async ({ url, credentials = {} }) => {
  const response = await axios.post(url, credentials);

  return response;
};

// GET API
export const getApi = async ({ url }) => {
  const response = await axios.get(url, {});
  if (response.status === 200) return response.data;
};
