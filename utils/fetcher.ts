import axios from "axios";

export const defaultFetcher = (url: string) =>
  axios.get(url).then((res) => res.data);
