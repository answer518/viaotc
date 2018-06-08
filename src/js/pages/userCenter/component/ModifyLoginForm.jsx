import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import PasswordInput from 'pages/component/PasswordInput';
import SmsInput from 'pages/component/SmsInput';
import { browserHistory } from 'react-router';
import { formatPhone } from 'utils/util';
import ajax from 'utils/request';
import MD5 from 'md5';

const FormItem = Form.Item;

class ModifyLoginForm extends Component {

	static displayName = 'ModifyLoginForm';

	constructor(props){
		super(props);
		this.state = {
			sms_id: 0
		};
		this.hanldeSubmit = this.hanldeSubmit.bind(this);
		this.handleSmsIdChange = this.handleSmsIdChange.bind(this);
	};

	static propTypes = {
		type: PropTypes.string //fund modify
	};

	componentDidMount(){

	}



	checkPasswordNoSpace(rule, value, callback){
		if (/ /.test(value)) {
			callback('密码不能包含空格');
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

	handleSmsIdChange(id){
		this.setState({sms_id: id});
	}

	hanldeSubmit(e){
		e.preventDefault();
		const { sms_id } = this.state;

		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				const { old_password='', new_password='', ...other } = fieldsValue;
				ajax.post('/api/pc/change_password/do_change', {
					...other,
					old_password: MD5(old_password),
					new_password: MD5(new_password),
					phone: window.OTC.phone,
					area_code: window.OTC.area_code,
					sms_action: 4,
					sms_id
				}).then((response) => {
					const { error } = response;
					if (error == 0){
						browserHistory.push('/app/entrance/login');
					}
				})
			}
		});
	}

	render(){
		const { getFieldDecorator } = this.props.form; 

		return (
			<div className="form-container user-center-form">
					<FormItem className="form-item">
						<label>原密码：</label>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('old_password', {
									rules: [
										{required: true, message: '请设置您的新密码！'}
									]
								})(<PasswordInput placeholder="请输入原密码"/>)
							}
						</div>
					</FormItem>			
					<FormItem className="form-item">
						<label>新密码：</label>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('new_password', {
									rules: [
										{required: true, message: '请设置您的新密码！'},
										this.checkPasswordNoSpace,
										this.checkPasswordLength
									]
								})(<PasswordInput placeholder="请输入新密码" hasRule={true} maxLength="20" />)
							}
						</div>
					</FormItem>	
					{window.OTC.ga_status == 0 ? <div>
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

									})(<SmsInput 
										placeholder="请输入短信验证码"
										onSmsIdChange={this.handleSmsIdChange}
										canGet={window.OTC.phone && window.OTC.area_code}
										param={{phone: window.OTC.phone, area_code: window.OTC.area_code}}
										sms_action={4}
									/>) 
								}
							</div>
						</FormItem>	
					</div>: 	
					<div style={{marginBottom: '40px'}}>
						<FormItem className="form-item" style={{marginBottom: '40px'}}>
							<label>谷歌双重验证码：</label>
							<div className="form-item-content">
								{
									getFieldDecorator('googlecode', {

									})(<Input placeholder="确认双重验证码"/>)
								}
							</div>
						</FormItem>	
					</div>
					}
					<div className="submit-btn-wrap">
						<Button 
							type="primary" 
							className="submit-btn"
							onClick={this.hanldeSubmit}
						>确定</Button>
					</div>																								
			</div>
		)
		
	}
}

export default Form.create()(ModifyLoginForm)