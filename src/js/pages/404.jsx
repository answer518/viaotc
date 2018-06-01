import React, { PureComponent } from 'react';
import { Link } from 'react-router';

class NotFound extends PureComponent {

	static displayName = 'NotFound';

	constructor(props){
		super(props)
	};

	render(){

		return (
			<div className="protocol">
				<div className="not-found-wrap">
					<div className="not-found-img"></div>
					<p>您访问的页面不存在</p>
					<Link to="/app"className="back-btn">返回首页</Link>
				</div>
			</div>	
		)
	}
}

export default NotFound;				