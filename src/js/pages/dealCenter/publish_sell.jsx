import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DealForm from './component/DealForm';
import { Modal } from 'antd';
import ajax from 'utils/request';
import { browserHistory } from 'react-router';
import { getErrorMsg } from 'utils/util';
import FormButton from 'pages/component/FormButton';
import { keys } from 'lodash';
import MD5 from 'md5';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class DealCenterPublishSell extends Component {

	static displayName = 'DealCenterPublishSell';

	constructor(props){
		super(props);
		this.state = {
			timeStamp: Date.now(),
			error: '',		
			visible: false,	
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
					value: 2
				},
				price: {
					value: ''
				},
				ranges: {
					value: []
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
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleBtnClick = this.handleBtnClick.bind(this);	
		this.publishAd = this.publishAd.bind(this);	
	}

	componentDidMount(){
		const { id } = this.props.location.query;
		this.getAuthInfo();
		if (!id) return;
		this.getAdInfo(id);
	}

	componentWillUmount(){
		this.props.form.resetFields();
	}

	handleModalClose(){
		this.setState({visible: false});
	}

	handleBtnClick(){
		const { funds_password_status } = this.props.globalState;
		const { identityStatus } = this.state;
		
		this.setState({visible: false});

		if (identityStatus != 1 || funds_password_status != 1) {
			browserHistory.push('/app/userCenter/dealIdentifiy');
		} else {
			browserHistory.push('/app/userCenter/tradeInfo');
		}
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

	getAdInfo(id){
		const { fields } = this.state;

		ajax.get('/api/ggs/gg_info', {id})
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
				this.setState({visible: true});
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
			ad_type: 'sell', 
			coin_type: coin_type.toLowerCase(),
			...other
		};

		if (funds_password_status){
			param = {...param, funds_password: MD5(funds_password)}
		}	

		if (id) {
			this.publishAd('/api/ggs/edit', {...param, id}); 
		} else {
			this.publishAd('/api/ggs/create', param);
		}

	}
 
	render(){
		const { id } = this.props.location.query;
		const { timeStamp, error, fields, visible, identityStatus } = this.state;
		return (
			<div>
				<DealForm 
					type="sell"
					timeStamp={timeStamp}
					error={error}
					onSubmit={this.handleAdPost}
					fields={fields}
					onChange={this.handleFormChange}
					onTypeChange={this.handleTypeChange}
					id={id}
				/>
				<Modal
				 	title="广告发布成功"
				 	width={600}
				 	visible={visible}
				 	className="deal-modal"
				 	onCancel={this.handleModalClose}
				 	footer={null}
				 	maskClosable={false}
				 	closable={false}				 	
				 >
					<div className="deal-tip deal-pay-tip">
						<div className="ok tip-icon"></div>
						{identityStatus == 1 ?
							<div style={{marginBottom: '62px'}}>
								<h4>您的广告已发布成功，请注意查看短信</h4>
								<h4>产生交易订单时我们将在第一时间通知您</h4>
							</div> 
							:<div style={{marginBottom: '62px'}}>
								<h4>您的广告信息已添加成功，广告信息将在您完成</h4>
								<h4>相关设置后对外展示</h4>
							</div>
						}
						<div style={{height: '80px', backgroundColor: '#fff'}}>	
							<FormButton
								text={identityStatus == 1 ? '确认' : '去设置'}
								className="submit-btn-wrap"
								isDisabled={false}
								onSubmit={this.handleBtnClick}
							/>	
						</div>											
					</div>	
				 </Modal>				
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

export default connect(mapStateToProps, mapDispatchToProps)(DealCenterPublishSell);