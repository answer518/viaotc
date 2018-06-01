import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.less';
import { Carousel } from 'antd';
import { Link, browserHistory } from 'react-router';

class Alert extends Component {

	static displayName = 'Alert';

	constructor(props){
		super(props);
		this.state = {
			close: false
		};
		this.handleAlertClose = this.handleAlertClose.bind(this);
	}

	static propTypes = {
		type: PropTypes.string,
		show: PropTypes.bool,
		message: PropTypes.string,
		showIcon: PropTypes.bool,
		link: PropTypes.string
	};

	static defaultProps = {
		type: 'normal'
	};

	handleAlertClose(){
		this.setState({
			close: true
		});
	}

	renderNotice(){
		const { messages } = this.props;

		return messages.map((msg, i) => {
			const { content, link='' } = msg;

			return (<div className="notice-item" key={i}>
				<div></div>
				<Link href="/app/userCenter/noticeDetail">{content}</Link> 
			</div>)
		});
	}

	render(){
		const { close } = this.state;

		const cls = classNames({
			'alert-wrap': true,
			'alert-wrap-close': close
		});
		// const typeCls = classNames({
		// 	'notice-icon': true,
		// 	[`${type}-notice-icon`]: type
		// });

		return (
			<div className={cls}>
				{!close && <div className="alert-content">
					<Carousel 
						className="notice-info"
						vertical={true}
						dots={false}
						autoplay
					>
						{this.renderNotice()}
					</Carousel>	
					{/*<div className="notice-item">
						{type && <div className={typeCls}></div>}
						<Link href={link}>{message}</Link>
						{showIcon && <div className="close" onClick={this.handleAlertClose}></div>}
					</div>*/}								
				</div>}
				<div className="close" onClick={this.handleAlertClose}></div>	
			</div>
		)
	}
}

export default Alert;