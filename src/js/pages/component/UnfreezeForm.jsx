import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import FormButton from 'pages/component/FormButton';
import SmsInput from 'pages/component/SmsInput';
import ajax from 'utils/request';
import { getErrorMsg, formatPhone } from 'utils/util';

const FormItem = Form.Item;

class UnfreezeForm extends Component {

	static displayName = 'UnfreezeForm';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: '',
			sms_id: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSmsChange = this.handleSmsChange.bind(this);		
	};

	static propTypes = {

	};

	handleSmsChange(id){
		this.setState({sms_id: id});
	}

	handleSubmit(e){
		e.preventDefault();
		const { url, param, onSuccess, ga_status } = this.props;
		const { sms_id } = this.state;

	   	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			let params = { ...values, ...param,  sms_action: 5, sms_id, phone: window.OTC.phone || '', area_code: '0086'};
      			
      			if (ga_status == 1){
      				params = {...values, ...param}
      			}

      			ajax.post(url, params)
      				.then((response) => {
      					const { error, msg } = response;
      					if (error == 0){
							onSuccess && onSuccess();
      					} else {
      						const errorMsg = getErrorMsg(msg);
      						this.setState({error: errorMsg, timeStamp: Date.now()})
      					}
      				})
      		}	
      	})	
	}


	render(){
		const { text, ga_status } = this.props;
		const { timeStamp, error } = this.state;
		const { getFieldDecorator, getFieldsValue } = this.props.form;	
		const { ga_code, sms_code } = getFieldsValue();	
		const phone = window.OTC.phone || '';
		const area_code = '0086';
		const isDisabled = ga_status == 1 ? !ga_code : !sms_code;

		return (
			<div className="form-container user-center-form especially-form">
				{
					ga_status == 1 
					? 	<div className="form-item" style={{padding: '0 150px 0 150px'}}>
							<label>谷歌验证码：</label> 
							<FormItem>
								<div className="form-item-content">
									{
										getFieldDecorator('ga_code', {
											rules: [{required: true, message: '请输入谷歌验证码！'}]
										})(
											<Input placeholder="请输入谷歌验证码"/>
										)
									}
								</div>
							</FormItem>	
						</div>	
					:<div style={{padding: '0 150px 0 150px'}}>
						<FormItem className="form-item form-text">
							<label>手机号：</label> 
							<div className="form-item-content">
								{formatPhone(phone)}
							</div>
						</FormItem>	
						<div className="form-item">		
							<label>短信验证码：</label>											
							<FormItem>
								<div className="form-item-content inset-content">
									{
										getFieldDecorator('sms_code', {
											rules: [{required: true, message: '请输入短信验证码'}]
										})(<SmsInput 
											placeholder="请输入短信验证码"
											onSmsIdChange={this.handleSmsChange}
											canGet={phone && area_code}
											param={{phone, area_code}}
											sms_action={5}
										/>) 
									}
								</div>
							</FormItem>	
						</div>
					</div>}
				<div style={{height: '80px', backgroundColor: '#fff'}}>	
					<FormButton
						text={text}
						className="submit-btn-wrap"
						isDisabled={isDisabled}
						errorTime={timeStamp}
						error={error}
						onSubmit={this.handleSubmit}
					/>
				</div>		
			</div>
		)
		
	}
}

export default Form.create()(UnfreezeForm)