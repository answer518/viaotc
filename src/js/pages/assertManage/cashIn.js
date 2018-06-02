import React, { Component } from 'react';
import propTypes from 'prop-types';
import Table from 'components/table';
import { message } from 'antd';
import "./index.less";
import { Link } from 'react-router';
import { getUrlParam, formatNumber, coinTips, getErrorMsg } from 'utils/util';
import axios from 'utils/request';
import QRCode from 'qrcode.react';
import moment from 'moment';

class CashIn extends Component {

	static displayName = 'AssertManage';

	constructor(props) {
		super(props);
		this.state = {
			coin_type:getUrlParam('coin_type'),
			addr:''
		}
	}

	componentDidMount(){
		this.getAddress()
	}

	getAddress(){
		let {coin_type} = this.state;
		axios.get('/api/pc/recharge_addr',{coin_type:coin_type}).then((response) => {
			const { error, data, msg='' } = response;
			if (error == 0){
				this.setState({addr: data.addr});
			} else {
				const errorMsg = getErrorMsg(msg);
				message.warn(errorMsg);
			}	
		})
	}

	renderTips(){
		const { coin_type } = this.state;
		const tips = coinTips[coin_type];
		return tips.map((tip, i) => {
			return (<li key={i}>{tip}</li>)
		})
	}


	render(){
		let {addr} = this.state;
		let columns =[
			{
				title: '时间',
				dataIndex: 'create_time',
				key: 'create_time',
				render: (value) => {
					return Number(value) ? moment(Number(value) * 1000).format("YYYY-MM-DD HH:mm:ss") : '' 
				}		
			},
			{
				title: '充值地址',
				dataIndex: 'to_addr',
				key: 'to_addr'
			},
			{
				title: '充值数量',
				dataIndex: 'amount',
				key: 'amount'
			},
			{
				title: '状态',
				dataIndex: 'status',
				render:(value,record)=>{
					switch (String(value)){
						case ('0'):
							return <span >未审核</span>;
							break;
						case ('1'):
							return <span > 取消</span>;
							break;
						case ('2'):
							return <span className ="status_success">审核通过</span>;
							break;
						case ('3'):
							return <span className ="status_fail">审核拒绝：拒绝原因 +{record.remark}</span>;
							break;
					}
				}
			},

		];
		return (
			<div >
				<div className = "cashIn-container"> 
					<div className = "cash-title">
						<span className="left-title">{getUrlParam('coin_type').toUpperCase()}充值</span>
					</div>
					<div className = "cashIn-content clearfix">
						<div className = "dimension fl">
							<QRCode value={addr} size={200} level={"H"}/>
						</div>
						<div className = "cashIn-detail fl" style={{marginLeft: '40px'}}>
							<div className = "cashIn-address">
								<span>充值地址：</span>
								<span className="addr">{addr}</span>
							</div>
							<div className = "cashIn-tip">
								<p className = "tip-word">温馨提示</p>
								<ul>
									{this.renderTips()}
								</ul>
							</div>

						</div>
					</div>
				</div>

				<Table
					columns = {columns}
					title = '充值记录'
					url = '/api/pc/recharge/records'
					tableKey ='records'
					param={{coin_type: getUrlParam('coin_type')}}
				/>

			</div>
		)

	}
}

export default CashIn;
