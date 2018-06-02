import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserInfoBlock from './component/UserInfoBlock';
import DealOrderChat from './component/DealOrderChat';
import DealOrderInfo from './component/DealOrderInfo';
import ajax from 'utils/request';
import { getAvatar } from 'utils/util';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux';

class DealSell extends Component {

	static displayName = 'DealSell';

	constructor(props){
		super(props);
		this.state = {
			info: {},
			chatStatus: 0
		};
		this.getDetail = this.getDetail.bind(this);
		this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	componentDidMount(){
		const { order_id } = this.props.location.query;
		if (!order_id) {
			browserHistory.push('/app/userCenter');
		};
		this.getDetail(order_id);
		this.getOrderStatus();
	}

	getOrderStatus(){
		const { order_id } = this.props.location.query;
		ajax.get('/api/orders/get_status', {order_id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({chatStatus: data.order_status});
				} else {

				}
			});
	}

	handleInfoUpdate(){
		const { order_id } = this.props.location.query;
		this.getDetail(order_id);
	}

	handleStatusChange(status){
		this.setState({chatStatus: status});
	}

	getDetail(order_id){
		ajax.get('/api/orders/partner_info',{order_id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0) {
					this.setState({info: data.partner_info || {}});
				}
			});
	}

	render(){
		const { order_id } = this.props.location.query;
		const { avatar, funds_password_status } = this.props.globalState;
		const { info, chatStatus } = this.state;

		return (
			<div className="detail-content">
				<UserInfoBlock
					info={info}
					user_id={info.id}
					username={info.username}
					onInfoUpdate={this.handleInfoUpdate}
				/>
				<div className="detail-info-body clearfix">
					<DealOrderChat
						className="fl"
						order_id={order_id}
						parterAvatar={getAvatar(info.avatar)}
						avatar={avatar}
						username={info.username}
						onStatusChange={this.handleStatusChange}
					/>
					<DealOrderInfo
						className="fr"
						type="sell"
						order_id={order_id}
						funds_password_status={funds_password_status}
						chatStatus={chatStatus}
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

export default connect(mapStateToProps, mapDispatchToProps)(DealSell);