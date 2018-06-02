import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Modal, message } from 'antd';
import FundPasswordForm from './FundPasswordForm';
import AppealForm from 'pages/component/AppealForm';
import UnfreezeForm from 'pages/component/UnfreezeForm';
import CancelDealModal from './CancelDealModal';
import ajax from 'utils/request';
import { dealStatus } from 'utils/util';
import { isNil } from 'lodash';

class DealOrderInfo extends Component {

	static displayName = 'DealOrderInfo';

	constructor(props){
		super(props);
		this.state = {
			order: {},
			cancelVisible: false,
			payVisible: false,
			receiptVisible: false,
			appealVisible: false,
			expect_period_time: 60
		};
		//cancel
		this.showCancelDeal = this.showCancelDeal.bind(this);
		this.dealCancelOk = this.dealCancelOk.bind(this);
		this.hideDealCancel = this.hideDealCancel.bind(this);
		//付款
		this.showPayDeal = this.showPayDeal.bind(this);
		this.dealPayCancel = this.dealPayCancel.bind(this);
		this.dealPayOk = this.dealPayOk.bind(this);
		//收款
		this.showReceiptDeal = this.showReceiptDeal.bind(this);
		this.dealReceiptCancel = this.dealReceiptCancel.bind(this);
		this.dealReceiptOk = this.dealReceiptOk.bind(this);		

		//申诉
		this.showAppeal = this.showAppeal.bind(this);
		this.appealCancel = this.appealCancel.bind(this);

		this.timer = null;
		this.startTimer = null;
	};

	static propTypes = {

	};

	componentDidMount(){
		this.getOrderDetail(); 
	}

	componentWillUnmount(){
		if (this.timer) {clearTimeout(this.timer)}
	}

	//deal cancel
	showCancelDeal(){
		this.setState({cancelVisible: true});
	}

	hideDealCancel(){
		this.setState({cancelVisible: false});
	}

	dealCancelOk(){
		this.setState({cancelVisible: false});
	}
	//deal pay
	showPayDeal(){
		this.setState({payVisible: true});
	}

	dealPayCancel(){
		this.setState({payVisible: false});
	}

	dealPayOk(){
		this.setState({payVisible: false, hasPay: true});
		message.success('您已成功确认付款，资产已在平台内托管，请耐心等待卖家放行资产。');
	}

	//deal receipt
	showReceiptDeal(){
		this.setState({receiptVisible: true});
	}

	dealReceiptCancel(){
		this.setState({receiptVisible: false});
	}

	dealReceiptOk(){
		this.setState({receiptVisible: false});
		message.success('您已成功确认收款，资产将放行至买家，ViaOTC祝您交易愉快。');
	}	

	//appeal
	showAppeal(){
		this.setState({appealVisible: true});
	}

	appealCancel(){
		this.setState({appealVisible: false});
	}

	getOrderDetail(){
		const { order_id } = this.props;
		if (!order_id) return;
		if (this.timer) {clearTimeout(this.timer)}
		if (this.startTimer) {clearTimeout(this.startTimer)}	

		ajax.get('/api/orders/detail', {order_id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const { remaining_time } = data.order;
					const expect_period_time = Math.floor(remaining_time/60);
					this.setState({order: data.order, status: data.order.status, expect_period_time}, () => {
						this.startTimer  = setTimeout(() => {
							this.countDownExpectPeriod();
						}, 60000);
					});
				}
			})
	}

	countDownExpectPeriod(){
		if (this.state.expect_period_time < 1){
			if (this.timer) {clearTimeout(this.timer)}
			return;
		}
		this.setState((prev) => {
			const current = (prev.expect_period_time - 1) > 0 ? prev.expect_period_time - 1 : 0;
			return {expect_period_time: current}
		});
		this.timer = setTimeout(() => {
			this.countDownExpectPeriod();
		}, 60000);

	}

	render(){
		const { className, type, order_id, funds_password_status, chatStatus } = this.props;
		const { cancelVisible, payVisible, receiptVisible, appealVisible, expect_period_time } = this.state;
		const { order_num='', coin_type='', coin_price='', currency='', pay_method=[], expect_period='', 
		amount=0, remaining_time='', currency_amount=0, status='' } = this.state.order;

		const color = expect_period_time == 0 ? '#333' : '#1d9e53';
	
		const cls = classNames({
			'deal-order-info': true,
			[className]: className
		});

		const btnsCls = classNames({
			'btns-wrap': true,
			'btns-sell-wrap': type == 'sell'
		});

		const expectPeriod = isNil(expect_period) ? '-' : `${expect_period}分钟`;
		const receiptBtnCls = classNames({
			'receipt-btn': true,
			'disabled': chatStatus != 2
		});

		const payBtnCls = classNames({
			'disabled': chatStatus != 0
		});

		const cancelBtnCls = classNames({
			'disabled': chatStatus != 0
		});

		return (
			<div className={cls}>
				<div className="deal-order-info-head">
					<span>订单编号：{order_num}</span>
					{(chatStatus == 0 || chatStatus == 2) && <span style={{color: '#195cf4', float: 'right', cursor: 'pointer'}} onClick={this.showAppeal}>申诉</span>}
				</div>
				<div className="deal-order-info-body">
					<div className="order-info">
						<div className="order-info-item">
							<label>购买币种：</label>
							<span>{coin_type.toUpperCase()}</span>
						</div>
						<div className="order-info-item">
							<label>
								<span style={{marginRight: '28px'}}>价</span>格：
							</label>
							<span>{`${coin_price} ${currency}`}</span>
						</div>			
						<div className="order-info-item">
							<label>付款方式：</label>
							<span>{pay_method.join('/')}</span>
						</div>	
						<div className="order-info-item">
							<label>交易总额：</label>
							<span>{`${currency_amount} ${currency}`}</span>
						</div>	
						<div className="order-info-item">
							<label>付款期限：</label>
							<span>{expectPeriod}
								{(chatStatus == 0 && expect_period_time > 0) && 
									<span style={{color}}>
										<span style={{margin: '0 5px'}}>/</span>
										<span>{expect_period_time}分钟</span>
									</span>
								}
							</span>
						</div>																							
					</div>
					<div className="order-amount">
						<div className="order-info-item">
							<label>购买数量：</label>
							<span>{`${amount} ${coin_type.toUpperCase()}`}</span>
						</div>	
						<div className="order-info-item">
							<label>付款金额：</label>
							<span>{`${currency_amount} ${currency}`}</span>
						</div>	
						<div className="order-info-item">
							<label>交易状态：</label>
							<span style={{fontSize: '14px', color: '#002aff'}}>{dealStatus[chatStatus]}</span>
						</div>	
					</div>
					<div className="order-operate">
						{
							type == 'sell' ? 
							<div className={btnsCls}>
									<Button 
										type="primary" 
										style={{marginRight: '18px'}}
										className={receiptBtnCls}
										onClick={this.showReceiptDeal} 
										disabled={chatStatus != 2}
									>
										确认已收款
									</Button> 											
							</div> : 
							<div className={btnsCls}>
									<Button 
										type="primary" 
										style={{marginRight: '18px'}}
										className={payBtnCls}
										onClick={this.showPayDeal}
										disabled={chatStatus != 0}
									>
										确认已付款
									</Button>		
									<Button 
										onClick={this.showCancelDeal} 
										disabled={chatStatus != 0}
										className={cancelBtnCls}
									>取消交易</Button>																							
							</div>
						}
						{type == 'sell' && <div className="order-opreate-tip">
							<p>请在买家付款完成后，点击<span style={{color: '#3665ff'}}>“付款完成”</span></p>
							<p>平台在您确认付款后，通知卖家放行BTC</p>
						</div>}					
					</div>
				</div>
				<Modal 
					title="确认取消"
					width={600}
					visible={cancelVisible}
					onCancel={this.hideDealCancel}
					className="deal-modal"
					footer={null}
				>	
					{cancelVisible && <CancelDealModal 
						order_id={order_id}
						onSuccess={this.dealCancelOk}
					/>}
				</Modal>
				<Modal
					title="付款确认"
					width={800}
					visible={payVisible}
					className="deal-modal" 
					onCancel={this.dealPayCancel}
					footer={null}				
				>
					{payVisible && <div className="deal-tip deal-pay-tip">
						<div className="pay-safe-blue tip-icon"></div>
						<h4>您确认付款后，我们将通知卖家确认收款，卖家确认收款后</h4>
						<h4>我们会将BTC放行至您的账户。</h4>
						<div className="notice">
							<div className="inline warn"></div>
							<span>未付款情况下，确认已付款将被视为恶意欺诈，您的账户将被锁定</span>
						</div>
						<FundPasswordForm 
							text="确认已付款"
							url="/api/orders/confirm_payed"
							param={{order_id}}
							onSuccess={this.dealPayOk}
							style={{paddingLeft: '140px'}}
						/>
					</div>}
				</Modal>
				<Modal
					title="收款确认"
					width={800}
					visible={receiptVisible}
					className="deal-modal"
					footer={null}
					onCancel={this.dealReceiptCancel}			
				>
					{receiptVisible &&<div><div className="deal-tip deal-pay-tip">
						<div className="pay-safe-green tip-icon"></div>
						<h4>请您确认是否已收到款项，确认收款后，我们将放行您的数字资产。</h4>
						<div className="notice">
							<div className="inline warn"></div>
							<span>确认收款以您个人账户收到款项为准，对方付款截图无法表明您已收到款项。</span>
						</div>
					</div>
					<UnfreezeForm 
						text="确认已收款"
						url="/api/orders/unfreeze"
						param={{order_id}}						
						onSuccess={this.dealReceiptOk}
						style={{paddingLeft: '140px'}}
						funds_password_status={funds_password_status}
					/>
					</div>}
				</Modal>
				<Modal
					title="申诉说明"
					width={580}
					visible={appealVisible}
					className="deal-modal deal-appeal-modal"
					onCancel={this.appealCancel}
					footer={null}
				>
					{appealVisible && <AppealForm 
						url="/api/appeal/do_appeal"
						action="/api/appeal/upload_img"
						order_id={order_id}
						onSuccess={this.appealCancel}
					/>}
				</Modal>				
			</div>
		)
		
	}
}

export default DealOrderInfo