import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input } from 'antd';
import PasswordRule from './PasswordRule';

class PasswordInput extends Component {

	static displayName = 'PasswordInput';

	constructor(props){
		super(props);
		this.state = {
			open: false,
			showRule: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	static propTypes = {
		placeholder: PropTypes.string
	};

	handleChange(){
		this.setState((prev) => {
			return {open: !prev.open}
		});
	}

	handleFocus(){
		this.setState({showRule: true});
	}

	handleBlur(){
		this.setState({showRule: false});
	}

	render(){
		const { placeholder, value, onChange, hasRule, maxLength } = this.props;
		const { open, showRule } = this.state; 
		const eyeCls =classNames({
			'common-bg': true,
			'eyes': true,
			'eyes-open': open
		});		

		return (
			<div className="password-input">
				<Input 
					type={open ? 'text' : 'password'}
					maxLength={maxLength}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
				/>
				<div 
					className={eyeCls}
					onClick={this.handleChange}
				></div>
				{hasRule && showRule && value && <div className="password-rule-wrap">
					<PasswordRule 
						password={value}
					/>
				</div>}
			</div>
		)
		
	}
}

export default PasswordInput