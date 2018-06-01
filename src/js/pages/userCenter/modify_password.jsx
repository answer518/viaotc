import React, { Component, PropTypes } from 'react';
import ModifyLoginForm from './component/ModifyLoginForm';

class ModifyPassword extends Component {

	static displayName = 'ModifyPassword';

	constructor(props){
		super(props)
	};

	static propTypes = {

	};

	render(){

		return (
			<div className="usercenter-form-container clearfix">
				<div className="usercenter-form-title">
					<div className="title-img"></div>
					<div className="title-info">
						<h1>修改登录密码</h1>
						<p>资金密码将在提现时与其他验证方式</p>
						<p>同时使用，请勿泄露给他人！</p>
					</div>
				</div>
				<div className="usercenter-form-body form-wrap">
					<ModifyLoginForm />
				</div>
			</div>
		)
		
	}
}

export default ModifyPassword