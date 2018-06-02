import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.less';

class CountDownButton extends Component {

	static displayName = 'CountDownButton';

	constructor(props){
		super(props);
		this.state = {
			count: 0,
			counting: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.startCount = this.startCount.bind(this);
		this.timer = null;
	};

	static propTypes = {
		text: PropTypes.string,
		time: PropTypes.number,
		onClick: PropTypes.func
	};

	static defaultProps = {
		text: '点击获取',
		time: 60
	};

	componentWillReceiveProps(nextProps){
		if (this.props.timeStamp !== nextProps.timeStamp){
			this.setState({counting: false, count: nextProps.time}, () => {
				this.timer && clearTimeout(this.timer);
			});
		}
	}

	componentWillUnmount(){
		this.timer && clearTimeout(this.timer);
	}

	handleClick(){
		const { counting, count } = this.state;
		if (counting) return;
		const { onClick, time } = this.props;
		onClick && onClick();
		this.setState({counting: true, count: time}, () =>{
			this.startCount();
		});
	}

	startCount(){
		if (this.state.count === 0 && this.timer){
			clearTimeout(this.timer);
			return;
		} 
		this.setState((prev) => {
			const count = (prev.count - 1) < 0 ? 0 : prev.count - 1;
			if (count === 0) {
				return {count, counting: false}
			}
			return {count}
		});
		this.timer = setTimeout(() => {
			this.startCount();
		}, 1000)
	}

	render(){
		const { text, onClick } = this.props;
		const { count, counting } = this.state;
		const cls = classNames({
			'count-down-button': true,
			'counting-down': counting
		})

		return (
			<div 
				className={cls}
				onClick={this.handleClick}
			>
				{counting ? `${count}s` : text}	
			</div>
		)
		
	}
}

export default CountDownButton