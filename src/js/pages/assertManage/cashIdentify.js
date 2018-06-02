import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ajax from 'utils/request';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class CashOutIdentifiy extends Component {

	static displayName = 'CashOutIdentifiy';

	constructor(props){
		super(props);
		this.state = {
			identityStatus: 0
		};		
	}

	componentDidMount(){
		this.getAuthInfo();
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

	render(){
		const { funds_password_status } = this.props.globalState;
		const { identityStatus } = this.state;		

		return (
			<div className="user-center-content">
				<div className="user-center-content-head">
					请完成以下设置
				</div>
				<div className="user-center-content-body">
					{identityStatus != 1 && <div className="user-center-content-item">
						<div className="icon inline-middle identity"></div>
						<div className="info inline-middle">
							<h1>身份认证</h1>
							<h2>全平台交易用户真实认证</h2>
						</div>
						<div className="operation">
							<Link to="/app/userCenter/identityAuth">去认证</Link>
						</div>						
					</div>}
					{funds_password_status != 1 && <div className="user-center-content-item">
						<div className="icon inline-middle fund-img"></div>
						<div className="info inline-middle">
							<h1>资金密码</h1>
							<h2>发布交易信息、放行资产、提现验证</h2>
						</div>
						<div className="operation">
							<Link to="/app/userCenter/fundPassword">设置</Link>
						</div>
					</div>}
				</div>
			</div>
		)

	}
}

function mapStateToProps(state) {
  return { globalState: state }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(globalAction, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(CashOutIdentifiy);
