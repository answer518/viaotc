import React, { PropTypes, Component } from 'react';
import SimulateTable from 'components/simulateTable';

const byFooter = () => {
	return <div className="more-deal">更多交易</div>
}

const sellFooter = () => {
	return <div className="more-deal">更多交易</div>
}


class DealInfo extends Component {

	static displayName = 'DealInfo';

	constructor(props){
		super(props);
	}

	render(){
		
		return (
			<div className="deal-info">
				<div className="buy-info">
					<SimulateTable 
						data={[
							{name: '哈哈哈', number: 3434, age: 23, sex: '男', country: 'china'},
							{name: '呵呵呵', number: 4545, age: 18, sex: '女', country: 'china'},
							{name: '啦啦啦', number: 14545, age: 26, sex: '男', country: 'china'},
							{name: '嘻嘻嘻', number: 89845, age: 24, sex: '男', country: 'china'},
							{name: '呃呃呃', number: 90955, age: 38, sex: '女', country: 'china'},
						]}
						columns={[
							{title: () => {return <span style={{fontSize: '27px', color: '#195efa'}}>姓名</span>}, dataKey: 'name', width: '20%', className: 'table-title', render: (text, record, index) => {
								const { country='' } = record;
								
								return (<div className="user-wrap">
									<div className="user-img"></div>
									<div className="user-info">
										<div className="user-name">{text}</div>
										<div className="user-country">{country.toUpperCase()}</div>
									</div>
								</div>)
							}},
							{title: '数字', dataKey: 'number', width: '20%'},
							{title: '年龄', dataKey: 'age', width: '20%'},
							{title: '性别', dataKey: 'sex', width: '20%'}, 
							{title: '操作', dataKey: 'operate', width: '20%', className: 'operate-td', render: () => {
								return <button className="button">买入</button>
							}},
						]}
						footer={byFooter}
					/>
				</div>
				<div className="sell-info">
					<SimulateTable 
						data={[
							{name: '哈哈哈', number: 3434, age: 23, sex: '男', country: 'china'},
							{name: '呵呵呵', number: 4545, age: 18, sex: '女', country: 'china'},
							{name: '啦啦啦', number: 14545, age: 26, sex: '男', country: 'china'},
							{name: '嘻嘻嘻', number: 89845, age: 24, sex: '男', country: 'china'},
							{name: '呃呃呃', number: 90955, age: 38, sex: '女', country: 'china'},
						]}
						columns={[
							{title: () => {return <span style={{fontSize: '27px', color: '#1cbb66'}}>姓名</span>}, dataKey: 'name', width: '20%', className: 'table-title', render: (text, record, index) => {
								const { country='' } = record;
								
								return (<div className="user-wrap">
									<div className="user-img"></div>
									<div className="user-info">
										<div className="user-name">{text}</div>
										<div className="user-country">{country.toUpperCase()}</div>
									</div>
								</div>)
							}},
							{title: '数字', dataKey: 'number', width: '20%'},
							{title: '年龄', dataKey: 'age', width: '20%'},
							{title: '性别', dataKey: 'sex', width: '20%'}, 
							{title: '操作', dataKey: 'operate', width: '20%', className: 'operate-td', render: () => {
								return <button className="button">卖出</button>
							}},
						]}
						footer={sellFooter}
					/>
				</div>
			</div>
		)
	}
}

export default DealInfo;