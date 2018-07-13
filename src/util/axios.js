import axios from 'axios'

//普通请求用
// axios.interceptors.request.use()
export const commomAxios = axios.create({
    baseURL: 'http://139.199.86.11:8080/cook',
    headers:{
        'Authorization':"bearer "+sessionStorage.getItem("token")
    }
});

//登录用
export const loginAxios = axios.create({
    baseURL: 'http://localhost:8080',
    headers:{'Authorization':"Basic Y29vazpjb29rU2VjcmV0"}
});

