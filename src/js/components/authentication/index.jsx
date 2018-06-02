import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import ajax from 'utils/request';

function requireAuthentication(Component) {
    // 直接返回 (防止从新渲染)
    if (Component.AuthenticatedComponent) {
    	return Component.AuthenticatedComponent
    }

    class AuthenticatedComponent extends Component {

		static displayName = 'AuthenticatedComponent';

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
					交易前请完成以下内容
					</div>
					<div className="user-center-content-body">
						{identityStatus != 1 && <div className="user-center-content-item">
							<div className="icon inline-middle user-identity"></div>
							<div className="info inline-middle">
								<h1>身份认证</h1>
								<h2>全平台交易用户真实认证</h2>
							</div>
							<div className="operation">
								<Link to="/app/userCenter/identityAuth">去认证</Link>
							</div>
						</div>} 
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
						{funds_password_status != 1 && <div className="user-center-content-item">
							<div className="icon inline-middle  fund-password"></div>
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

	Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
	return Component.AuthenticatedComponent;
}

