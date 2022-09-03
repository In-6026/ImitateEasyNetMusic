import Qs from 'qs'
import axios from "axios";

const Axios = axios.create()
Axios.defaults.baseURL = ' http://localhost:9527';
//Axios.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
Axios.defaults.transformRequest = (data, headers) => {
    const contentType = Axios.defaults.headers.common["Content-Type"];
    if (contentType === 'application/x-www-form-urlencoded') {
        return Qs.stringify(data);
    }
    return data;
}
Axios.defaults.withCredentials = true
Axios.interceptors.response.use(response => response.data, reson => Promise.reject(reson))
export default Axios;