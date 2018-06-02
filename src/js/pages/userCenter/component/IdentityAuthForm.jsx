import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select } from 'antd';
import { getDaysInOneMonth } from 'utils/util';
import FormUploadItem from 'pages/component/FormUploadItem';
import FormButton from 'pages/component/FormButton';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

const options = {

  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {...props};
  }

};

const renderOptions = (start, end, bool) => { //bool 是都补0
	let arr = [];
	for (let i = start; i <= end; i++){
		let value = i;
		if (bool){
			const str = `0${i}`;
			value = str.slice(-2);
		}
		arr.push(<Option value={`${value}`} key={i}>{value}</Option>)
	}	
	return arr;
}

const defaultYears = renderOptions(1960, 2050);
const months = renderOptions(1, 12, true);
const defaultDates = renderOptions(1, 30, true);

class IdentityAuthForm extends Component {

	static displayName = 'IdentityAuthForm';

	constructor(props){
		super(props);
		this.hanldeSubmit = this.hanldeSubmit.bind(this);
		this.checkCardNumber = this.checkCardNumber.bind(this);
	};

	static propTypes = {

	};

	checkCardNumber(rule, value, callback){
		const { card_type } = this.props;
		if (card_type.value == 'identity_card'){
			if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))){
				callback('请输入正确身份证号');
			} 
		}
		// if (card_type.value == 'passport'){
		// 	if (!(/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/.test(value))){
		// 		callback('请输入正确护照');
		// 	}			
		// }

		callback();
	}

	checkHasNumber(rule, value, callback){
		if (/[0-9]+/.test(value)){
			callback('姓名里不能包含数字');
		}
		callback();
	}

	hanldeSubmit(e){
		e.preventDefault();
		const { onSubmit } = this.props;
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				const { validity_start_year, validity_start_month, validity_start_date, 
					validity_end_year, validity_end_month, validity_end_date, ...other } = fieldsValue;
				const param = {
					validity_start: `${validity_start_year}${validity_start_month}${validity_start_date}`,
					validity_end: `${validity_end_year}${validity_end_month}${validity_end_date}`,
					...other
				};
				onSubmit && onSubmit(param);
			}
		})		
	}

	render(){
		const { getFieldDecorator, getFieldsValue } = this.props.form; 	
		const { validity_start_year, validity_start_month, validity_end_year, validity_end_month, 
			card_front, card_back, card_front_hand, timeStamp, error } = this.props;

		const currentStartDates = (validity_start_year.value && validity_start_month.value) ? renderOptions(1, getDaysInOneMonth(validity_start_year.value, validity_start_month.value), true) : defaultDates;
		const currentEndDates = (validity_end_year.value && validity_end_month.value) ? renderOptions(1, getDaysInOneMonth(validity_end_year.value, validity_end_month.value), true) : defaultDates;
		
		return (
			<div className='form-container identity-form especially-form'>
				<FormItem className="form-item">
					<label>国籍：</label>
					<div className="form-item-content">
						{
							getFieldDecorator('country', {

							})(<Select placeholder="请选择国籍" style={{width: 282}}>
								<Option value="china">中国</Option>
							</Select>)
						}
					</div>
				</FormItem>
				<div className="form-item">
					<label>姓名：</label>
					<FormItem>
						<div className="form-item-content">
							{
								getFieldDecorator('realname', {
									isValidateFirst: true,
									rules: [
										{required: true, message: '请输入姓名'}, 
										this.checkHasNumber
									]
								})(<Input placeholder="请输入姓名"/>)
							}
						</div>
					</FormItem>						
				</div>
				<FormItem className="form-item">
					<label>证件类型：</label>
					<div className="form-item-content">
						{
							getFieldDecorator('card_type', {

							})(<Select>
								<Option value="identity_card">身份证</Option>
							</Select>)
						}
					</div>
				</FormItem>	
				<div className="form-item">
					<label>证件号：</label>				
					<FormItem className="form-item">
						<div className="form-item-content">
							{
								getFieldDecorator('card_number', {
									validateFirst: true,
									rules: [{required: true, message: '请输入证件号'}, this.checkCardNumber]
								})(<Input placeholder="输入证件号"/>)
							}
						</div>
					</FormItem>	
				</div>
				<div className="validity-wrap">
					<label>证件有效期：</label>
					<FormItem className="form-item inline date-select year" style={{marginLeft: '0px'}}>
						<div className="form-item-content">
							{
								getFieldDecorator('validity_start_year', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 87}}
								>
									{defaultYears}
								</Select>)
							}
						</div>						
					</FormItem>
					<FormItem className="form-item inline date-select month">
						<div className="form-item-content">
							{
								getFieldDecorator('validity_start_month', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 67}}
								>
									{months}
								</Select>)
							}
						</div>						
					</FormItem>
					<FormItem className="form-item inline date-select day">
						<div className="form-item-content">
							{
								getFieldDecorator('validity_start_date', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 67}}
								>
									{currentStartDates}
								</Select>)
							}
						</div>				
					</FormItem>
					<div className="separate inline"></div>
					<FormItem className="form-item inline date-select year" style={{marginLeft: '0px'}}>
						<div className="form-item-content">
							{
								getFieldDecorator('validity_end_year', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 87}}
								>
									{defaultYears}
								</Select>)
							}
						</div>						
					</FormItem>
					<FormItem className="form-item inline date-select month">
						<div className="form-item-content">
							{
								getFieldDecorator('validity_end_month', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 67}}
								>
									{months}
								</Select>)
							}
						</div>						
					</FormItem>
					<FormItem className="form-item inline date-select day">
						<div className="form-item-content">
							{
								getFieldDecorator('validity_end_date', {
									rules: [{required: true, message: '请选择'}]
								})(<Select
									style={{width: 67}}
								>
									{currentEndDates}
								</Select>)
							}
						</div>						
					</FormItem>										
				</div>		
				<div className="upload-identity-wrap">
					<div className="label-block">
						<p>上传证件材料：</p>
						<div className="tip">
							<p>图片大小不可超过5M</p>
							<p>支持png、jpg</p>
						</div>
					</div>
					<FormItem className="form-item inline" style={{marginLeft: 0}}>
						<div className="form-item-content">
							{
								getFieldDecorator('card_front', {
									rules: [{required: true, message: '身份证正面照未上传'}]
								})(
									<FormUploadItem 
										name="card_front"
										text="身份证正面照"
										action='/api/pc/auth/upload_card'
										data={{type: 'card_front'}}		
										uploadImg={card_front}									
									/>
								)
							}
						</div>						
					</FormItem>
					<FormItem className="form-item inline">
						<div className="form-item-content">
							{
								getFieldDecorator('card_back', { 
									rules: [{required: true, message: '身份证背面照未上传'}]
								})(
									<FormUploadItem 
										name="card_back"
										text="身份证背面照"
										action='/api/pc/auth/upload_card'
										data={{type: 'card_back'}}	
										uploadImg={card_back}												
									/>
								)
							}
						</div>												
					</FormItem>	
					<FormItem className="form-item inline">
						<div className="form-item-content">
							{
								getFieldDecorator('card_front_hand', {
									rules: [{required: true, message: '手持证件照未上传'}]
								})(
									<FormUploadItem  
										name="card_front_hand"
										text="手持证件照"
										action='/api/pc/auth/upload_card'
										data={{type: 'card_front_hand'}}
										uploadImg={card_front_hand}											
									/>
								)
							}
						</div>												
					</FormItem>										
				</div>	
				{/*<div className="submit-btn-wrap" style={{textAlign: 'left', marginLeft: '140px'}}>
					<Button 
						type="primary" 
						className="submit-btn"
						onClick={this.hanldeSubmit}
					>确定</Button>
				</div>*/}	
				<FormButton 
					style={{textAlign: 'left', marginLeft: '140px', width: '207px'}}
					className="submit-btn-wrap"
					onSubmit={this.hanldeSubmit}
					errorTime={timeStamp}
					error={error}
				/>
			</div>
		)
		
	}
}

export default Form.create(options)(IdentityAuthForm)