import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { browserHistory } from 'react-router';
import SmsInput from 'pages/component/SmsInput';
import FormButton from 'pages/component/FormButton';
import QRCode from 'qrcode.react';
import ajax from 'utils/request';
import { formatPhone, getErrorMsg } from 'utils/util'; 

const FormItem = Form.Item;


class SettingGaForm extends Component {

	static displayName = 'SettingGaForm';

	constructor(props){
		super(props);
		this.state = {
			ga_key: '',
			sms_id: 0,
			error: '',
			timeStamp: Date.now()
		};
		this.getGaKey = this.getGaKey.bind(this);
		this.hanldeSubmit = this.hanldeSubmit.bind(this);
		this.handleSmsIdChange = this.handleSmsIdChange.bind(this);		
	}

	static propTypes = {

	};

	componentDidMount(){
		this.getGaKey();
	}

	getGaKey(){
		ajax.get('/api/pc/ga/get_key')
			.then((response) => {
				const { error, msg='', data } = response;
				if (error == 0){
					this.setState({ga_key: data.ga_key});
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg})
				}
			})
	}

	handleSmsIdChange(id){
		this.setState({sms_id: id});
	}

	hanldeSubmit(e){
		e.preventDefault();
		const { onSuccess } = this.props;
 		const { sms_id } = this.state;

		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				ajax.post('/api/pc/ga/bind', {
					...fieldsValue,
					phone: window.OTC.phone,
					area_code: '0086',
					sms_action: 2,
					sms_id
				}).then((response) => {
					const { error, msg='' } = response;
					if (error == 0){
						onSuccess && onSuccess();
						browserHistory.push('/app/userCenter/secureSetting');
					} else {
						const errorMsg = getErrorMsg(msg);
						this.setState({timeStamp: Date.now(), error: errorMsg})
					}
				})
			}
		});
	}	

	render(){
		const { getFieldDecorator, getFieldsValue } = this.props.form; 
		const { ga_code, sms_code } = getFieldsValue();
		const { ga_key, timeStamp, error } = this.state;
		const { username='', phone='' } = window.OTC;
		const qrValue = `otpauth://totp/${phone}?secret=${ga_key}&issuer=Bitdad`;

		const isDisabled = !(ga_code && sms_code);

		return (
			<div className="form-container user-center-form">
				<div className="ga-qr-wrap clearfix" style={{marginBottom: '30px'}}>
					<div className="ga-qr-key">
						<p>密钥用于找回谷歌验证器，请妥善保管</p>
						<p className="key">{ga_key}</p>
					</div>
					<div className="ga-qr">
						<QRCode value={qrValue} size={122}/>
					</div> 
				</div>
				<FormItem className="form-item">
					<label>谷歌验证码：</label>
					<div className="form-item-content">
						{
							getFieldDecorator('ga_code', {
								rules: [{required: true, message: '请输入谷歌验证码'}]
							})(<Input placeholder="请输入谷歌验证码"/>)
						}
					</div>
				</FormItem>					
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
								sms_action={2}
							/>) 
						}
					</div>
				</FormItem>	
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

export default Form.create()(SettingGaForm)