import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { Form, Input, Button } from 'antd';
import StepStatus from '../component/StepStatus'; 
import SmsInput from 'pages/component/SmsInput';
import ajax from 'utils/request';
import FormButton from 'pages/component/FormButton';
import { getErrorMsg, formatPhone } from 'utils/util';

const FormItem = Form.Item;

class Step2 extends Component {

	static displayName= 'Step2';

	constructor(props){
		super(props);
		this.state = {
			area_code: '',
			phone: '',
			sms_action: '',
			verify_type: 'phone',
			sms_id: 0,
			timeStamp: Date.now()
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSmsChange = this.handleSmsChange.bind(this);
	}

	static propTypes = {
 
	};

	componentDidMount(){
		this.checkStep1Complete();
	}	

	checkStep1Complete(){
		ajax.get('/api/pc/find_password/is_account_verified')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					if (!data.account_verified) {
						browserHistory.push('/app/entrance/forgot/step1');
						return;
					} else {
						const { area_code, phone, sms_action, verify_type } = data;
						this.setState({area_code, phone, sms_action, verify_type})
					}					
				}
			})
	}

	checkPhoneOrGa(param){
		ajax.post('/api/pc/find_password/verify_security', param)
			.then((response) => {
				const { error, msg } = response;
				if (error == 0){
					browserHistory.push('/app/entrance/forgot/step3');
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg})
				}
			});
	}

	handleSmsChange(id){
		this.setState({sms_id: id});
	}

	handleSubmit(e){
	    e.preventDefault();
	    const { area_code, phone, sms_action, verify_type, sms_id } = this.state;
	    this.props.form.validateFields((err, values) => {
	    	if (!err){
	    		let param = {};
	    		if (verify_type === 'ga'){
	    			param={...values}
	    		} else {
	    			param={
	    				area_code,
	    				phone,
	    				sms_action,
	    				sms_id,
	    				...values
	    			}
	    		}
	    		this.checkPhoneOrGa(param);
	    	}	
	    });
	}

	render(){
		const { getFieldDecorator, getFieldsValue } = this.props.form; 
		const { area_code, phone, sms_action, verify_type, error, timeStamp } = this.state;
		const { sms_code, ga_code } = getFieldsValue();

		const isDisabled = verify_type == 'ga' ? !ga_code : !sms_code;

		return (
			<div className="login-page-form otc-form">
				<StepStatus steps={3} activeStep={2}/>
				<h1>安全验证</h1>
				<div className="form-content">
					{verify_type == 'phone' ?
						<div>
							<div className="form-item">
								<div className="bound-phone">绑定的手机号：{formatPhone(phone || '')}</div>
							</div>
							<div className="form-item form-item-relative form-item-sms">
								<FormItem>
									{
										getFieldDecorator('sms_code', {
											rules: [{required: true, message: '请输入手机验证码！'}]
										})(
											<SmsInput 
												param={{area_code, phone}}
												canGet={area_code && phone}	
												sms_action={sms_action}
												placeholder="请输入手机验证码"
												onSmsIdChange={this.handleSmsChange}
											/>
										)
									}
								</FormItem>
							</div>
						</div> :
					<div className="form-item">
						<FormItem>
							{
								getFieldDecorator('ga_code', {
									rules: [{required: true, message: '请输入谷歌验证码！'}]
								})(
									<Input placeholder="请输入谷歌验证码"/>
								)
							}
						</FormItem>						
					</div>}
					<FormButton
						text="下一步"
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

export default Form.create()(Step2);