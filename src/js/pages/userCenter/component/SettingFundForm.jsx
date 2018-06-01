import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import PasswordInput from 'pages/component/PasswordInput';
import SmsInput from 'pages/component/SmsInput';
import FormButton from 'pages/component/FormButton';
import { browserHistory } from 'react-router';
import { formatPhone, getErrorMsg, passwordStrength } from 'utils/util';
import ajax from 'utils/request';
import MD5 from 'md5';

const FormItem = Form.Item;

class SettingFundForm extends Component {

	static displayName = 'SettingFundForm';

	constructor(props){
		super(props);
		this.state = {
			sms_id: 0,
			error: '',
			timeStamp: Date.now()
		};
		this.hanldeSubmit = this.hanldeSubmit.bind(this);
		this.handleSmsIdChange = this.handleSmsIdChange.bind(this);
	};

	static propTypes = {
		type: PropTypes.string //fund modify
	};

	static defaultProps = {
		isFundReset: false
	};

	handleSmsIdChange(id){
		this.setState({sms_id: id});
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

	setFundsPassword(url, param){
		const { onSuccess } = this.props;
		ajax.post(url, param).then((response) => {
			const { error, err_msg } = response;
			if (error == 0){
				onSuccess && onSuccess();
				browserHistory.push('/app/userCenter/secureSetting');
			} else {
				const errorMsg = getErrorMsg(err_msg);
				this.setState({timeStamp: Date.now(), error: errorMsg})
			}
		});		
	}

	hanldeSubmit(e){
		e.preventDefault();
		const { ga_status, isFundReset } = this.props;
		const { sms_id } = this.state;

		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				const { funds_password, sms_code, ga_code } = fieldsValue;
				const mdFounds_password = MD5(funds_password);
				let param = {
					phone: window.OTC.phone || '',
					area_code: '0086',
					sms_action: 3,
					sms_id,
					sms_code,
					funds_password: mdFounds_password					
				};

				// 有谷歌验证
				if(ga_status == 1) {
					param = {...param, ga_code}
				}

				if (isFundReset) {
					this.setFundsPassword('/api/funds_password/update', param);
				} else {
					this.setFundsPassword('/api/funds_password/set', param);
				}

			}
		});
	}

	render(){
		const { isFundReset, ga_status } = this.props;
		const { getFieldDecorator, getFieldsValue } = this.props.form; 
		const { timeStamp, error } = this.state;
		const { funds_password, sms_code, ga_code } = getFieldsValue();
		const isDisabled = ga_status == 0 ? !(funds_password && sms_code) : !ga_code;

		return (
			<div className="form-container user-center-form">
					<FormItem className="form-item">
						<label>{isFundReset ? '新的资金密码' : '资金密码'}：</label>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('funds_password', {
									validateFirst: true,								
									rules: [
										{required: true, message: '请输入资金密码'},
										this.checkPasswordLength,
										this.checkPasswordStrength										
									]
								})(<PasswordInput placeholder="请输入资金密码" hasRule={true}/>)
							}
						</div>
					</FormItem>
					<div>
						<FormItem className="form-item form-text">
							<label>手机号：</label> 
							<div className="form-item-content">
								{formatPhone(window.OTC.phone || '')}
							</div>
						</FormItem>								
						<FormItem className="form-item">
							<label>短信验证码：</label>
							<div className="form-item-content inset-content">
								{
									getFieldDecorator('sms_code', {
										rules: [{required: true, message: '请输入短信验证码'}]
									})(<SmsInput 
										placeholder="请输入短信验证码"
										onSmsIdChange={this.handleSmsIdChange}
										canGet={window.OTC.phone && window.OTC.area_code}
										param={{phone: window.OTC.phone, area_code: window.OTC.area_code}}
										sms_action={3}
									/>) 
								}
							</div>
						</FormItem>	
					</div>				
					{
						ga_status == 0 ? null: 	
						<div style={{marginBottom: '40px'}}>
							<FormItem className="form-item" style={{marginBottom: '40px'}}>
								<label>谷歌验证码：</label>
								<div className="form-item-content">
									{
										getFieldDecorator('ga_code', {
											rules: [{required: true, message: '请输入谷歌验证码'}]
										})(<Input placeholder="确认谷歌验证码"/>)
									}
								</div>
							</FormItem>	
						</div>
					}
					<FormButton
						className="submit-btn-wrap"
						isDisabled={isDisabled}
						error={error}
						errorTime={timeStamp}						
						onSubmit={this.hanldeSubmit}
					/>																							
			</div>
		)
		
	}
}

export default Form.create()(SettingFundForm)