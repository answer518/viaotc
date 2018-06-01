import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SettingFundForm from './component/SettingFundForm';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class SetFundsPassword extends Component {

	static displayName = 'SetFundsPassword';

	constructor(props){
		super(props);
		this.handleSuccess = this.handleSuccess.bind(this);
	}

	handleSuccess(){
		this.props.actions.updateFundPassword('1');
	}

	render(){
		const { ga_status } = this.props.globalState;
		
		return (
			<div className="usercenter-form-container clearfix">
				<div className="usercenter-form-title">
					<div className="title-img fund-img"></div>
					<div className="title-info">
						<h1>设置资金密码</h1>
						<p>资金密码将在提现时与其他验证方式</p>
						<p>同时使用，请勿泄露给他人！</p>
					</div>
				</div>
				<div className="usercenter-form-body form-wrap">
					<SettingFundForm 
						onSuccess={this.handleSuccess}
						ga_status={ga_status}
					/>
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

export default connect(mapStateToProps, mapDispatchToProps)(SetFundsPassword);