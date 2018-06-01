import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, Radio, Select } from 'antd';
import CoinTypeSelect from 'pages/component/CoinTypeSelect';
import FormButton from 'pages/component/FormButton';
import InputRange from 'pages/component/InputRange';
import ajax from 'utils/request';
import classNames from 'classnames';
import { isNaN, isNil } from 'lodash';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const options = {
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {...props.fields};
  }
};

class DealForm extends Component {

	static displayName = 'DealForm';

	constructor(props){
		super(props);
		this.state = {
			coin_price: 0,
			sellable: 0
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.checkSellable = this.checkSellable.bind(this);
	}

	componentDidMount(){
		const { type } = this.props;
		const { coin_type } = this.props.fields;
		type == 'sell' && this.getBalanceDetail(coin_type.value || 'btc');
		this.getCoinPrice(coin_type.value || 'btc');
	}

	// componentWillReceiveProps(nextProps){
	// 	if ((this.props.fields.coin_type.value != nextProps.fields.coin_type.value) && nextProps.type == 'sell'){
	// 		this.getBalanceDetail(nextProps.fields.coin_type.value);
	// 	}
	// }

	componentWillReceiveProps(nextProps){
		if (this.props.fields.coin_type.value != nextProps.fields.coin_type.value){
			this.getCoinPrice(nextProps.fields.coin_type.value);
			if (nextProps.type == 'sell'){
				this.getBalanceDetail(nextProps.fields.coin_type.value);
			}
		}
	}

	componentWillUmount(){
		this.props.form.resetFields();
	}

	handleSelectChange(value){
		const { type } = this.props;
		if (type === 'sell'){
			this.getBalanceDetail(value); 
		}
		this.getCoinPrice(value);
	}

	getBalanceDetail(coin_type){//获取资产详情
		ajax.get('/api/balance/detail', {coin_type, type: 'sellable'})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({sellable: data.sellable})
				}
			})
	}

	getCoinPrice(coin_type){
		ajax.get('/api/market/coin_price', {coin_type})
			.then((response) => {
				const { error, data } = response;
				this.setState({coin_price: data.price})
			})
	}

	checkSellable(rule, value, callback){
		const { type, fields } = this.props;
		const { sellable } = this.state;
		const max = Number(value[1]) || 0;

		if (type == 'sell' && (max > sellable)){ 
			callback(`最大可售额${sellable}${fields.coin_type.value.toUpperCase()}`);
		}
		callback();
	}

	checkRanges(rule, value, callback){
		const min = value[0];
		const max = value[1];

		const minNumber = Number(value[0]);
		const maxNumber = Number(value[1]);

		if(isNil(min) || isNil(max)){
			callback('请输入交易额')
		} else if (isNaN(minNumber) || isNaN(maxNumber)){
			callback('请输入数字')
		} else if (!(minNumber > 0) || !(maxNumber > 0)){ 
			callback('交易最小额和交易最大额必须大于0')
		} else if (maxNumber < minNumber){
			callback('交易最小额不能大于交易最大额')
		} else {
			callback();
		}		
	}

	checkNumber(rule, value, callback){
		const numberValue = Number(value);
		if (isNaN(numberValue)) {
			callback('请输入数字');
		}
		callback();
	}

	handleSubmit(e){
		e.preventDefault();
		const { onSubmit, type } = this.props;

	   	this.props.form.validateFields((err, values) => {
      		if (!err) {
      			const { ranges, ...other } = values;
        		onSubmit && onSubmit({min_amount: ranges[0], max_amount: ranges[1], ...other});
      		}
    	});
	}

	render(){
		const { type, form, error, timeStamp, fields, id } = this.props;
		const { coin_price, sellable } = this.state;
		const { getFieldDecorator, getFieldsValue, getFieldError } = form;
		const { coin_type, currency, premium, is_fixed_price } = fields;

		const coinTypeValue = coin_type.value.toUpperCase();
		const premiumValue = premium.value;
		const currencyValue = currency.value;
		const isFixedPriceValue = Number(is_fixed_price.value);
		const numberPremium = Number(premiumValue)
		const premium_price = isNaN(numberPremium) ? 0 : (coin_price * (1 + numberPremium * 0.01)).toFixed(2);

		return (
			<div className="form-container publish-form especially-form">
				<input type="password" style={{display: 'none'}} name="funds_password"/>				
				<FormItem
					className="form-item"
				>
					<label>
						<b>*</b><span>交易币种：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('coin_type', {
							})(
								<CoinTypeSelect
									width={458}
									all={false}
									disabled={!!id}
									onSelect={this.handleSelectChange}
								/>
							)
						}
					</div>
				</FormItem>
				<FormItem
					className="form-item"
				>
					<label>
						<b>*</b><span>支付货币：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('currency', {

							})(
								<Select
									style={{width: 458}}
									disabled={!!id}
								>
									<Option value="CNY">CNY</Option>
								</Select>
							)
						}
					</div>
				</FormItem>
				<FormItem
					className="form-item"
				>
					<label>
						<b>*</b><span>{type == 'sell' ? '收款' : '付款'}方式：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('pay_method', {
								rules: [{required: true, message: `请选择${type == 'sell' ? '收款' : '付款'}方式`}]
							})(
								<CheckboxGroup>
									<Checkbox value="weixin">微信支付</Checkbox>
									<Checkbox value="alipay">支付宝支付</Checkbox>
									<Checkbox value="bank_transfer">国内银行转账</Checkbox>
								</CheckboxGroup>
							)
						}
					</div>
				</FormItem>
				<FormItem
					className="form-item"
					style={{marginBottom: '0px'}}
				>
					<label>
						<span>固定价格：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('is_fixed_price', {
								exclusive: true
							})(
					            <RadioGroup>
					              <Radio value="1">开启</Radio>
					              <Radio value="0">关闭</Radio>
					            </RadioGroup>
							)
						}
					</div>
				</FormItem>
				{isFixedPriceValue == 0 ?
				<div className="form-item" style={{marginBottom: '10px'}}>
					<label>
						<b>*</b><span>溢价：</span>
					</label>
					<FormItem>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('premium', {
									validateFirst: true,
									rules: [
										{required: true, message: '请输入溢价率'},
										this.checkNumber
									]
								})(
									<Input className="lg"/>
								)
							}
							<div className="unit" style={{top: 0}}>%</div>
							<div className="tip">市场参考价：<span className="price">{coin_price || 0}</span>
							{currencyValue}/{coinTypeValue}<span className="labx" style={{marginLeft: '10px'}}>计算公式：{`Bitfinex*${(1 + (Number(premiumValue) || 0) * 0.01).toFixed(2)}`}</span></div>
						</div>
					</FormItem>
					<div className="form-item clearfix" style={{padding: '10px 0'}}>
						<label>交易价格：</label>
						<div className="form-item-content">
							<div className="text-item">
								<span>{premium_price} {currencyValue}/{coinTypeValue}</span>
								<span className="comment">(当前参考)</span>
							</div>
						</div>
					</div>
				</div>
				:
				<div className="form-item">
					<label>
						<b>*</b><span>交易价格：</span>
					</label>
					<FormItem>
						<div className="form-item-content inset-content">
							{
								getFieldDecorator('price', {
									validateFirst: true,
									rules: [
										{required: true, message: '请输入交易价格'},
										this.checkNumber
									]
								})(
									<Input className="lg"/>
								)
							}
							<div className="unit" style={{top: 0}}>CNY</div>
							<div className="tip">市场参考价：<span className="price">{coin_price}</span>{currencyValue}/{coinTypeValue}</div>
						</div>
					</FormItem>
				</div>
				}
				<div className="form-item clearfix" style={{marginBottom: '10px'}}>
					<label><b>*</b>交易限额：</label>
					<div className="form-item-content clearfix deal-range-wrap"> 
						<FormItem>
							{
								getFieldDecorator('ranges', {
									validateFirst: true, 
									rules: [this.checkRanges, this.checkSellable]
								})(
									<InputRange coinType={coin_type.value}/>
								)
							}
						{type == 'sell' && <div className="tip" style={{width: '380px'}}>{`您账户中该币种的最大可售额为${sellable}${coinTypeValue}`}</div>}						
						</FormItem>												
						{/*<FormItem className="fl" style={{marginBottom: '0px'}}>
							{
								getFieldDecorator('min_amount', {
									validateFirst: true,
									rules: [
										{required: true, message: '请输入最小限额'},
										this.checkNumber,
										this.checkDealRange
									]
								})(
									<Input
										className="ml"
										placehodler="单笔交易最小限额"
									/>
								)
							}
							//type == 'sell' && <div className="tip">若您不填写额度，将默认为不限</div>
						</FormItem>*/}
						{/*<div className="relate fl">~</div>
						<div className="fl max-mount">
							<div className="form-item-group">
								<FormItem className="form-item inline absolute-explain-text">
									{
										getFieldDecorator('max_amount', {
											validateFirst: true,
											rules: [
												{required: true, message: '请输入最大限额'},
												this.checkNumber,
												this.checkRange,
												this.checkSellable
											]
										})(
											<Input
												className="ml"
												placehodler="单笔交易最大限额"
												name="max_amount"
											/>
										)
									}
									{type == 'sell' && <div className="tip" style={{width: '380px', left: '-220px'}}>{`您账户中该币种的最大可售额为${sellable}${coinTypeValue}`}</div>}
								</FormItem>
							</div>
						</div>
					*/}
					</div>
					<div className="inline deal-unit">
						{coinTypeValue}
					</div>						
				</div>
				<FormItem
					className="form-item"
					style={{marginBottom: '30px'}}
				>
					<label>
						<b>*</b><span>付款期限：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('expect_period', {

							})(
								<Select style={{width: 458}}>
									<Option value="30">30分钟</Option>
									<Option value="60">60分钟</Option>
								</Select>
							)
						}
						<div className="tip">{type == 'sell' ? '要求对方在多少时间内完成支付，超时未支付的订单将被系统自动取消' : '承诺在多少时间内完成支付，超时未支付的订单将被系统自动取消'}</div>
					</div>
				</FormItem>
				{window.OTC.funds_password_status == 1 && <FormItem
					className="form-item"
					style={{marginBottom: '30px'}}
				>
					<label>
						<b>*</b><span>资金密码：</span>
					</label>
					<div className="form-item-content">
						{
							getFieldDecorator('funds_password', {
								rules: [{required: true, message: '请输入资金密码'}]
							})(
								<Input
									className="lg"
									placehodler="请输入资金密码"
									type="password"
									name="funds_password"
								/>
							)
						}
					</div>
				</FormItem>}
				<FormButton
					className="submit-btn-wrap submit-btn-lg"
					style={{marginBottom: '28px'}}
					text="确认发布"
		        	isDisabled={false}
		        	onSubmit={this.handleSubmit}
		        	error={error}
		        	errorTime={timeStamp}
				/>
				{/*<div className="deal-form-info">
					<div className="tip">
						<p>需要设置币种、付款方式、价格、限制相关信息</p>
						<p>钱包中至少要有0.001BTC，这样才能公开显示您的交易信息</p>
						<p>每笔完成的交易均会消耗广告主0.1%的总交易金额</p>
					</div>
				</div>	*/}
			</div>
		)

	}
}

export default Form.create(options)(DealForm);