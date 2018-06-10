import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default class SimpleChart extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        let SimpleChart = echarts.init(document.getElementById('SimpleChart'),'light',{width:'auto',height:'auto'});

        // 绘制图表
        SimpleChart.setOption({
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['周一', 83.1, 73.4, 55.1],
                    // ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['周二', 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        });
    };

    render () {
        return (
            <div id="SimpleChart" {...this.props}></div>
        );
    }
}