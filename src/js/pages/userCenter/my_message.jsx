import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Pagination } from 'antd';
import ajax from 'utils/request';
import moment from 'moment';

class MyMessage extends Component {

	static displayName = 'MyMessage';

	constructor(props){
		super(props);
		this.state = {
			type: 0,
			page: 1,
			page_size: 5,
			total: 0,
			messages: [],
			unreadNum: 0
		};
		this.renderTabs = this.renderTabs.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
	};

	static propTypes = {

	};

	static defaultProps = {
		tabs: [{
			name: '系统消息',
			id: 0
		},{
			name: '充值',
			id: 1
		},{
			name: '提币',
			id: 2
		},{
			name: '认证',
			id: 3
		},{
			name: '安全',
			id: 4
		}]
	};	

	componentDidMount(){
		this.getMyMessages();
	}

	handlePageChange(page){
		this.setState({page}, () => {
			this.getMyMessages();
		});		
	}

	handleTabChange(id){
		this.setState({type: id}, () => {
			this.getMyMessages(true);
		}); 
	}	

	getMyMessages(resetPage){
		const { type, page } = this.state;
		const finalPage = resetPage ? 1 : page; 

		ajax.get('/api/message/my_msg',{type, page: finalPage})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const { messages, page_size, total } = data;
					const unreads = messages.filter((msg) => msg.status == 0);
					if (unreads.length > 0) {
						const unreadIds = unreads.map((unread) => unread.id);
						this.readMessage(unreadIds);
					}
					this.setState({messages, page_size, total, unreadNum: unreads.length});
				}
			})		
	}

	readMessage(ids){
		ajax.get('/api/message/change_to_read', {message_ids: ids.join(',')})
			.then((response) => {
				const { error } = response;
				if (error == 0){
					this.getMyMessages();
				}
			});
	}

	renderTabs(){
		const { tabs } = this.props;
		const { type } = this.state;

		return tabs.map((tab, i) => {
			const { name, id } = tab;
			const cls = classNames({
				'tabs-item': true,
				'tabs-item-active': type === id
			});

			return (<div 
						className={cls}
						key={i}
						onClick={this.handleTabChange.bind(this, id)}
					>{name}</div>)
		});
	}	
 
	renderMyMessageItems(messages){
		return messages.map((msg, i) => {
			const { title, content, create_time} = msg; 
			return (
				<div 
					key={i}
					className="my-message-item"
				>
					{/*<div className="my-message-item-title">
						{title}
					</div>*/}
					<div className="my-message-item-content">
						{content}
						<span className="fr my-message-time">{create_time ? moment(Number(create_time) * 1000).format("YYYY-MM-DD HH:mm:ss") : ''}</span>
					</div>
				</div>
			)
		}) 
	}

	render(){

		const { messages, page_size, total, page, unreadNum } = this.state;

		return (
			<div className="order-info-content">
				<div className="order-info-content-head">
					<h1>我的消息</h1>
					<div className="tabs-wrap msg-tabs clears">  
						{this.renderTabs()}
					</div>
				</div>
				<div className="order-info-content-body" style={{padding: '0 50px'}}>
					<div className="my-message-num">
						<span className="unread">{unreadNum}条未读</span>
						<span style={{margin: '0 6px'}}>/</span>
						<span>{total}条消息</span>
					</div>
					<div className="my-message-list">
						{this.renderMyMessageItems(messages)}
					</div>	
					{total > 0 && <div className="pagination-wrap">
						<Pagination 
							size="small" 
							pageSize={page_size}
							total={total} 
							current={page}
							onChange={this.handlePageChange}
						/>
					</div>}
				</div>
			</div>	
		)
		
	}
}

export default MyMessage