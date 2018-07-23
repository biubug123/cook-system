import React from 'react';
import PublicBreadcrumb from '../../component/public/PublicBreadcrumb'

export default class  extends React.Component {

    state={
    
    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        // React.getDOMNode()
    };

    render () {
        return (
            <div>
                <PublicBreadcrumb menu="表格" item="常规"/>
            </div>
        );
    }
}