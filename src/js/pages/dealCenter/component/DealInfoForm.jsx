import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button, Modal } from 'antd';
import { browserHistory } from 'react-router';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';
import { isNaN } from 'lodash';

const FormItem = Form.Item;
const options = {

  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {...props.fields};
  }

};

class DealInfoForm extends Component {

	static displayName = 'DealInfoForm';

	constructor(props){
		super(props);
		this.state = {
			reverse: false,
			error: ''
		};
		this.handleReverse = this.handleReverse.bind(this);
		this.checkAmountNumber = this.checkAmountNumber.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.checkAmountRange = this.checkAmountRange.bind(this);
		this.timer = null;
	};

	static propTypes = {
		type: PropTypes.string
	};

	static defaultProps = {
		type: 'buy'
	}

	handleReverse(){
		this.setState((prev) => {
			return {reverse: !prev.reverse}
		})
	}

	generateReverse(type){
		return (<div key={`${type}-reverse`} onClick={this.handleReverse} className="fl reverse-btn"></div>);
	}

	checkAmountRange(rule, value, callback) {
		const { min_amount, max_amount } = this.props;
		const numberValue = Number(value);
		
		if (value < min_amount || value > max_amount){
			callback('交易限额输入有误');
		}
		callback();
	}

	checkAmountNumber(rule, value, callback){
		const { sellable, coin_type } = this.props;
		if (value > sellable){
			//callback(`您的资产出售上限不能超过${sellable}${coin_type.toUpperCase()}`);
			callback('您当前的可用资产不足');
		}
		callback();
	}

	checkIsNumber(rule, value, callback){
		const number = Number(value);
		if (isNaN(Number(value))){
			callback('请输入数字');
		} else if (!(number > 0)){
			callback('请输入大于0的数字'); 
		}
		callback();
	}

	handleSubmit(e){
		const { funds_password_status, auth_status } = this.props;
		e.preventDefault();
		
		if (auth_status != 1 || funds_password_status != 1) {
			browserHistory.push({
				pathname : '/app/userCenter/dealIdentifiy',
				query: {
		          	type: '2'
		        }
			})
		} else {
			this.props.form.validateFields((err, values) => {
				if (!err){
					const { ad_id, type } = this.props;
					if(!ad_id) return;
					const { amount } = values;
					ajax.post('/api/pc/orders/create', {amount, ad_id})
						.then((response) => {
							const { error, data, msg='' } = response;
							if (error == 0){
								browserHistory.push({pathname: `/app/dealCenter/deal/${type}`, query:{order_id: data.order_id}});						
							} else {
								if(this.timer) {clearTimeout(this.timer)}
								const errorMsg = getErrorMsg(msg);
								this.setState({error: errorMsg});
								this.timer = setTimeout(() => {
									this.setState({error: ''});
								}, 600);							
							}
						});
				}
			});
		}
	}

	renderSellForm() {
		const { coin_type='', currency, min_amount, max_amount, form } = this.props;
		const { getFieldDecorator } = form;
		const { reverse } = this.state;

		const disabled = !!(min_amount && max_amount) && (min_amount == max_amount);

		const items =  [(<div className="fl from-item inline-form-item" key="sell-number">
					<FormItem>
						<div className="label">出售数量</div>
						{
							getFieldDecorator('amount', {
								validateFirst: true,
								rules: [
									{required: true, message: '请输入出售数量'},
									this.checkIsNumber,
									this.checkAmountNumber,
									this.checkAmountRange
								]
							})(
								<Input placeholder="请输入您要出售的数量" disabled={disabled}/>
							) 
						}
						<div className="unit">{coin_type.toUpperCase()}</div>
					</FormItem>
				</div>), 
			this.generateReverse('sell'), 
			(<div className="fl from-item inline-form-item" key="sell-money">
					<FormItem>
						<div className="label">获得金额</div>
						{
							getFieldDecorator('sum', {
								validateFirst: true,
								rules: [
									{required: true, message: '请输入您要出售的金额'},
									this.checkIsNumber
								]
							})(
								<Input placeholder="请输入您要出售的金额" disabled={disabled}/>
							)
						}
						<div className="unit">{currency}</div>
					</FormItem>
				</div>)];

		return reverse ? items.reverse() : items;
	}

	renderBuyForm(){
		const { coin_type='', currency, min_amount, max_amount, form } = this.props;
		const { getFieldDecorator } = form;
		const { reverse } = this.state;

		const disabled = !!(min_amount && max_amount) && (min_amount == max_amount);

		const items =  [(<div className="fl from-item inline-form-item" key="buy-number">
					<FormItem>
						<div className="label">购买数量</div>
						{
							getFieldDecorator('amount', {
								validateFirst: true,
								rules: [
									{required: true, message: '请输入购买数量'},
									this.checkIsNumber,
									this.checkAmountRange
								]								
							})(
								<Input placeholder="请输入您要购买的数量" disabled={disabled}/>
							) 
						}
						<div className="unit">{coin_type.toUpperCase()}</div>
					</FormItem>
				</div>), 
			this.generateReverse('buy'), 
			(<div className="fl from-item inline-form-item" key="buy-money">
					<FormItem>
						<div className="label">应付金额</div>
						{
							getFieldDecorator('sum', {
								validateFirst: true,
								rules: [
									{required: true, message: '请输入应付金额'},
									this.checkIsNumber
								]									
							})(
								<Input placeholder="请输入您应付的金额" disabled={disabled}/>
							)
						}
						<div className="unit">{currency}</div>
					</FormItem>
				</div>)];

		return reverse ? items.reverse() : items;		
	}

	render(){
		const { type } = this.props;
		const { error } = this.state; 
	
		return (
			<div className="inline-form deal-info-form clearfix">
				{type === 'buy' && <div className="clearfix">
					{this.renderBuyForm()}
					<div className="fl inline-form-item" style={{margin: '32px 0 0 20px'}}>
						<Button type="primary" onClick={this.handleSubmit}>买入</Button>
						{error && <div className="deal-error-tip">{error}</div>}
					</div>
				</div>}
				{type === 'sell' && <div className="clearfix">
					{this.renderSellForm()}		
					<div className="fl inline-form-item" style={{margin: '32px 0 0 20px'}}>
						<Button className="sell" onClick={this.handleSubmit}>出售</Button>
						{error && <div className="deal-error-tip">{error}</div>}
					</div>									
				</div>}					
			</div>
		)
		
	}
}

export default Form.create(options)(DealInfoForm)