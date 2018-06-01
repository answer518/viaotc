import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { formatPhone } from 'utils/util';
import ajax from 'utils/request';

class SecureSetting extends Component {

	static displayName = 'SecureSetting';

	constructor(props){
		super(props);
		this.state = {
			security_info: {}
		};
	};

	static propTypes = {

	};

	componentDidMount(){
		this.getSecureSetting();
	}

	getSecureSetting(){
		ajax.get('/api/security/info')
			.then((response) => {
				const { error, data } = response;
				this.setState({
					security_info: data || {}
				})
			})
	}

	render(){
		const { password=false, phone=false, email=false, ga_status=false, funds_password=false } = this.state.security_info;

		return (
			<div className="order-info-content">
				<div className="order-info-content-head">
					<h1>安全设置</h1>
				</div>
				<div className="order-info-content-body setting-list">
					<div className="setting-list-item">
						<div className="setting-title">
							<div className="setting-icon login-password"></div>
							<span>登录密码</span>
						</div>
						<div className="setting-detail">账号登录使用</div>
						<div className="setting-status">{password && '已设置'}</div>
						<div className="setting-operate">
							{/*password ? <Link>修改</Link> : <Link>设置</Link>*/}
						</div>												
					</div>	
					<div className="setting-list-item">
						<div className="setting-title">
							<div className="setting-icon phone"></div>
							<span>手机</span>
						</div>
						<div className="setting-detail">找回密码、修改安全设置、提现验证</div>
						<div className="setting-status">{phone ? formatPhone(window.OTC.phone || '') : null}</div>
						<div className="setting-operate"></div>												
					</div>
					{/*<div className="setting-list-item">
						<div className="setting-title">
							<div className="setting-icon"></div>
							<span>邮箱</span>
						</div>
						<div className="setting-detail">接收平台消息、工单回执</div>
						<div className="setting-status"></div>
						<div className="setting-operate"></div>												
					</div>*/}
					<div className="setting-list-item">
						<div className="setting-title">
							<div className="setting-icon gmail"></div>
							<span>谷歌双重验证</span>
						</div>
						<div className="setting-detail">找回密码、修改安全设置、提现验证</div>
						<div className="setting-status">{ga_status ? '已设置': '未设置'}</div>
						<div className="setting-operate">
							{!ga_status && <Link to="/app/userCenter/settingGa">设置</Link>}
						</div>												
					</div>
					<div className="setting-list-item">
						<div className="setting-title">
							<div className="setting-icon fund-password"></div>
							<span>资金密码</span>
						</div>
						<div className="setting-detail">发布交易信息、放行资产、提现验证</div>
						<div className="setting-status">{funds_password ? '已设置': '未设置' }</div>
						<div className="setting-operate">
							{funds_password ? <Link to="/app/userCenter/resetFundPassword">修改</Link> : <Link to="/app/userCenter/fundPassword">设置</Link>}
						</div>												
					</div>																													
				</div>
			</div>	
		)
		
	}
}

export default SecureSetting