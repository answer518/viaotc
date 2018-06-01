import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import ajax from 'utils/request';

const Option = Select.Option;

class TypeSelect extends Component {

	static displayName = 'TypeSelect';

	constructor(props){
		super(props);
	};

	static propTypes = {

	};

	static defaultProps={
		width: 70
	};

	renderOptions(){
		const { types } = this.props;
		return types.map((coin, i) => {
			const { name, id } = coin;
			return <Option value={id} key={id}>{name}</Option>
		});
	}

	render(){
		const { onChange, value, width } = this.props;

		return (
			<div>
				<Select 
					value={value}
					style={{width}}
					onChange={onChange}
				>
					{this.renderOptions()}
				</Select>
			</div>
		)
		
	}
}

export default TypeSelect