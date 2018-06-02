import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import DealListCommonHead from './component/DealListCommonHead';
import DealListTableWrap from './component/DealListTableWrap';
import { getAvatar } from 'utils/util';
import { isNil } from 'lodash';

const columns = [{
	title: '买家信息',
	dataKey: 'username',
	key: 'username',
	width: '19%',
	render: (text, record, index) => {
		return (<div className="user-wrap">
			<img className="user-img" src={getAvatar(record.avatar)}/>
			<div className="user-info">
				<div className="user-name substr">{text}</div>
			</div>
		</div>)
	}
},{
	title: '交易价格',
	dataKey: 'price',
	key: 'price',
	width: '16%',
	render: (text, record, index) => {
		return <span>{`${text} ${record.currency}`}</span>
	}		
},{
	title: '交易限额',
	dataKey: 'min_amount',
	key: 'min_amount',
	width: '11%',
	render: (text, record) => {
		return `${text}-${record.max_amount}`
	}
},{
	title: '溢价率',
	dataKey: 'premium',
	key: 'premium',
	width: '10%',
	render: (value) => {
		return `${value}%`
	}
},{
	title: '付款方式',
	dataKey: 'pay_method',
	key: 'pay_method',
	width: '15%',
	render: (value) => {
		return value.join('/')
	}
},{
	title: '平均放行时间',
	dataKey: 'unlock_avg_period',
	key: 'unlock_avg_period',
	width: '8%',
	render: (value) => {
		const newText = isNil(value) ? '-' : `${value}分钟`;
		return <span>{newText}</span>
	}
},{
	title: '交易次数',
	dataKey: 'order_times',
	key: 'order_times',
	width: '6%'
},{
	title: '操作',
	dataKey: 'operate',
	key: 'operate',
	width: '15%',
	render: (text, record) => {
		const { ad_id, user_id } = record;
		const actionText = (window.OTC.id == user_id) ? '查看' : '卖出'; //是否自己
		return (<Link className="button" to={{pathname: "/app/dealCenter/detail/sell", query: {ad_id: record.ad_id}}} style={{backgroundColor: '#1cb78d'}}>{actionText}</Link>)
	}
}];

class DealCenterSellList extends Component {

	static displayName = 'DealCenterSellList';

	constructor(props){
		super(props);
		const { coin_type } = props.location.query || 'btc';
		this.state = {
			coin_type: coin_type || 'btc',
			currency: 'CNY',
			pay_method: '',
			country: 'china'
		};
		this.handleListChange = this.handleListChange.bind(this);
	};

	static propTypes = {

	};

	handleListChange(value){
		this.setState({...value});
	}

	render(){
		const { coin_type, currency, country, pay_method } = this.state;

		return (
			<div className="deal-center-list">
				<DealListCommonHead
					activeTab="sell"
					coin_type={coin_type}
					currency={currency}
					pay_method={pay_method}
					country={country}
					onChange={this.handleListChange}
				/>
				<div className="deal-center-list-body">
					<DealListTableWrap
						url="/api/pc/ggs/gg_list"
						param={{coin_type, ad_type: 'buy', currency, pay_method}}
						columns={columns}
					/>
				</div>
			</div>
		)

	}
}

export default DealCenterSellList