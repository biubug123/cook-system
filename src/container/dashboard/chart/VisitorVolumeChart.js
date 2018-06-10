import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/line';

export default class VisitorVolumeChart extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        let VisitorVolume = echarts.init(document.getElementById('VisitorVolume'),'light',{width:'auto',height:'auto'});

        // 绘制图表
        VisitorVolume.setOption({
            itemStyle: {
                // 设置颜色
                color: '#ff99ff',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            // dataset:{
            //     // 提供一份数据。
            //     source: [
            //         ['product','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            //         [820, 932, 901, 934, 1290, 1330, 1320]
            //     ]
            // },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {
                }
            }]
        });
    };

    render () {
        return (
            <div id="VisitorVolume" {...this.props}></div>
        );
    }
}