import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { Form, Input, Button } from 'antd';
import md5 from 'md5';
import StepStatus from '../component/StepStatus';
import FormButton from 'pages/component/FormButton';
import { getErrorMsg } from 'utils/util';
import ajax from 'utils/request';

const FormItem = Form.Item;

class Step1 extends Component {

	static displayName= 'Step1';

	constructor(props){
		super(props);
		this.state = {
			error: '',
			timeStamp: Date.now()
		};		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.refreshCode = this.refreshCode.bind(this);
	}

	static propTypes = { 

	};

	componentDidMount(){

	}

	refreshCode(){
		this.setState({timeStamp: Date.now()});
	}	

	handleSubmit(e){
	    e.preventDefault();

	    this.props.form.validateFields((err, values) => {
	    	if (!err) {  
				ajax.post('/api/pc/find_password/verify_account', values)   
					.then((response) => {
						const { error, msg = '' } = response;
						if (error == 0){
	    					browserHistory.push('/app/entrance/forgot/step2');
						} else {
							const errorMsg = getErrorMsg(msg);
							this.setState({timeStamp: Date.now(), error: errorMsg});
						}
					});		
	    	}
	    });
	}

	render(){
		
		const { getFieldDecorator, getFieldsValue } = this.props.form;
		const { timeStamp, error } = this.state;
		const { phone, captcha } = getFieldsValue();
		const isDisabled = !(phone && captcha);


		return (
			<div className="login-page-form otc-form">
				<StepStatus steps={3} activeStep={1}/>
				<h1>账号验证</h1>
				<div className="form-content"> 
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
					<div className="form-item form-item-relative form-item-captcha">
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
					</div>	
					<FormButton 
						text="下一步"
						error={error}
						isDisabled={isDisabled}
						onSubmit={this.handleSubmit}
						errorTime={timeStamp}
					/>																					
				</div>				
			</div>
		)
		
	}
}

export default Form.create()(Step1);