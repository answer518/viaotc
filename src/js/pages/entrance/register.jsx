import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import { Form, Input, Checkbox, Select, Button } from 'antd';
import FormButton from 'pages/component/FormButton';
import SmsInput from 'pages/component/SmsInput';
import PasswordInput from 'pages/component/PasswordInput';
import ajax from 'utils/request';
import { getErrorMsg, passwordStrength } from 'utils/util';
import { isNaN } from 'lodash';
import MD5 from 'md5';

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends Component {

	static displayName = 'Register';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			sms_id: '',
			error: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.refreshCode = this.refreshCode.bind(this);
		this.handleSmsIdChange = this.handleSmsIdChange.bind(this);
		this.timer = null;
	}

	componentWillUnmount(){
		this.timer && clearTimeout(this.timer);
	}

	refreshCode(){
		this.setState({timeStamp: Date.now()});
	}

	checkPhone(rule, value, callback) {

		const phone = value.replace(/(^\s*)|(\s*$)/g, '');
		if(!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
			return callback('请输入合法的手机号!')
		}
		callback();
	}

	checkPasswordNoSpace(rule, value, callback){
		if (/ /.test(value)) {
			callback('密码不能包含空格');
		} else {
			callback();
		}
	}

	checkPasswordStrength(rule, value, callback){
		const mode = passwordStrength(value);

		if (mode == 0 ) {
			callback('密码强度太低');
		} else if (mode >= 1 && mode <= 2){
			callback('密码强度中');
		} else if (mode > 2){
			callback('密码强度高');
		} else {
			callback();
		}
	}

	checkPasswordLength(rule, value, callback){
		if (value.length < 8 || value.length > 20){
			callback('密码长度为8-20位');
		} else {
			callback();
		}
	}

	checkNumber(rule, value, callback){
		const numberValue = Number(value);
		if (isNaN(numberValue)) {
			callback('请输入数字');
		} else {
			callback();
		}
	}		

	handleSmsIdChange(id){
		this.setState({sms_id: id})
	}

	handleSubmit(e){
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	const { password, agree, ...other } = values;
	      	if (!agree) return;
	      	const { sms_id } = this.state;
	      	const param = {
	      		sms_action: 0,
	      		area_code: '0086',
	      		sms_id,
	      		password: MD5(password),
	      		...other
	      	};

	      	ajax.post('/api/pc/register/do_register', param) 
	      		.then((response) => {
	      			const { error, msg='' } = response;
	      			if (error == 0) {
	      				browserHistory.push('/app/entrance/login');
	      				setTimeout(() => {
	      					window.location.reload();
	      				}, 200);
	      			} else {
	      				const erroMsg = getErrorMsg(msg);
	      				this.setState({timeStamp: Date.now(), error: erroMsg});
	      			}
	      		})
	      }
	  	})
	}

	render(){
		
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { timeStamp, error } = this.state;
		const { phone, captcha, sms_code, password, agree } = getFieldsValue();
		const isDisabled = !(phone && captcha && sms_code && password && agree);

		return (
			<div className="login-page-form">
				<h1>您好，欢迎注册ViaOTC！</h1>
				<div className="form-content otc-form">
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('phone', {
									rules: [
										{required: true, message: '请输入手机号！'},
										this.checkPhone
									]
								})(
									<Input placeholder="请输入手机号"/>
								)
							}
						</FormItem>	
						{/*<FormItem className="phone-area">
							{
								getFieldDecorator('area_code', {
									initialValue: '0086'
								})(
									<Select>
										<Option value="0086">+86</Option>
										<Option value="861">+861</Option>
									</Select>
								)
							}
						</FormItem>*/}					
					</div>
					<div className="form-item form-item-relative form-item-captcha">
						<FormItem>
							{
								getFieldDecorator('captcha', {
									rules: [{required: true, message: '请输入验证码！'}]
								})(
									<Input placeholder="请输入验证码" maxLength="4"/>
								)
							}
						</FormItem>
						<div className="captcha-code">
							<img 
								src={`${window.OTC.api_url}/api/pc/captcha?${timeStamp}`}
								onClick={this.refreshCode}
							/>						
						</div>
					</div>
					<div className="form-item form-item-relative form-item-sms">
						<FormItem>
							{
								getFieldDecorator('sms_code', {
									validateFirst: true,
									rules: [
										{required: true, message: '请输入手机验证码！'},
										this.checkNumber
									]
								})(
									<SmsInput 
										sms_action={0}
										hasGet={phone && captcha}
										param={{phone, area_code: '0086', captcha}}
										placeholder="请输入手机验证码" 
										onSmsIdChange={this.handleSmsIdChange}
									/>
								)
							}
						</FormItem>
					</div>
					<div className="form-item form-item-relative form-item-password">
						<FormItem>
							{
								getFieldDecorator('password', {
									validateFirst: true,
									rules: [
										{required: true, message: '请设置您的密码！'},
										this.checkPasswordNoSpace,
										this.checkPasswordLength,
										this.checkPasswordStrength
									]
								})(
									<PasswordInput 
										placeholder="请设置您的密码"
										hasRule={true}
									/>
								)
							}
						</FormItem>							
					</div>
					<div className="agree-text">
			        	<FormItem className="form-item inline">
			        		{
			        			getFieldDecorator('agree', {
			        				valuePropName: 'checked',
			        				initialValue: true
			        			})(
			        				<Checkbox>我已经阅读并同意<Link href="/app/protocol" className="protocol-link">《平台注册服务协议》</Link></Checkbox>
			        			)
			        		}
			        	</FormItem> 
			        </div>
			        <FormButton 
			        	text="立即注册"
			        	isDisabled={isDisabled}
			        	onSubmit={this.handleSubmit}
			        	error={error}
			        	errorTime={timeStamp}
			        />
					<div className="form-item form-login-tip">
						<span>已有账号？<Link to="/app/entrance/login">去登录</Link></span>
					</div>
				</div>
			</div>
		)
		
	}
}

export default Form.create()(Register);