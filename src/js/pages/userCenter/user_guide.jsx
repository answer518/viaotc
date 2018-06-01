import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';
import ajax from 'utils/request';

class UserGuide extends Component {

	static displayName = 'UserGuide';

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
		ajax.get('/api/auth/authinfo')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({identityStatus: data.authinfo.status})
				}
			})
	}		

	render(){
		const { funds_password_status, ga_status } = this.props.globalState;
		const { identityStatus } = this.state;

		return (
			<div className="user-center-content">
				<div className="user-center-content-head">
				新手引导
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
					{ga_status != 1 && <div className="user-center-content-item">
						<div className="icon inline-middle"></div>
						<div className="info inline-middle">
							<h1>谷歌双重验证</h1>
							<h2>安全性高于手机短信！<span style={{color: '#ff8932'}}>推荐使用</span></h2>
						</div>
						<div className="operation"> 
							<Link to="/app/userCenter/settingGa">设置</Link>
						</div>
					</div>}
					{funds_password_status != 1 && <div className="user-center-content-item">
						<div className="icon inline-middle"></div>
						<div className="info inline-middle">
							<h1>资金密码</h1>
							<h2>保障账户资产安全，推荐提前设置</h2>
						</div>
						<div className="operation">
							<Link to="/app/userCenter/fundPassword">设置</Link>
						</div>
					</div>}		
					<div className="user-center-content-item">
						<div className="icon inline-middle bank-card"></div>
						<div className="info inline-middle">
							<h1>账户充值</h1>
							<h2>发布出售交易</h2>
						</div>
						<div className="operation">
							<Link to="/app/assetManage">充值</Link>  
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

export default connect(mapStateToProps, mapDispatchToProps)(UserGuide);