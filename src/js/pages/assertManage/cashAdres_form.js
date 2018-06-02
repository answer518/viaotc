import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import {formatPhone} from 'utils/util'
import SmsInput from 'pages/component/SmsInput';
import PasswordInput from 'pages/component/PasswordInput';
import FormButton from 'pages/component/FormButton';
import axios from 'utils/request';
import { getErrorMsg } from 'utils/util';
import MD5 from 'md5';

const FormItem = Form.Item;

class CashAdresForm extends Component {

	static displayName = 'CashAdresForm';

	constructor(props){
		super(props);
		this.state = {
			error: '',
			timeStamp: Date.now(),
			sms_id: 0
		};
		this.handleSubmit  = this.handleSubmit.bind(this);
		this.onSmsIdChange = this.onSmsIdChange.bind(this);
	};

	static propTypes = {
		type: PropTypes.string //fund modify
	};

	static defaultProps = {
		param:{}
	}

	onSmsIdChange(id){
		this.setState({sms_id: id});
	}

	handleSubmit (e){
		e.preventDefault();
		const { ga_status, onSuccess, param } = this.props;
		const { sms_id } = this.state;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { funds_password, ...other } = values;
				const fundsPassword = MD5(funds_password);
				let {area_code, phone} = window.OTC;

				let params = { ...param, ...other, funds_password: fundsPassword, sms_action: '7', area_code, phone, sms_id };

				if (ga_status == 1){
					params = {...param, ...other, funds_password: fundsPassword};
				} 

				axios.post('/api/pc/withdraw_addr/add', params)
					.then((response) => {
						const { error, msg='' } = response;
						if (error == 0) {
							onSuccess && onSuccess();
						} else {
							const errorMsg = getErrorMsg(msg);
							this.setState({error: errorMsg, timeStamp: Date.now()});
						}
					});
			}
		});
	}

	render(){
		const { type, form, ga_status } = this.props;
		const { area_code, phone } = window.OTC;
		const { error, timeStamp } = this.state;
		const { getFieldDecorator, getFieldsValue } = form;
		const { remark='', addr='', sms_code='', funds_password='', ga_code='' } = getFieldsValue();
		const isDisabled = ga_status == 1 ? !(remark && addr && ga_code && funds_password) : !(remark && addr && sms_code && funds_password);

		return (
			<div className="form-container cash-adres-form especially-form">
					<div className="form-item">
						<label>地址备注：</label>
						<FormItem >
							<div className="form-item-content inset-content">
								{
									getFieldDecorator('remark', {
										rules: [{required: true, message: '请填写地址备注！'}]
									})(<Input placeholder="请输入地址备注"/>)
								}
							</div>
						</FormItem>
					</div>
					<div className="form-item">
						<label>提币地址：</label>
						<FormItem className="form-item">
							<div className="form-item-content inset-content">
								{
									getFieldDecorator('addr', {
										rules: [{required: true, message: '请填写提币地址！'}]
									})(<Input placeholder="请输入提币地址"/>)
								}
							</div>
						</FormItem>
					</div>
					<div className="form-item">
						<label>手机号：</label>
						<FormItem className="form-text">
							<div className="form-item-content">
								{window.OTC.phone ? formatPhone(window.OTC.phone) : ''}
							</div>
						</FormItem>
					</div>
				{
					ga_status == 0 ?
						<div className="form-item">
							<label>短信验证码：</label>
							<FormItem className="form-item">
								<div className="form-item-content inset-content">
									{
										getFieldDecorator('sms_code', {
										rules: [{required: true, message: '请填写验证码！'}]
										})(
											<SmsInput
												placeholder="请输入短信验证码"
												canGet = {area_code && phone}
												param={{area_code, phone}}
												sms_action="7"
												onSmsIdChange={this.onSmsIdChange}
											/>
										)
									}
									{/*<Button type="primary">点击获取</Button>*/}
								</div>
							</FormItem>
						</div>
						:
						<div className="form-item">
							<label>谷歌验证码：</label>						
							<FormItem>
								<div className="form-item-content">
									{
										getFieldDecorator('ga_code', {
											rules: [{required: true, message: '请填写谷歌验证码！'}]
										})(<Input placeholder="确认谷歌验证码"/>)
									}
								</div>
							</FormItem>
						</div>
				}
				<div className="form-item">
					<label>资金密码：</label>
					<FormItem>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('funds_password', {
									rules: [{required: true, message: '请填写资金密码！'}]
								})(<PasswordInput placeholder="请输入资金密码"/>)
							}
						</div>
					</FormItem>
				</div>
				<FormButton
					className="submit-btn-wrap"
					onSubmit={this.handleSubmit} 
					isDisabled={isDisabled} 
					error={error}
					errorTime={timeStamp}
				/>
			</div>
		)

	}
}

export default Form.create()(CashAdresForm)
