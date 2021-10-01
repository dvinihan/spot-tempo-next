import axios from "axios";

export const login = async (code: string) => {
  const { data } = await axios.post(`${process.env.BASE_URL}/api/login`, {
    code,
    redirectUri: process.env.BASE_URL,
  });
  return data;
};
