import axios from 'axios'
// import router from '../router/index'

let token = sessionStorage.getItem("token");
const uri = process.env.NODE_ENV === 'development'
? '/rb'
: 'http://192.168.1.118:9090'

const instance = axios.create({
    baseURL: uri,
    timeout: 10000
});

instance.interceptors.request.use(function (config) {
    if(!token){
      token = sessionStorage.getItem("token");
    }
    config.headers.authorization = "berarer " + token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


instance.interceptors.response.use(function (response) {
    if(response.data.code == 304){
      console.log("--------------")
        // router.replace({path:"/login"});
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error);
  });

export default instance;

 