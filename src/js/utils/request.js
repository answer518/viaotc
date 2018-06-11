import axios from 'axios';
import qs from 'qs';
import { Modal } from 'antd';
import { isObject } from 'lodash';
import { getRandom } from './util';
import { browserHistory } from 'react-router';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = window.OTC.api_url;
axios.defaults.withCredentials = true; 

//http response 拦截器
axios.interceptors.response.use(
	response => {
		const { error, msg } = response.data;
		// error code 11 代表需要登陆
		if (error == 11){
			browserHistory.push('/app/entrance/login');
			return
		}		
		// if (error != 0) {
		// 		Modal.error({
		// 			title: '提示',
		// 			content: error_msg || '异常，请稍后再试'
		// 		});			
		// }
		return response.data;
	}
)

function get(url, params, interval){
	const random = getRandom(1, 100000);
	const baseUrl = interval ? `${url}?${Date.now()/interval}`: `${url}?${random}${Date.now()}`; 
	return axios.get(baseUrl, {params});
}

function post(url, param, noStringify) {
	const random = getRandom(1, 100000); 
	const baseUrl = `${url}?${random}${Date.now()}`; 
	const params = noStringify ? param : qs.stringify(param);
	return axios.post(baseUrl, params);
}

const ajax = {
	get,
	post
}

export default ajax;