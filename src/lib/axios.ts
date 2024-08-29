import axios from "axios";

export const URL_BACKEND = "http://localhost:3000/api/v1/";

export default axios.create({
  baseURL: URL_BACKEND,
});
