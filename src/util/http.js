import axios from 'axios'
import router from '../router/index'

let token ;

const instance = axios.create({
    baseURL: '/rb',
    timeout: 10000
});

instance.interceptors.request.use(function (config) {
    if(token){
        config.headers.authorization = "berarer " + token;
    }else{
        token = sessionStorage.getItem("token");
        if(token){
            config.headers.authorization = "berarer " + token;
        }
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


instance.interceptors.response.use(function (response) {
    if(response.data.code == 304){
        router.replace({path:"/login"});
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error);
  });

export default instance;

 