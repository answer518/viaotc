import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from 'antd';
import { Link } from 'react-router';
import { isEqual, isEmpty, isNaN } from 'lodash';
import DealInfoForm from './DealInfoForm';
import { browserHistory } from 'react-router';
import ajax from 'utils/request';
import { payMethodMap } from 'utils/util';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class DealInfoDetailBlock extends Component {

	static displayName = 'DealInfoDetailBlock'; 

	constructor(props){
		super(props);
		this.state = {
			coin_price: 0,
			sellable: 0,
			identityStatus: 0,
			fields: {
				amount: {
					value: ''
				},
				sum: {
					value: ''
				}
			},
			realname: '',
			pay_info: []
		};
		this.getCoinPrice = this.getCoinPrice.bind(this);
		this.getBalanceDetail = this.getBalanceDetail.bind(this);
		this.getPayInfo = this.getPayInfo.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.timer = null;
	};

	static propTypes = {

	};

	static contextTypes = {
		is_logged:PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	};	

	componentDidMount(){
		const { is_fixed_price, info } = this.props;
		this.getAuthInfo();
		if (is_fixed_price || !info.coin_type) return;
		this.getCoinPrice(info.coin_type, info);
		this.getBalanceDetail(info.coin_type);
		this.getPayInfo();
		this.getUserInfo();
	}

	componentWillReceiveProps(nextProps){
		if ((nextProps.info && (this.props.coin_type !== nextProps.info.coin_type)) 
			||(nextProps.ad_id && (nextProps.ad_id !== this.props.ad_id))){
			this.setState({
				fields: {
					amount: {
						value: ''
					},
					sum: {
						value: ''
					}
				}
			});
			this.getCoinPrice(nextProps.info.coin_type, nextProps.info);
			this.getBalanceDetail(nextProps.info.coin_type);
			this.getPayInfo();
		}
	}

	componentWillUnmount(){
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	getAuthInfo(){
		ajax.get('/api/pc/auth/authinfo')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({identityStatus: data.authinfo.status})
				}
			})
	}			

	handleFormChange(changedFields){	
		const { coin_price, fields } = this.state;
		const { is_fixed_price, price=0 } = this.props.info;
		const finalPrice = is_fixed_price == 0 ? coin_price : price;	

		if ('amount' in changedFields){
			const amount = changedFields.amount.value;
			if (isNaN(Number(amount))) {
				this.setState({ 
					fields: {...changedFields, sum: {value: ''}}
				});
				return;
			}
			if (amount == fields.amount.value) return;
			this.setState({
				fields: {...changedFields, sum: {value: (amount * finalPrice).toFixed(2)}}
			});
		} 

		if ('sum' in changedFields) { 
			const sum = changedFields.sum.value;
			if (sum == fields.sum.value) return; 
		    this.setState({
		      fields: { ...changedFields, amount: {value: finalPrice == 0 ? '' : (sum / finalPrice).toFixed(6)} },
		    });		
		}
	}

	getBalanceDetail(coin_type){//获取资产详情
		ajax.get('/api/pc/balance/detail', {coin_type, type: 'sellable'})
			.then((response) => {
				const { error, data } = response;
				if (isEmpty(data)) return;
				this.setState({sellable: data.usable})
			})
	}

	getCoinPrice(coin_type, info){
		const { min_amount, max_amount, is_fixed_price } = info;
		const infoPrice = info.price;

		ajax.get('/api/pc/market/coin_price',{coin_type})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const finalPrice = is_fixed_price == 1 ? infoPrice : data.price; 
					if (min_amount > 0 && (min_amount == max_amount)){
						const newFields = {
							amount: {
								value: min_amount 
							}, 
							sum: {
								value: (min_amount * finalPrice).toFixed(2)
							}
						};
						this.setState({fields: {...newFields}, coin_price: data.price});
					} else {
						this.setState({coin_price: data.price, fields: {
							amount: {
								value: ''
							},
							sum: {
								value: ''
							}
						}});
					}					
				}
			});
	}

	getPayInfo(){
        ajax.get('/api/pc/pay/get_pay_infos').then((response) => {
            const { code, data } = response;
            if (code == 0){
                this.setState({pay_info: data})
            }
        })
    }

    getUserInfo(){
        ajax.get('/api/pc/user/info').then((response) => {
            const { error, data } = response;
            if (error == 0){
                const { realname } = data.userinfo;
                this.setState({realname});
            }
        })
        
    }

	toLogin(){
		browserHistory.push('/app/entrance/login');
	}

	renderPayInfo () {
		const { pay_method = [], pay_info = null } = this.props.info;

		if (pay_info == null) {
			return (
				<div className="inline-middle">{pay_method.join('/')}</div>
			)
		} else {
			return (
				<div className="pay-info-block">
					{pay_info.map((pay, i) => {
						if (pay.pay_method === 'alipay') {
							return <div className="pay-info-section pay-info-alipay" key={i}>
								<span>{pay.pay_info.pay_name} {pay.realname} {pay.pay_info.account}</span>
								<Popover content={<img src={pay.pay_info.qrcode} />} title="收款二维码">
									<span className={`pay-info-qrcode pay-info-qrcode-${pay.pay_method}`}></span>
								</Popover>
							</div>
						} else if (pay.pay_method === 'weixin') {
							return <div className="pay-info-section pay-info-weixin" key={i}>
								<span>{pay.pay_info.pay_name} {pay.realname} {pay.pay_info.account}</span>
								<Popover content={<img src={pay.pay_info.qrcode} />} title="收款二维码">
									<span className='pay-info-qrcode pay-info-qrcode-weixin'></span>
								</Popover>
							</div>
						} else {
							return <div className="pay-info-section pay-info-bank" key={i}>
								<span>{pay.pay_info.pay_name} {pay.realname} {pay.pay_info.bank_account} {pay.pay_info.account_branch} {pay.pay_info.bank_card_num}</span>
							</div>
						}
					})}
				</div>
			)
		}
	}

	render(){
		const { type, info, ad_id, globalState } = this.props;
		const { coin_price, fields, sellable, pay_info, realname } = this.state;
		const { funds_password_status, auth_status } = globalState;
		const { coin_type='', price='', currency='', pay_method=[], min_amount='', max_amount='', expect_period='', is_fixed_price, user_id='' } = info;
		const finalPrice = is_fixed_price == 0 ? coin_price : price;
		const coinType = coin_type.toUpperCase();

		const usablePayInfo = pay_info.filter(item => {
        	return pay_method.indexOf(item.pay_name) > -1
        })

		const { is_logged } = this.context;

		return (
			<div className="deal-info-detail-block">
				 <div className="deal-info-detail-head">
				 	<h1>交易详情</h1>
				 </div>
				 <div className="deal-info-detal-content">
				 	<div className="deal-info-detals">
				 			<div className="deal-info-detal-item">
				 				<label>购买币种：</label>
				 				<div className="inline-middle">{coinType}</div>
				 			</div>
				 			<div className="deal-info-detal-item">
				 				<label>{`${is_fixed_price == 0 ? '浮动' : '固定'}价格`}：</label>
				 				<div className="inline-middle">{`${finalPrice} ${currency}`}</div>
				 			</div>
				 			{ (type == 'buy' || (type == 'sell' && window.OTC.id == user_id)) &&
				 			<div className="deal-info-detal-item">
				 				<label>付款方式：</label> 
				 				{this.renderPayInfo()}
				 			</div>
				 			}
				 			<div className="deal-info-detal-item">
				 				<label>交易限额：</label>
				 				<div className="inline-middle">{`${min_amount}-${max_amount} ${coinType}`}</div>
				 			</div>
				 			<div className="deal-info-detal-item">
				 				<label>付款期限：</label>
				 				<div className="inline-middle">{`${expect_period}分钟`}</div>
				 			</div>	
				 	</div>
				 	{(window.OTC.id != user_id) && <div className="deal-info-operate clearfix" style={{marginBottom: is_logged == 1 ? '5px' : '40px'}}>
				 		{is_logged == 1 ?
					 		<DealInfoForm 
					 			type={type} 
					 			coin_type={coin_type}
					 			currency={currency}
					 			fields={fields}
					 			sellable={sellable} 
					 			pay_info={usablePayInfo}
					 			realname={realname}
					 			ad_id={ad_id}
					 			onChange={this.handleFormChange}
					 			min_amount={min_amount}
					 			max_amount={max_amount}
					 			auth_status={auth_status}
					 			funds_password_status={funds_password_status}
					 		/>:
					 		<Button 
					 			type="primary" 
					 			className="form-btn"
					 			onClick={this.toLogin}
					 		>登录</Button>
				 		}
				 	</div>}
				 	<div className="deal-info-detal-tips">
				 		<h1>交易须知：</h1>
				 		<div className="deal-info-detal-tips-content">
			 				<div className="deal-info-detal-tips-item">
			 					坚守契约精神：交易双方出售/购买以约定价格确认交易后，平台将保护双方的合法权益，不会随币价在交易确认后的变化作为申述依据。举例：出售数字资产方在购买者按设置价格付款后，币价在购买者确认交易后发生上涨，出售者以此作为不予放行的依据，平台将不予支持。
			 				</div>	
			 				<div className="deal-info-detal-tips-item">
			 					在您发起交易后，数字货币被冻结，受到Bitdad的保护。如果您是买家，发起交易请求后，您应在要求的时间内付款并把交易标记为付款已完成。卖家在收到付款后将会放行处于托管中的数字货币。
			 				</div>	
			 				<div className="deal-info-detal-tips-item">					
								交易前请阅读《Bitdad网络服务条款》以及常见问题、交易指南等帮助文档。
			 				</div>		
			 				<div className="deal-info-detal-tips-item">
			 					申述保护网上交易的买卖双方。在发生争议的情况下，我们将平复所提供的的所有信息，并将托管的数字货币放行给其合法所有者
			 				</div>		 					 							 							 			
				 		</div>
				 	</div>
				 </div>
			</div>
		)
		
	}
}


function mapStateToProps(state) {
  return {globalState: state}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(globalAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(DealInfoDetailBlock);