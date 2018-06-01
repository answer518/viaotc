import React, { Component } from 'react';
import { Table } from 'antd';
import './index.less';

const data = [
	{
		name: 'flinsword',
		country: 'china',
		price: 4367.35,
		dealNumber: '1000 - 100',
		paymentWay: [1,2],
		time: 12
	},
	{
		name: '任大朵朵',
		country: 'china',
		price: 12903.35,
		dealNumber: '500 - 520.12',
		paymentWay: [1,2],
		time: 10
	},
	{
		name: 'Riko',
		country: 'china',
		price: 2953.35,
		dealNumber: '500 - 2000',
		paymentWay: [1,2],
		time: 8
	},
	{
		name: 'chai_dog',
		country: 'china',
		price: 28304.30,
		dealNumber: '400 - 600',
		paymentWay: [1,2],
		time: 15
	},
	{
		name: '和平使者',
		country: 'china',
		price: 4367.35,
		dealNumber: '700 - 120',
		paymentWay: [1,2],
		time: 12
	}				
];
const columns = [
	{
		key: 'name',
		dataIndex: 'name',
		title: '卖家信息',
		render: (text, record, index) => {
			return text;
		}
	},
	{
		key: 'price',
		dataIndex: 'price',
		title: '交易价格'
	},
	{
		key: 'dealNumber',
		dataIndex: 'dealNumber',
		title: '交易数据'
	},
	{
		key: 'paymentWay',
		dataIndex: 'paymentWay',
		title: '付款方式'
	},
	{
		key: 'time',
		dataIndex: 'time',
		title: '平均放行时间'
	},
	{
		key: 'operate',
		dataIndex: 'operate',
		title: '操作',
		render: (text, record, index) => {
			return '操作'
		}
	}
];

class OrderList extends Component {

	static displayName = 'OrderList';

	constructor(props){
		super(props); 
	}

	setRowKey(record, index){
		return `${record.name}-${index}`;
	}

	render(){
		return (
			<div className="order-list-wrap">
				<Table 
					dataSource={data}
					columns={columns}
					rowKey={this.setRowKey}
					pagination={false}
				/>
			</div>
		)
	}
}

export default OrderList;