import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DealForm from './component/DealForm';
import { Modal } from 'antd';
import { browserHistory } from 'react-router';
import ajax from 'utils/request';
import { getErrorMsg } from 'utils/util';
import MD5 from 'md5';
import FormButton from 'pages/component/FormButton';
import { keys } from 'lodash';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class DealCenterPublishBuy extends Component {

	static displayName = 'DealCenterPublishBuy';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: '',
			identityStatus: 0,			
			fields: {
				coin_type: {
					value: 'btc'
				},
				currency: {
					value: 'CNY'
				},
				pay_method: {
					value: ["alipay"]
				},
				is_fixed_price: {
					value: '1'
				},
				premium: {
					value: '2'
				},
				ranges: {
					value: []
				},
				price: {
					value: ''
				},
				expect_period: {
					value: '60'
				},
				funds_password: {
					value: ''
				}
			}
		};
		this.handleAdPost = this.handleAdPost.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.publishAd = this.publishAd.bind(this);				
	}

	componentDidMount(){
		const { id } = this.props.location.query;
		if (!id) return;
		this.getAdInfo(id);
	}

	componentWillUmount(){
		this.props.form.resetFields();
	}			

	getAdInfo(id){
		const { fields } = this.state;

		ajax.get('/api/pc/ggs/gg_info', {id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const filedKeys = keys(this.state.fields);
					const { min_amount, max_amount } = data.ad;
					let newFields = {};

					filedKeys.forEach((filedKey) => {
						if (data.ad[filedKey] !== undefined){ 
							newFields[filedKey] = {
								value: data.ad[filedKey] 
							}
						}
					});	

					this.setState({fields: {...newFields, ranges: {value: [min_amount, max_amount]}}}); 	
				}
			})
	}

	handleFormChange(changedFields){
	    this.setState({
	      	fields: { ...this.state.fields, ...changedFields }
	    });		
	}	

	publishAd(url, param){
		ajax.post(url, param).then((response) => {
			const { error, msg='' } = response;
			if (error == 0) {
				//this.setState({visible: true});
				browserHistory.push('/app/userCenter/tradeInfo');
			} else {
				const errorMsg = getErrorMsg(msg);
				this.setState({timeStamp: Date.now(), error: errorMsg})
			}
		});		
	}

	handleAdPost(values){
		const { id } = this.props.location.query;
		const { funds_password_status } = this.props.globalState;
		const { pay_method, coin_type, funds_password, ...other } = values;
		let param = {
			pay_method: pay_method.join(','),
			ad_type: 'buy', 
			coin_type: coin_type.toLowerCase(),
			...other
		};

		if (funds_password_status){
			param = {...param, funds_password: MD5(funds_password)}
		}	

		if (id) {
			this.publishAd('/api/pc/ggs/edit', {...param, id});
		} else {
			this.publishAd('/api/pc/ggs/create', param);
		}
	}

	render(){
		const { id } = this.props.location.query;
		const { timeStamp, error, fields, visible, identityStatus } = this.state;

		return (
			<div>
				<DealForm 
					id={id}
					type="buy"
					timeStamp={timeStamp}
					error={error}					
					onSubmit={this.handleAdPost}
					fields={fields}
					onChange={this.handleFormChange}
				/>			
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

export default connect(mapStateToProps, mapDispatchToProps)(DealCenterPublishBuy);