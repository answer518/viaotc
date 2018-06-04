import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlockExpandable from 'components/blockExpandable';
import ajax from 'utils/request';

class CoinsInfoArea extends Component {

	static displayName = 'CoinsInfoArea';

	constructor(props){
		super(props);
		this.state = {
			blocks: []
		};
		this.getCoins = this.getCoins.bind(this);
		this.timer = null;
	}

	componentDidMount(){
		this.getCoins();
	}

	componentWillUnmount(){
		if (this.timer) {clearTimeout(this.timer)}
	}

	getCoins(){
		if (this.timer) {clearTimeout(this.timer)}
		ajax.get('/api/pc/market',{}, 2)
			.then((response) => {
				const { msg, data } = response;
				if (msg.toLowerCase() == 'ok'){
					this.setState({blocks: data});
				}
			});
		this.timer = setTimeout(() => {
			this.getCoins();
		}, 2000);
	}

	render(){

		const { blocks } = this.state;

		return (
			<div className="coins-info-area">
					<BlockExpandable 
						blocks = {blocks}
				        url="/api/pc/deals/deal_list"
					/>
			</div>
		)
		
	}
}

export default CoinsInfoArea;