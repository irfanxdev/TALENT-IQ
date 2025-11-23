import axios from "axios";

// Axios is a JavaScript library used to make HTTP requests (API calls) from the browser or Node.js.
// It helps your frontend talk to your backend or external APIs.

// Think of Axios like a messenger between your app and the server.
console.log(import.meta.env.VITE_API_URL)
const axiosInstance=axios.create({
    // api url 
   
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true, // browser will sent the cookies to server automatically, on every single  req
})
export default axiosInstance;