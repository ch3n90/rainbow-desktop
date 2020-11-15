import axios from 'axios'
// import router from '../router/index'
const remote = require('electron').remote


let token;
const uri = process.env.NODE_ENV === 'development' ? '/rb' : 'http://web.rainbow.milchstrabe.com/rb'

const instance = axios.create({
    baseURL: uri,
    timeout: 10000
});



instance.interceptors.request.use(function (config) {
    if(!token){
      token =remote.getGlobal('cache').token;
    }
    config.headers.authorization = "berarer " + token;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


instance.interceptors.response.use(function (response) {
    if(response.data.code == 304){
        // router.replace({path:"/login"});
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    console.log(error)
    return Promise.reject(error);
  });

export default instance;

 