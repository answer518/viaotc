import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Textarea extends Component {

	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	};

	static propTypes = {

	};

	static defaultProps = {
		placeholder: "请输入申诉内容",
		limit: 200
	}

	handleChange(e){
		const { limit=0, onChange } = this.props;
		const value = e.target.value;

		const cutValue = limit > 0 ? (value.length > limit ? value.slice(0, limit) : value) : value;

		onChange && onChange(cutValue)
	}

	render(){
		const { onChange, value='', placeholder, limit } = this.props
		return (
			<div className="textarea-wrap">
				<textarea 
					className="textarea-input"
					onChange={this.handleChange}
					placeholder={placeholder}
					maxLength={limit}
				>
				</textarea>
				<span className="textarea-limit-number">{value.length}/{limit}</span>
			</div>
		)
		
	}
}

export default Textarea