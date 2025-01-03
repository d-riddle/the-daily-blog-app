import axios from "axios";

export const axiosInstance=axios.create({
    baseURL: "https://the-daily-blog-app.onrender.com/api/"
});