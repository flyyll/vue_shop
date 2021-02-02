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
  config.headers.authorization = localStorage.token
  return config;
},(error)=>{
  return Promise.reject(error)
});


service.interceptors.response.use(response =>{
    return response
},error=>{
  // console.dir(error)
  const {response} = error;
  if(response.status !== 200) {
    Message.error(response.data.message)
  }
  return Promise.reject(error)
});


export default service;


