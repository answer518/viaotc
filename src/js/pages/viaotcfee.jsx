import React, { PureComponent } from 'react';
import ajax from 'utils/request';

class ViaOtcFee extends PureComponent {

	static displayName = 'ViaOtcFee';

	constructor(props){
		super(props);
		this.state = {
			fees: []
		};
		this.getFees = this.getFees.bind(this)
	};

	componentDidMount(){
		this.getFees(); 
	}

	getFees () {
		ajax.get('/api/pc/withdraw_fee/get_fees')
			.then((response) =>{
				const { error, data } = response;
				if (error == 0) {
					const fees = [];
					for (var k in data) {
						fees.push({
							coin_type: k.toUpperCase(),
							recommend: data[k].recommend
						})
					}
					this.setState({fees}); 
				}
			})
	}

	render(){
		const { fees } = this.state;
		return (
			<div className="protocol">
				<div className="protocol-head">
					<h1>Bitdad费率说明</h1>
				</div>
				<div className="protocol-body">
					<table>
						<thead>
							<tr>
								<th></th>
								<th>出售</th>
								<th>购买</th>
								<th>充币</th>
								<th>提币</th>
							</tr>
						</thead>
						<tbody>
							{
								fees.map((fee, i) => {
									return (
										<tr key={i}>
											<td>{fee.coin_type}</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>{fee.recommend} {fee.coin_type}</td>								
										</tr>
									)
								})
							}		
						</tbody>
					</table>
				</div>
			</div>	
		)
	}
}

export default ViaOtcFee				