import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SettingFundForm from './component/SettingFundForm';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class ResetFundsPassword extends Component {

	static displayName = 'ResetFundsPassword';

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
						<h1>重设资金密码</h1>
						<p>重设资金密码后，24小时禁止提现</p>
					</div>
				</div>
				<div className="usercenter-form-body form-wrap">
					<SettingFundForm 
						ga_status={ga_status}
						onSuccess={this.handleSuccess}
						isFundReset={true}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetFundsPassword);