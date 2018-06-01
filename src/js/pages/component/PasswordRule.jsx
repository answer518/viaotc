import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { passwordStrength } from 'utils/util';
import classNames from 'classnames';

class PasswordRule extends Component {

	static displayName = 'PasswordRule';

	constructor(props){
		super(props);
		this.state = {
			mode: 0
		};
	}

	componentDidMount(){
		const { password } = this.props;
		if (password) return;
		this.updateMode(password);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.password != nextProps.password){
			this.updateMode(nextProps.password);
		}
	}

	updateMode(password) {
		const mode = passwordStrength(password);
		this.setState({mode});
	}

	renderStrength(mode) {
		if (mode == 0 ) {
			return '低';
		} else if (mode >= 1 && mode <= 2){
			return '中';
		} else if (mode > 2){
			return '高';
		}
	}

	getMyMode(mode) {
		if (mode == 0 ) {
			return 1;
		} else if (mode >= 1 && mode <= 2){
			return 2;
		} else if (mode > 2){
			return 3;
		}		
	}

	renderBars(){
		const { mode } = this.state;
		const barItems = [];

		for (let i = 0; i < 3; i++){
			const isActive = this.getMyMode(mode) > i;
			const style = isActive ? {backgroundColor: '#ff473e'} : {backgroundColor: 'rgba(51, 51, 51, 0.1)'}; 
			const item = (<div className="bar-item" style={style} key={i}></div>);
			barItems.push(item);
		}

		return barItems;
	}

	render(){
		const { mode } = this.state;
		const lenCls = classNames({
			'check-pass': mode > 0
		});

		const strLen = classNames({
			'check-pass': mode > 2
		})

		return (
			<div className="password-rule">
				<div className="title">密码规则</div>
				<div style={{marginBottom: '5px'}} className={lenCls}>长度为8-20位</div>
				<div style={{marginBottom: '8px'}} className={strLen}>包含大写字母、字符、特殊符号任意两项</div>
				<div>密码强度：{this.renderStrength(mode)}</div>
				<div className="bars">
					{this.renderBars()}
				</div>
			</div>
		)
		
	}
}

export default PasswordRule