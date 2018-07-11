import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/line';

export default class MarketChart extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        const {data} = this.props;
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        let marketChart = echarts.init(document.getElementById('marketChart'),'default');

        // 绘制图表
        marketChart.setOption({
            title: {
                text: '￥123,3123,321',
                textStyle:{
                    fontSize:24
                }
            },
            grid: {
                left: '3%',
                bottom: '3%',
                containLabel: true
            },
            itemStyle: {
                // 设置颜色
                color: '#ff99ff',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            tooltip: {
                trigger: 'axis'
            },

            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'销售额',
                type:'line',
                step: 'middle',
                data:data.data,
            }]
        });
    };

    render () {
        return (
            <div id="marketChart" {...this.props}></div>
        );
    }
}