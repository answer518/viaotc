import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ClickOutside from 'react-click-outside';
import { Link, browserHistory } from 'react-router';
import { isEmpty } from 'lodash';
import ajax from 'utils/request';
import moment from 'moment';

class NewsList extends Component {

	static displayName = 'NewsList';

	constructor(props){
		super(props);
		this.state = {
			show: false,
			unread_num: 0,
			messages: []
		};
		this.handleShow = this.handleShow.bind(this);
		this.goToMyMessage = this.goToMyMessage.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.timer = null;
	}

	handleShow(){
		this.setState((prev) => {
			return {show: !prev.show}
		}, () => {
			this.getSystemMsg();
		});
	}

	handleClose(){
		this.setState({show: false});
	}

	componentDidMount(){
		this.getSystemMsg();
		this.getUnreadGroup();
	}

	componentWillUnmount(){
		if (this.timer) {clearTimeout(this.timer)}
	}

	getSystemMsg(){
		ajax.get('/api/pc/message/my_msg?page=1&page_size=1&unread=1')
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					this.setState((prev) => { 
						const filterMessages = prev.messages.filter((c) => c.type !== 'system');

						data.messages[0] && filterMessages.unshift({...data.messages[0], title: '系统消息', type: 'system'});
						return {messages: filterMessages, unread_num: filterMessages.length};
					});
				}
			});
	}

	getUnreadGroup(){
		if (this.timer) {clearTimeout(this.timer)}
		ajax.get('/api/pc/chat/get_unread_group', {}, 1)
			.then((response) => {
				const { error, data } = response;
				if (error == 0) {
					const d = data.msg || [];
					const msgs = d.map((v) => {return {content: v.content, title: v.username, 
						create_time: v.create_time, order_id: v.order_id, type: v.type}});

					this.setState((prev) => {
						const filterMessages = prev.messages.filter((c) => c.type === 'system');
						const messages = filterMessages.concat(msgs)

						return {messages, unread_num: messages.length};
					});					
				}
			});
		this.timer = setTimeout(() => {
			this.getUnreadGroup();
		}, 6000);			
	}

	goToMyMessage(){
		this.setState({show: false});
		browserHistory.push('/app/userCenter/myMessage');		
	}

	goToChat(order_id, type){
		this.setState({show: false});
		browserHistory.push({pathname: `/app/dealCenter/deal/${type}`, query: {order_id}});
	}

	renderMessages(){
		const { messages } = this.state;

		return messages.map((message, i) => {
			const { title='', content='', create_time, order_id, type } = message;
			const subStrTitle = title.length > 20 ? `${title.slice(0, 20)}...` : title;
			const subStrContent = content.length > 46 ? `${content.slice(0, 52)}...` : content;
			
			return (
				<div 
					className="news-list-item" 
					key={i}
					onClick={type !== 'system' ? this.goToChat.bind(this, order_id, type) : this.goToMyMessage }
				>
					<div className="news-list-item-head">
						{title}
						<span className="news-list-time">{create_time ? moment(Number(create_time) * 1000).format("YYYY-MM-DD HH:mm:ss") : ''}</span>
					</div>
					<div 
						className="news-list-item-content"
					>
						{subStrContent} 
					</div>
				</div>				
			);
		});
	}

	render(){	
		const { show, unread_num, messages } = this.state;
		const isDataEmpty = isEmpty(messages);
		const cls = classNames({
			'news-list-wrap': true,
			'news-unread': unread_num > 0
		});

		const style = isDataEmpty ? {height: '100px'} : {};

		return (
			<div className={cls}>
				<ClickOutside onClickOutside={this.handleClose}>
					<div 
						className="news-list-head"
						onClick={this.handleShow}
					>
						<span>消息</span><span>{unread_num > 0 && `(${unread_num})`}</span>
					</div>				
					{show && 
						<div className="news-list-body">
							<div className="news-list-body-head">
								最新消息
							</div>
							<div className="news-list-body-content" style={style}>
								{isDataEmpty 
									? <div className="news-list-empty">
										<div className="unread-tip-icon"></div>
										<div className="unread-tip-text">您当前没有未读消息</div>
									</div>
									:this.renderMessages()}																							
							</div>
							<div className="news-list-body-foot">
								{/*<Link to="/app/userCenter/myMessage">查看全部消息</Link>*/}
							</div>							
						</div>
					}
				</ClickOutside>
			</div>
		)
		
	}
}

export default NewsList