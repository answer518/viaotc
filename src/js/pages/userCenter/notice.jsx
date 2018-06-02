import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination }  from 'antd';
import ajax from 'utils/request';
import { browserHistory } from 'react-router';

class Notice extends Component {

	static displayName = 'Notice';

	constructor(props){
		super(props);
		this.state = {
			page: 1,
			total: 0,
			page_size: 10,
			noticeList: []
		};
		this.handlePageSize = this.handlePageSize.bind(this);
	};

	componentDidMount(){
		this.getNoticeList();
	}

	handlePageSize(page){
		this.setState((page) => {
			this.getNoticeList();
		})
	}

	handleToDetail(id){
		browserHistory.push(`/app/userCenter/noticeDetail?${id}`);
	}

	getNoticeList(){
		const { page } = this.state;
		ajax.get('/api/pc/notice/notice_list', {page})
			.then((response) => {
				const { error, data } = response;
				if (error == 0) {
					const { total, page, page_size, notices } = data;
					this.setState({total, page_size, noticeList: notices});
				}
			})		
	}

	renderNoticeList(){
		const { noticeList } = this.state;

		return noticeList.map((d, i) => {
			const { title, date='', author='', id } = d;
			return (
				<div 
					 className="user-center-notice-item" 
					 key={i}
				>
					<div className="content">
						<div className="title">{title}</div>
						<div className="info">
							<span>{date}</span>
							<span>{`发布者：${author}`}</span>
						</div>
					</div>	
					<div className="detail" onClick={this.handleToDetail.bind(this, id)}>
						查看
					</div>		
				</div>
			)
		});
	}

	render(){
		const { total, page, page_size } = this.state;

		return (
			<div className="user-center-notice-wrap user-center-notice-content">
				<div className="user-center-notice-head">
					公告
				</div>			
				<div className="user-center-notice-body">
					{this.renderNoticeList()}
				</div>
				{total > 0 && <div style={{marginTop: '20px'}}>
					<Pagination 
					size="small"
					total={total}
					current={page}
					onChange={this.handlePageSize}
				/></div>}		
			</div>
		)
		
	}
}

export default Notice