import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IdentityAuthForm from './component/IdentityAuthForm';
import { browserHistory } from 'react-router';
import { keys } from 'lodash';
import { getErrorMsg } from 'utils/util';
import ajax from 'utils/request';

class IdentityAuth extends Component { 

	static displayName = 'IdentityAuth';

	constructor(props){
		super(props);
		this.state = {
			fields: {
				country: {
					value: 'china'
				},
				realname: {
					value: ''
				},
				card_type: {
					value: 'identity_card'
				},
				card_number: {
					value: ''
				},
				validity_start_year: {
					value: ''
				},
				validity_start_month: {
					value: ''
				},
				validity_start_date: {
					value: ''
				},
				validity_end_year: {
					value: ''
				},
				validity_end_month: {
					value: ''
				},
				validity_end_date: {
					value: ''
				},				
				card_front: {
					value: ''
				},
				card_back: {
					value: ''
				},
				card_front_hand: {
					value: ''
				}
			},
			auth_res: '',
			timeStamp: Date.now(),
			error: ''
		};
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	static propTypes = {

	};

	componentDidMount(){
		this.getAuthInfo();
	}

	handleFormChange(changedFields){
	    this.setState({
	      fields: { ...this.state.fields, ...changedFields }
	    });		
	}

	getAuthInfo(){
		ajax.get('/api/pc/auth/authinfo')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					if (data.authinfo.status == 0 || data.authinfo.status == 1) {
						browserHistory.push('/app/userCenter/identityInfo');
						return;
					};
					if (data.authinfo.status == -1) return;
					const { validity_end='', validity_start='', auth_res } = data.authinfo;
					const filedKeys = keys(this.state.fields);
					let newFields = {};

					filedKeys.forEach((filedKey) => {
						if (data.authinfo[filedKey] !== undefined){
							newFields[filedKey] = {
								value: data.authinfo[filedKey] 
							}
						}
					});

					this.setState({fields: {...newFields,
						validity_start_year: {value: validity_start.slice(0, 4)},
						validity_start_month: {value: validity_start.slice(4, 6)},
						validity_start_date: {value: validity_start.slice(6, 8)},
						validity_end_year: {value: validity_end.slice(0, 4)},
						validity_end_month: {value: validity_end.slice(4, 6)},
						validity_end_date: {value: validity_end.slice(6, 8)}						
					}, auth_res});
				}
			})
	}

	checkCardDate(start, end){
		const startDate = new Date([start.slice(0, 4), start.slice(4, 6), start.slice(6, 8)].join('-'));
		const endDate = new Date([end.slice(0, 4), end.slice(4, 6), end.slice(6, 8)].join('-'));

		return endDate > startDate;
	}

	handleSubmit(param){
		const { validity_start, validity_end } = param;
		if (!this.checkCardDate(validity_start, validity_end)){
			this.setState({timeStamp: Date.now(), error: '证件有效期错误'});
			return;
		}

		ajax.post('/api/pc/auth/set_authinfo', param)
			.then((response) => {
				const { error, msg } = response;
				if (error == 0){
					browserHistory.push('/app/userCenter/identityInfo');
				} else {
					const errorMsg = getErrorMsg(msg);
					this.setState({timeStamp: Date.now(), error: errorMsg});
				}
			})
	}

	render(){
		const { fields, auth_res, timeStamp, error } = this.state;

		return (
			<div className="identity-auth-content">
				<div className="identity-auth-head">
					<h1 className="inline">身份认证</h1>
					<span className="explain">身份认证用于处理纠纷及账户核对，请填写您的真实信息，认证通过后不可修改</span>
				</div>
				{auth_res && <div className="unpass-reason">
					<label>认证未通过：</label>
					<span className="reason-detail">{auth_res}</span>
				</div>}
				<IdentityAuthForm 
					{...fields} 
					onChange={this.handleFormChange}
					onSubmit={this.handleSubmit}
					timeStamp={timeStamp}
					error={error}
				/>
			</div>
		)
		
	}
}

export default IdentityAuth