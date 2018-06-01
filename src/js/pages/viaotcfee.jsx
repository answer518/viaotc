import React, { PureComponent } from 'react';

class ViaOtcFee extends PureComponent {

	static displayName = 'ViaOtcFee';

	constructor(props){
		super(props)
	};

	render(){

		return (
			<div className="protocol">
				<div className="protocol-head">
					<h1>ViaOTC费率说明</h1>
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
							<tr>
								<td>BTC</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.001BTC</td>								
							</tr>
							<tr>
								<td>BCC</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.0001BCC</td>								
							</tr>
							<tr>
								<td>ETH</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.01ETH</td>								
							</tr>
							<tr>
								<td>ETC</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.01ETC</td>								
							</tr>
							<tr>
								<td>LTC</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.001LTC</td>								
							</tr>
							<tr>
								<td>DASH</td>
								<td>0</td>
								<td>0</td>
								<td>0</td>
								<td>0.002DASH</td>								
							</tr>																																			
						</tbody>
					</table>
				</div>
			</div>	
		)
	}
}

export default ViaOtcFee				