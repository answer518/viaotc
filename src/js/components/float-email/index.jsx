import React, { PureComponent } from 'react';
import './index.less';

class Footer extends PureComponent {

    static displayName = 'Footer';

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="float-email"></div>
        )
    }
}

export default Footer;