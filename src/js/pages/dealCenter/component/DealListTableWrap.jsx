import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import SimulateTable from 'components/simulateTable';
import ajax from 'utils/request';
import { isEmpty, isEqual } from 'lodash';

class DealListTableWrap extends Component {

	static displayName= 'DealListTableWrap';

	constructor(props){
		super(props);
		this.state = {
			data: [],
			total: 0,
			page_size: 10,
			page: 1
		};
		this.getDealList = this.getDealList.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
	}

	static propTypes = {
		url: PropTypes.string,
		param: PropTypes.object
	};

	componentDidMount(){
		const { url, param } = this.props;
		const { page, page_size } = this.state;

		this.getDealList(url, {...param, page, page_size});
	}

	componentWillReceiveProps(nextProps){
		const { url, param } = this.props;
		const { url:nextUrl, param:nextParam } = nextProps;

		if (url !== nextUrl || !isEqual(param, nextParam)){
			const { page_size } = this.state;
			this.setState({page: 1});
			this.getDealList(nextUrl, {...nextParam, page: 1, page_size});
		}
	}

	handlePageChange(page){
		this.setState({page}, () => {
			const { url, param } = this.props;
			const { page_size } = this.state;

			this.getDealList(url, {...param, page_size, page});
		})
	}

	getDealList(url, param) {
		ajax.get(url, param)
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const { ads, total, page } = data;
					this.setState({data: ads, total});
				}
			})
	}

	render(){
		const { columns } = this.props; 
		const { data, page, total } = this.state;

		return (
			<div className="deal-list-table-wrap">
				<SimulateTable 
					className="simulate-table-white"
					data={data}
					columns={columns}
				/>
				{total > 0 && <Pagination 
					size="small"
					current={page} 
					total={total}
					onChange={this.handlePageChange}
				/>}
			</div>
		)
		
	}
}

export default DealListTableWrap