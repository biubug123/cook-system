import axios from 'axios'

//普通请求用
let url = "http://139.199.86.11:8080/cookSystem";
// let url = "http://localhost:8080";
//广告文件域
export const advertisementDomain="http://139.199.86.11:8080/testImage/";

export const commomAxios = axios.create({
    baseURL: url,
    headers:{
        'Authorization':"bearer "+sessionStorage.getItem("token")
    }
});

//登录用
export const loginAxios = axios.create({
    baseURL: url,
    headers:{'Authorization':"Basic Y29vazpjb29rU2VjcmV0"}
});

//上传文件用
export const fileAxios = axios.create({
    baseURL: url,
    headers:{'Authorization':"Basic Y29vazpjb29rU2VjcmV0","Content-Type": "multipart/form-data"}
});