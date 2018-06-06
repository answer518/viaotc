import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import ajax from 'utils/request';

class DealIdentifiy extends Component {

	static displayName = 'DealIdentifiy';

	constructor(props){
		super(props);

		this.state = {
			identityStatus: 0
		};
	}

	componentDidMount() {
		//this.getAuthInfo();
	}

	getAuthInfo(){
		ajax.get('/api/pc/security/info')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({identityStatus: data.auth_status, payStatus: data.pay, funds_password_status: data.funds_password})
				}
			})
	}

	renderAuthStatus(){
		const { auth_status='' } = this.props.globalState;
		switch(String(auth_status)) {
			case '-1':
				return <Link to="/app/userCenter/identityAuth">认证</Link>
			break;	
			case '0':
				return <span className="text">待审核</span>
			break;	
			case '1':
				return <span className="success">已认证</span>
			break;
			case '2':
				return <Link to="/app/userCenter/identityAuth">审核拒绝。重新认证</Link>
			break;
			default: return ''	
		}
	} 

	render(){
		const { funds_password_status, auth_status, pay_status } = this.props.globalState;
		// type = 2代表购买提币
		const type = this.props.location.query.type;

		return (
			<div className="user-center-content">
				<div className="user-center-content-head">
					请先完成以下设置
				</div>
				<div className="user-center-content-body">
					{
						auth_status != 1 && 
						<div className="user-center-content-item">
							<div className="icon inline-middle user-identity"></div>
							<div className="info inline-middle">
								<h1>身份认证</h1>
								<h2>全平台交易用户真实认证</h2>
							</div>
							<div className="operation">
								{this.renderAuthStatus()}
							</div>
						</div>
					} 
					{/*<div className="user-center-content-item">
						<div className="icon inline-middle"></div>
						<div className="info inline-middle">
							<h1>账户充值</h1>
							<h2>接收平台消息、工单回执</h2>
						</div>
						<div className="operation">
							<Link to="/app/assetManage">充值</Link> 
						</div>
					</div>*/}
					{	
						funds_password_status != 1 && 
						<div className="user-center-content-item">
							<div className="icon inline-middle  fund-password"></div>
							<div className="info inline-middle">
								<h1>资金密码</h1>
								<h2>发布交易信息、放行资产、提现验证</h2>
							</div>
							<div className="operation">
								<Link to="/app/userCenter/fundPassword">设置</Link>
							</div>
						</div>
					}
					{
						type !== '2' && pay_status !== true && 
						<div className="user-center-content-item">
							<div className="icon inline-middle  pay-method"></div>
							<div className="info inline-middle">
								<h1>支付方式</h1>
								<h2>收款信息</h2>
							</div>
							<div className="operation">
								<Link to="/app/userCenter/myPayment">设置</Link>
							</div>
						</div>
					}									
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

export default connect(mapStateToProps, mapDispatchToProps)(DealIdentifiy);