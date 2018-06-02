import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Form, Input, Button } from 'antd';
import { isNil, keys, isObject } from 'lodash';
import FormButton from 'pages/component/FormButton';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';
import MD5 from 'md5';

const FormItem = Form.Item;

class Login extends Component {

	static displayName = 'Login';

	constructor(props){
		super(props);
		this.state = {
			err_times: 0,
			error: '',
			timeStamp: Date.now(),
			errorStamp:Date.now()
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.refreshCode = this.refreshCode.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	static propTypes = { 

	}

	refreshCode(){
		this.setState({timeStamp: Date.now()});
	}
	
	handleKeyDown(e){
		if (e.keyCode == 13){
			this.handleSubmit();
		}
	}

	handleSubmit(e){
	    e.preventDefault();

	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        const { password, ...other } = values;
	        const param = {
	        	password: MD5(password),
	        	...other
	        };

	        ajax.post('/api/pc/login', param)
	        	.then((response) => {
	        		const { error, err_times=0, msg='' } = response;
	        		if(error == 0){
	        			//this.props.actions.userLogin();
	        			browserHistory.push('/');
	        			setTimeout(() => {
	        				window.location.reload();
	        			}, 300);
	        		} else {
	        			const errorMsg = getErrorMsg(msg);
						this.setState({err_times: Number(err_times), errorStamp: Date.now(), error: errorMsg});	        			
	        		}
	        	});
	      }
	    });		

	}

	render(){

		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { err_times, timeStamp, errorStamp, error } = this.state;
 		const { phone, password } = getFieldsValue();
		const isDisabled = !(phone && password);

		return (
			<div className="login-page-form">
				<input type="password" style={{display: 'none'}} name="login_password"/>
				<h1 style={{marginBottom: '40px'}}>您好，欢迎回来！</h1>
				<div className="form-content otc-form" onKeyDown={this.handleKeyDown}>
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('phone', {
									rules: [
										{required: true, message: '请填写手机号！'},
										{pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入合法的手机号!'}
									]
								})(
									<Input placeholder="请填写手机号"/>
								)
							}
						</FormItem>						
					</div>
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('password', {
									rules: [{required: true, message: '请填写密码！'}]
								})( 
									<Input type="password"  placeholder="请填写密码" name="login_password"/>
								)
							}
						</FormItem>							
					</div>
					{Number(err_times) > 2 && <div className="form-item form-item-relative form-item-captcha">
						<FormItem>
							{
								getFieldDecorator('captcha', {
									rules: [{required: true, message: '请输入验证码！'}]
								})(
									<Input placeholder="请输入验证码"/>
								)
							}
						</FormItem>
						<div className="captcha-code">
							<img 
								src={`${window.OTC.api_url}/api/pc/captcha?${timeStamp}`}
								onClick={this.refreshCode}
							/>						
						</div>
					</div>}			
					<FormButton 
				     	style={{marginTop: '10px'}}
				     	text="登录"
				     	isDisabled={isDisabled}
				     	error={error}
				     	onSubmit={this.handleSubmit}	
				     	errorTime={errorStamp}					
					/>
					<div className="form-item form-login-tip" style={{textAlign: 'left'}}>
						<Link className="register" to="/app/entrance/register">立即注册</Link>
						<Link className="forgot" to="/app/entrance/forgot/step1">忘记密码？</Link>						
					</div>				
				</div>		
			</div>
		)
		
	}
}

export default Form.create()(Login);