import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/line';

export default class SearchUserChart extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        const {data} = this.props;
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        let searchUserChart = echarts.init(document.getElementById('searchUserChart'),'default');

        // 绘制图表
        searchUserChart.setOption({
            grid: {
                left: '1%',
                bottom: '3%',
                containLabel: true
            },
            itemStyle: {
                // 设置颜色
                color:"#99bbff",
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            tooltip: {
                trigger: 'axis'
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'搜索用户数',
                type:'line',
                data:data.data,
                smooth: true,
                areaStyle: {}
            }]
        });
    };

    render () {
        return (
            <div id="searchUserChart" {...this.props}></div>
        );
    }
}