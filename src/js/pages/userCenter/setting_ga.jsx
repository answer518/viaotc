import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SettingGaForm from './component/SettingGaForm';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class SettingGa extends Component {

	static displayName = 'SettingGa';

	constructor(props){
		super(props);
		this.handleSuccess = this.handleSuccess.bind(this);
	}

	handleSuccess(){
		this.props.actions.updateGaStatus('1');
	}

	render(){

		return (
			<div className="usercenter-form-container clearfix">
				<div className="usercenter-form-title">
					<div className="title-img fund-img"></div>
					<div className="title-info">
						<h1>设置谷歌双重验证</h1>
						<p>更加严密的保证您的资金安全</p>
					</div>
				</div>
				<div className="usercenter-form-body form-wrap">
					<SettingGaForm 
						onSuccess={this.handleSuccess}
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingGa);