import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import io from 'socket.io-client';
import { getAvatar } from 'utils/util';
import ajax from 'utils/request';  
import { browserHistory } from 'react-router';

class DealOrderChat extends Component {

	static displayName = 'DealOrderChat';

	constructor(props){
		super(props);
		this.state = {
			message: '',
			chats: []
		};
		this.handlePostChat = this.handlePostChat.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
		this.getChatContainerRef = this.getChatContainerRef.bind(this);
		this.getChatBodyRef = this.getChatBodyRef.bind(this);
		this.getLastChat = this.getLastChat.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.getHistoryChat = this.getHistoryChat.bind(this);

		this.timer = null;
		this.toBottom = false; //控制是否滚动到底部的开关
		this.ticking = false;
		this.socketIO = null;
	};

	static propTypes = {

	};

	componentDidMount(){
		const { order_id } = this.props;
		if (!order_id) {
			browserHistory.push('/app/userCenter');
			return;
		};
		this.getLastChat(order_id);
		//监听scroll
		this.chartBody && this.chartBody.addEventListener('scroll', this.handleScroll);		
		this.toBottom = true;;
		this.getChartStart(order_id);
	}

	componentWillUnmount(){
		const { order_id } = this.props;
		const { chats } = this.state;
		const last = chats.slice(-1);
		const create_time = last[0] ? last[0].create_time : '';

		this.getChangeToRead(create_time, order_id);

		this.chartBody && this.chartBody.removeEventListener('scroll', this.handleScroll);
		this.timer && clearTimeout(this.timer);
	}

	getChartStart(order_id){
		const { onStatusChange } = this.props;
		
		ajax.get('/api/pc/chat/get_token', {order_id})
			.then((response) => {
				const { error, data} = response;
				if(error == 0){
					//'wss://ws.jtcool.com/'
					this.socketIO = io(window.OTC.ws_url, { path: '/chat/socket.io', query: `token=${data.token}`});
					this.socketIO.on(data.token, (data)=> {
						this.toBottom = true;
						if (data.type === 'chat'){
							const { sender_id, id, create_time } = data;
							this.setState((prev) => {
								const copy = prev.chats.slice();
								copy.push(data);
								return {chats: copy}
							},() => {
								this.goToChatContainerBottom(); 
								if (sender_id != window.OTC.id){
									this.getChangeToRead(create_time, order_id);
								}
							})
						} else if(data.type === 'change_order_status'){
							onStatusChange && onStatusChange(data.status);
						}
					})
				}
			});
	}

	getChatContainerRef(ref){
		this.chartContianer = ref;
	}

	getChatBodyRef(ref){
		this.chartBody = ref;
	}

	getChangeToRead(last_time, order_id){
		ajax.get('/api/pc/chat/change_to_read', {last_time, order_id});
	}

	getHistoryChat(param){
		ajax.get('/api/pc/chat/get_history', param)
			.then((response) => {
				const { error, data } = response;
				this.ticking = false;
				if (error == 0){
					const { msg=[] } = data;
					this.setState((prev) => {
						return {chats: msg.slice().reverse().concat(prev.chats)}
					});
				}
		});		
	}

	handleScroll(e){
		if (!this.ticking && e.target.scrollTop === 0){
			const { order_id } = this.props;
			const { chats } = this.state;
	
			this.getHistoryChat({order_id, last_time: chats[0] ? chats[0].create_time : ''});
			this.ticking = true;
		}
	}

	goToChatContainerBottom(){
		if (!this.chartContianer || !this.getChatBodyRef || !this.toBottom) return;
		const { height } = this.chartContianer.getBoundingClientRect();
		this.chartBody.scrollTop = height;
		this.toBottom= false;
	}

	getLastChat(order_id){
		ajax.get('/api/pc/chat/get_history', {order_id})
			.then((response) => {
				const { error, data } = response;
				if (error == 0){
					const { msg=[] } = data;
					const create_time = msg[0] ? msg[0].create_time : '';
					this.setState({chats: msg.slice().reverse()}, () => {
						this.getChangeToRead(create_time, order_id);
						this.goToChatContainerBottom(); 
					});
				}
		});
	}

	postChatMessage(content){
		const { order_id } = this.props;
		if (!order_id) return;
		ajax.post('/api/pc/chat/send', {order_id, content})
			.then((response) => {});
	}

	inputChange(e){
		this.setState({message: e.target.value});
	}

	handleInputKeyDown(e){
		if (e.keyCode == 13){
			this.handlePostChat();
		}
	}	

	handlePostChat(){
		const { message } = this.state;
		this.setState({message: ''});
		this.toBottom = true;
		this.postChatMessage(message);
	}

	renderChats(){
		const { parterAvatar, avatar } = this.props;
		const { chats } = this.state;

		return chats.map((chat, i) => {
			const { content, sender_id } = chat;
			const isSelf = sender_id == window.OTC.id;

			const cls = classNames({
				'chat-item': true,
				'clearfix': true,
				'self': isSelf
			});
			const arrowCls = classNames({
				'common-bg': true,
				'chat-arrow': true, 
				'chat-arrow-left': !isSelf,
				'chat-arrow-right': isSelf
			});
			const iconSrc = isSelf ? avatar : parterAvatar;

			return (
				<div 
					className={cls}
					key={i}
				>
					<img src={iconSrc} className="chat-user-icon"/>
					<div className="chat-content">
						{content}
						<div className={arrowCls}></div>
					</div>
				</div>
			)
		})
	}

	render(){
		const { className, username } = this.props;
		const { message } = this.state;
		const cls = classNames({
			'deal-order-chat': true,
			[className]: className
		});

		return (
			<div className={cls}>
				<div className="deal-order-chat-head">
					与 {username} 对话中...
				</div>
				<div className="deal-order-chat-body-wrap">
					<div 
						className="deal-order-chat-body"
						ref={this.getChatBodyRef}
					>
						<div 
							className="chat-contianer"
							ref={this.getChatContainerRef}
						>
							{this.renderChats()}
						</div>
					</div>
				</div>
				<div className="deal-order-chat-foot">
					<div className="chat-input-wrap">
						<textarea 
							className="chat-input"
							placeholder="请输入内容"
							value={message}
							onChange={this.inputChange}
							onKeyDown={this.handleInputKeyDown}
						>
						</textarea>
						{/*<div className="common-bg chat-add"></div>*/}
					</div>
					<div 
						className="send-area"
						onClick={this.handlePostChat}
					>
						<div className="common-bg send"></div>
					</div>
				</div>
			</div>
		)
		
	}
}

export default DealOrderChat