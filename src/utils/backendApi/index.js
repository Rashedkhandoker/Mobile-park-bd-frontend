import axios from "axios";

const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
  headers: { Accept: "application/json" },
});

export const backendRequest = async ({ url, params, ...rest }) => {
  const response = await backendClient({ url, params, ...rest });
  return response.data;
};

export default backendClient;
