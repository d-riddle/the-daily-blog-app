import axios from "axios";

export const axiosInstance=axios.create({
    baseURL: "https://the-daily-blog-app.herokuapp.com/"
});