import React, { Component } from 'react'
import propTypes from 'prop-types';
import Table from 'components/table';
import "./index.less";
import {Link} from 'react-router';
import axios from 'utils/request';
import { connect } from 'react-redux';
import * as globalAction from 'src/js/actions';
import { bindActionCreators } from 'redux'; 

class AssertManage extends Component {

	static displayName = 'AssertManage';	

	constructor(props) {
		super(props);
		this.state = {
			loading:false,
			canCashOut: false,
			data:[]
		};
		this.getAuthInfo = this.getAuthInfo.bind(this);
	}

	componentDidMount(){
		this.getAuthInfo();
	}

	getAuthInfo(){
		const { funds_password_status } = this.props.globalState;

		axios.get('/api/pc/auth/authinfo')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState({
						canCashOut: data.authinfo.status == 1 && funds_password_status == 1
					});
				}
			});
	}

	rowKey(record, i){
		return i;
	}

	render(){
		let columns_assert = [
			{
				title: '币种',
				dataIndex: 'coin_type',  
				key: 'coin_type',
				render:(value,record)=>{
					return (
						<span>{value.toUpperCase()}</span>
					)
				}
			},
			{
				title: '可用',
				dataIndex: 'usable',
				key: 'usable'
			},
			{
				title: '锁定',
				dataIndex: 'locked',
				key: 'locked'
			},
			{
				title: '冻结',
				dataIndex: 'freeze',
				key: 'freeze'
			},
			{
				title: '操作',
				render:(value,record)=>{
					let cashIn = `/app/assetManage/cashIn?coin_type=${record.coin_type}` ,
						cashOut = this.state.canCashOut ?`/app/assetManage/cashOut?coin_type=${record.coin_type}`:'/app/assetManage/cashIdentify';
					return (
						<span className = "table-operation">
							<Link to= {cashIn}>充币</Link>
							<span className="or"></span>
							<Link to= {cashOut}>提币</Link>
						</span>
					)

				}

			}
		];
		// return (
		// 	<div >
		// 		<Table
		// 			columns = {columns_assert}
		// 			title = '资产管理'
		// 			extral = {<Link to ='/app/assetManage/cashAdres'><span style={{fontSize: '14px'}}>提币地址管理</span></Link>}
		// 			pagination = {false}
		// 			url = '/api/pc/balance'
		// 			tableKey ='balance'
		// 			rowKey={this.rowKey}
		// 		/>
		// 	</div>
		// )
		return (
			<div >
				<Table
					columns = {columns_assert}
					title = '资产管理'
					pagination = {false}
					url = '/api/pc/balance'
					tableKey ='balance'
					rowKey={this.rowKey}
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

export default connect(mapStateToProps, mapDispatchToProps)(AssertManage);