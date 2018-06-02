import React, { Component } from 'react';
import classNames from 'classnames';
import DealInfo from './DealInfo';

class CoinList extends Component {

	static displayName = "CoinList";

	constructor(props){
		super(props);
		this.state = {
			active: -1
		};
		this.handleItemClick = this.handleItemClick.bind(this);
	}

    static defaultProps = {
        lists: []
    };	

	handleItemClick(item, index){
		this.setState((prev) => {
			return {active: prev.active === index ? -1 : index}
		});
	}

	sliceArray(data){
		let result = [];
		for(var i=0,len=data.length;i<len;i+=2){
		   result.push(data.slice(i,i+2));
		}	
		return result;	
	}

	renderBlocks(lists){
		const { active } = this.state;
		const data = this.sliceArray(lists);

		return data.map((d, i) => {
			const len = d.length;
			const items = d.map((item, j) => {
				const indexKey = i*len+j;
				const { type, exchange, price, percent } = item;
				const cls = classNames({
					'coin-list-item': true,
					'clearfix': true,
					'coin-list-item-active': indexKey === active
				});
				const trendCls = classNames({
					'coin-price-trend': true,
					'coin-price-up': percent > 0,
					'coin-price-down': percent < 0
				});

				return (
					<div 
						key={`${i}-${j}`}
						className={cls}
						onClick={this.handleItemClick.bind(this, item, indexKey)}
					>
						<img src={`../../src/img/icon${i+1}.png`} />
						<div className="coin-exchange-info">
							<span>{type.toUpperCase()}</span>
							<span className="exchange-unit">/{exchange}</span> 
						</div>
						<div className="coin-info">
							<div className="coin-price">{price}</div>
							<div className={trendCls}>{`${percent}%`}</div>
						</div>
					</div>
				)

			});

			return (<div 
						className="coin-data-contianer"
						key={i}
					>
					<div className="coin-data-item clearfix">{items}</div>
					{i*len == active && <DealInfo />}
					{i*len+1 == active && <DealInfo />}
			</div>)
		});
	}

	render(){
		const { lists=[] } = this.props;

		return (
			<div className="CoinList clearfix">
				{this.renderBlocks(lists)}
			</div>
		)
	}
}

export default CoinList;