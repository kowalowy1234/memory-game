import axios, { AxiosInstance} from "axios";

const key : string = `${process.env.REACT_APP_MEMORY_GAME_API_KEY}`;

const instance : AxiosInstance = axios.create({
  baseURL: 'https://api.pexels.com/v1/',
  headers: {
    Authorization: key,
  }});

export default instance;