import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';
import ajax from 'utils/request';
import { browserHistory } from 'react-router';
import { isEqual } from 'lodash';

const columns = [{
	title: '币种',
	dataIndex: 'coin_type',
	key: 'coin_type'
},{
	title: '价格',
	dataIndex: 'price',
	key: 'price',
	render: (text, record) => {
		return `${text}${record.currency}`
	}
},{
	title: '数量',
	dataIndex: 'max_amount',
	key: 'max_amount'
}];

class DealInfoTable extends Component {

	static displayName = 'DealInfoTable';

	constructor(props){
		super(props);
		this.state = {
			ads: []
		};
		this.getOtherAdsInfo = this.getOtherAdsInfo.bind(this);
		this.goToDealInfo = this.goToDealInfo.bind(this);
	}

	componentDidMount(){
		const { user_id, ad_type, coin_type } = this.props;
		if (!user_id) return;
		this.getOtherAdsInfo({user_id, ad_type, coin_type}); 
	}

	componentWillReceiveProps(nextProps){
		if(!isEqual(this.props != nextProps)){
			const { user_id, ad_type, coin_type } = nextProps;
			this.getOtherAdsInfo({user_id, ad_type, coin_type});
		} 
	}

	getOtherAdsInfo(param){
		ajax.get('/api/pc/ggs/other_ggs_info', param)
			.then((response) =>{
				const { error, data } = response;
				if (error == 0) {
					this.setState({ads: data.ads}); 
				}
			})
	}

	goToDealInfo(record){
		const { type } = this.props;
		browserHistory.push(`/app/dealCenter/detail/${type}?ad_id=${record.id}`);
	}

	rowKey(record, index){
		return index;
	}

	render(){
		const { isSelf } = this.props;
		const { ads } = this.state;

		return (
			<div className="deal-info-table-wrap">
				<div className="deal-info-table-head">
					{`${isSelf ? '我的' : '他的'}其他交易信息`}
				</div>
				<div className="deal-info-table-body">
					<Table
						dataSource={ads}
						columns={columns}
						pagination={false}
						onRowClick={this.goToDealInfo}
						rowKey={this.rowKey}
					/>
				</div>
			</div>
		)
		
	}
}

export default DealInfoTable