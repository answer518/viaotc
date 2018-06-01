import React, { PropTypes, Component } from 'react';
import BlockExpandable from 'components/blockExpandable';

class Test extends Component {

	static displayName = 'Test';

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="test-wrap">
				<BlockExpandable 
					blocks = {[
			            {
			                type: 'btc',
			                exchange: 'usdt',
			                price: 50123.6,
			                percent: 4.56,
			                src: 1
			            },
			            {
			                type: 'eth',
			                exchange: 'usdt',
			                price: 50302.86,
			                percent: -2.48,
			                src: 2
			            },
			            {
			                type: 'ltc',
			                exchange: 'usdt',
			                price: 47024.65,
			                percent: -3.36,
			                src: 3
			            },
			            {
			                type: 'bcc',
			                exchange: 'usdt',
			                price: 48676.15,
			                percent: 1.24,
			                src: 4
			            }																							
			        ]}
			        url="/api/ad"
			        param={{type: 'btc'}}
				/>
			</div>
		)
	}
}

export default Test;