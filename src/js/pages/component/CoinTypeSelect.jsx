import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import ajax from 'utils/request';

const Option = Select.Option;

class CoinTypeSelect extends Component {

	static displayName = 'CoinTypeSelect';

	constructor(props){
		super(props);
		this.state = {
			coins: props.all ? [{name: '币种', id: ''}] : []
		};
		this.getCoinTypes = this.getCoinTypes.bind(this);
	};

	static propTypes = {

	};

	static defaultProps = {
		all: true,
		width: 70
	};

	componentDidMount(){
		this.getCoinTypes();
	}

	getCoinTypes(){
		ajax.get('/api/pc/market/coin_type')
			.then((response) => {
				const { error, data } = response;
				if (error == 0) {
					const coins = data.map((coin) => {return {name: coin.toUpperCase(), id: coin}});
					this.setState((prev) => {
						const copy = prev.coins.slice();
						return {coins: copy.concat(coins)};
					});
				}
			})
	}

	renderOptions(){
		const { coins } = this.state;
		return coins.map((coin, i) => {
			const { name, id } = coin;
			return <Option value={id} key={id}>{name}</Option>
		});
	}

	render(){
		const { onChange, onSelect, value, width, disabled } = this.props;

		return (
			<div>
				<Select 
					value={value}
					style={{width}}
					onChange={onChange}
					onSelect={onSelect}
					disabled={disabled}
				>
					{this.renderOptions()}
				</Select>
			</div>
		)
		
	}
}

export default CoinTypeSelect