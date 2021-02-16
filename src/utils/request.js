// 1. 引入axios
import axios from 'axios';
import {
  MessageBox,
  Message
} from 'element-ui';
import store from '@/store'

const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API,
  timeout:5000,
});
service.interceptors.request.use(config=>{
  // 通过axios拦截器添加token
  // console.log(config);
 
  // config.headers.Authorization = sessionStorage.getItem('token')
  config.headers.authorization = localStorage.token
  // console.log(sessionStorage);
  return config;
},(error)=>{
  return Promise.reject(error)
});


service.interceptors.response.use(response =>{
    return response
  
},error=>{
 
  if(response.meta.status !== 200) {
    Message.error(response.meta.msg)
  }
  return Promise.reject(error)
});
export default service;


