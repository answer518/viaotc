import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { Form, Input, Button } from 'antd';
import StepStatus from '../component/StepStatus'; 
import ajax from 'utils/request';
import MD5 from 'md5';
import FormButton from 'pages/component/FormButton';
import { getErrorMsg, passwordStrength } from 'utils/util';

const FormItem = Form.Item;

class Step3 extends Component {

	static displayName= 'Step3';

	constructor(props){
		super(props);
		this.state = {
			error: '',
			timeStamp: Date.now()
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.checkPasswordRight = this.checkPasswordRight.bind(this);
	}

	static propTypes = {
 
	};

	componentDidMount(){
		this.checkStep2Complete();
	}

	checkStep2Complete(){
		ajax.get('/api/pc/find_password/is_security_verified')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					if (!data.security_verified) {
						browserHistory.push('/app/entrance/forgot/step2');
						return;
					}
				}					
			});
	}

	checkPasswordRight(rule, value, callback){
		const { password } = this.props.form.getFieldsValue();
		if (value !== password){
			callback('前后密码输入不一致！');
		}
		callback();
	}

	checkPasswordStrength(rule, value, callback){
		if (passwordStrength(value) < 2){
			callback('密码强度太低');
		}
		callback();
	}

	checkPasswordLength(rule, value, callback){
		if (value.length < 8 || value.length > 20){
			callback('密码长度为8-20位');
		}
		callback();
	}		

	resetPassword(param){
		ajax.post('/api/pc/find_password/reset', param)
			.then((response) => {
				const { error, msg='' } = response;
				if (error == 0){
					browserHistory.push('/app/entrance/login');
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg}); 
				}
			})
	}

	handleSubmit(e){
	    e.preventDefault();

	    this.props.form.validateFields((err, values) => {
	    	if (!err) {
	    		const { password } = values;
	    		this.resetPassword({password: MD5(password)});
	    	}
	    });
	}	

	render(){

		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { timeStamp, error } = this.state;
		const { password, repeatPassword } = getFieldsValue();
		const isDisabled = !password || !repeatPassword;

		return (
			<div className="login-page-form otc-form">
				<input type="password" style={{display: 'none'}} name="funds_password"/>
				<StepStatus steps={3} activeStep={2}/>
				<h1>密码设置</h1>
				<div className="form-content">
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('password', {
									validateFirst: true,								
									rules: [
										{required: true, message: '请输入资金密码'},
										this.checkPasswordLength,
										this.checkPasswordStrength										
									]
								})(
									<Input type="password" placeholder="请填写新密码" hasRule={true} name="funds_password"/>
								)
							}
						</FormItem>							
					</div>
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('repeatPassword', {
									validateFirst: true,
									rules: [
										{required: true, message: '请填写新密码！'},
										this.checkPasswordRight
									]
								})(
									<Input type="password" placeholder="请填写新密码" name="funds_password"/>
								)
							}
						</FormItem>
					</div>
					<FormButton
						text="完成"
			        	isDisabled={isDisabled}
			        	onSubmit={this.handleSubmit}
			        	error={error}
			        	errorTime={timeStamp}							
					/>				
				</div>
			</div>
		)
		
	}
}

export default Form.create()(Step3);