import axios from 'axios'
import router from '../router/index'

let token ="eyJ0eXAiOiJKV1QiLCJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIxIiwiYXVkIjoiZGV2IiwibmJmIjoxNjAzOTc0MzQwLCJpc3MiOiJodHRwczovL3JhaW5ib3cubWlsY2hzdHJhYmUuY29tIiwiZXhwIjoxNjAzOTc1NDIwLCJpYXQiOjE2MDM5NzQzNDAsInVzZXJJZCI6IjVmNmYwYzJlNWUwYTc1Mzg4ODdjNDhjNiIsImp0aSI6IjI3ZDFjM2E3MDZkZTRmODBhOTUwMjkzZmNhNGE0OGRjIiwidXNlcm5hbWUiOiJhc2tjaDNuZyJ9.Ka5hGGrtmcsLC3vAEuYRlnpMwA01dFwzV_c4KjwHPMY";

const instance = axios.create({
    baseURL: '/rb',
    timeout: 10000
});

instance.interceptors.request.use(function (config) {
  console.log(token)
    if(token){
        config.headers.authorization = "berarer " + token;
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

 