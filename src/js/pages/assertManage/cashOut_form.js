import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import {formatPhone} from 'utils/util';
import SmsInput from 'pages/component/SmsInput';
import PasswordInput from 'pages/component/PasswordInput';
import FormButton from 'pages/component/FormButton';
import axios from 'utils/request';
import { getErrorMsg, checkDecimalLength } from 'utils/util';
import { isNaN, } from 'lodash';
import MD5 from 'md5';

const FormItem = Form.Item;

class CashOutForm extends Component {

	static displayName = 'CashOutForm';

	constructor(props){
		super(props);
		this.state = {
			withdraw_fee:'',
			minimal_amount:'',
			usable:'',
			sms_id: 0,
			error: '',
			timeStamp: Date.now()
		};		
		this.handleSubmit  = this.handleSubmit.bind(this);
		this.handleSmsIdChange = this.handleSmsIdChange.bind(this);
		this.checkCoinNumber = this.checkCoinNumber.bind(this);
	};

	static propTypes = {
		type: PropTypes.string //fund modify
	};

	static defaultProps = {
		param:{}
	};

	componentDidMount(){
		this.getData('/api/pc/withdraw/minimal_amount','minimal_amount');
		this.getData('/api/pc/balance/detail','usable');
		this.getData('/api/pc/withdraw/fee','withdraw_fee');
	}

	checkNumber(rule, value, callback){
		const numberValue = Number(value);
		if (isNaN(numberValue)) {
			callback('请输入数字');
		} else if (!checkDecimalLength(numberValue, 6)) {
			callback('小数点后最多6位');
		}
		callback();
	}	

	handleSmsIdChange(id){
		this.setState({sms_id: id});
	}

	getData(url,stateKey){
		axios.get(url,this.props.param).then(
			d => {
				this.setState({
					[stateKey]:d.data[stateKey]
				})
			}
		)
	}

	handleSubmit (e){
		e.preventDefault();
		const { ga_status, onSuccess, onSuccessTip, param, form } = this.props;
		const { sms_id, withdraw_fee } = this.state;  

		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { funds_password, ...other } = values;
				const fundsPassword = MD5(funds_password);
				const {area_code, phone} = window.OTC;
				let params = {...other, ...param, funds_password: fundsPassword, fee: withdraw_fee, sms_action: 6, area_code, phone, sms_id};
				//if (ga_status == 1) {
				//	params = {...other, ...param, funds_password: fundsPassword, fee: withdraw_fee};
				//}

				axios.post('/api/pc/withdraw/do_withdraw', params)
					.then((response) => {
						const { error, msg = '', data } = response;
						if (error == 0){
							if(!data.is_addr_added){
								form.resetFields();
								onSuccess && onSuccess(params.to_addr);
							} else {
								onSuccessTip && onSuccessTip();
							}			 				
						} else {
							const errorMsg = getErrorMsg(msg);
							this.setState({timeStamp: Date.now(), error: errorMsg});							
						}
					});
			}
		});
	}

	checkCoinNumber(rule, value, callback){
		const { minimal_amount } = this.state;
		const numberValue = Number(value) || 0;
		if (numberValue < Number(minimal_amount)){
			callback(`最小提币数量${minimal_amount}!`);
		}
		callback();
	}

	render(){
		const { type, form ,param, ga_status } = this.props;
		const { getFieldDecorator, getFieldsValue } = form;
		let { withdraw_fee, minimal_amount, usable, error, timeStamp } = this.state;
		const { area_code, phone } = window.OTC;
		const { to_addr, amount, sms_code, ga_code, funds_password } = getFieldsValue();

		const isDisabled = ga_status == 1 ? !(to_addr && amount && funds_password && ga_code) : !(to_addr && amount && sms_code && funds_password);

		let coin_type = param.coin_type.toUpperCase();
			usable = usable - withdraw_fee;

		return (
			<div className="form-container especially-form clearfix">
				<div className="form-item">
					<label>提币地址：</label>
					<FormItem>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('to_addr', {
									rules: [{required: true, message: '请填写提币地址！'}]
								})(<Input placeholder="请输入提币地址"/>)
							}
						</div>
					</FormItem>
				</div>
				<div className="form-item">
					<label>提币数量：</label>
					<FormItem className="form-item" style = {{marginBottom:'20px'}}>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('amount', {
									validateFirst: true,
									rules: [
										{required: true, message: '请填写提币数量！'},
										this.checkNumber,
										this.checkCoinNumber
									]
								})(
										<Input placeholder="请输入提币数量" maxLength="8"/>
								)								
							}
							<span className="coin-type">{coin_type}</span>
							<div>
								<div className="cash-tip clearfix">
									<div className="fl">
										<span>最小提币量:</span>
										<span className="colored">{minimal_amount}{coin_type}</span>
									</div>
									<div className="fr">
										<span>可提币数量：</span>
										<span className="colored">{usable <= 0 ? 0 : usable.toFixed(6)}{coin_type}</span>
									</div>
								</div>
							</div>							
						</div>
					</FormItem>
				</div>
				<div className="form-item" style = {{marginBottom :'5px'}}>
					<label>提币手续费：</label>
					<FormItem>
						<div className="form-item-content inset-content colored">
							{withdraw_fee}{coin_type}
						</div>
					</FormItem>
				</div>
				<div className="form-item" style = {{marginBottom :'20px'}}>
					<label>手机号：</label>
					<FormItem className="form-text">
						<div className="form-item-content">
							{window.OTC.phone ? formatPhone(window.OTC.phone) : ''}
						</div>
					</FormItem>
				</div>
				<div className="form-item">
					<label>短信验证码：</label>
					<FormItem>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('sms_code', {
									rules: [{required: true, message: '请填写验证码！'}]
								})(
									<SmsInput
										sms_action={6}
										param={{area_code, phone}}
										placeholder="请输入短信验证码"
										canGet = {area_code && phone}
										onSmsIdChange={this.handleSmsIdChange}
									/>
								)
							}
							{/*<Button type="primary">点击获取</Button>*/}
						</div>
					</FormItem>
				</div>
				<FormItem className="form-item">
					<label>资金密码：</label>
					<div className="form-item-content inset-content">
						{
							getFieldDecorator('funds_password', {
								rules: [{required: true, message: '请填写资金密码！'}]
							})(<PasswordInput placeholder="请输入资金密码" maxLength="6" hasRule={false}/>)
						}
					</div>
				</FormItem>
				{
					ga_status == 0 ? null:
					<div className="form-item" style={{marginBottom: '40px'}}>
						<label>谷歌验证码：</label>
						<FormItem>
							<div className="form-item-content">
								{
									getFieldDecorator('ga_code', {
										rules: [{required: true, message: '请填写确认谷歌验证码！'}]
									})(<Input placeholder="确认谷歌验证码"/>)
								}
							</div>
						</FormItem>
					</div>
				}
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

export default Form.create()(CashOutForm)
