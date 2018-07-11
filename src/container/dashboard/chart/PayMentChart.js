import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default class PayMentChart extends React.Component {

    state={

    };

    componentWillMount () {
        // add event listeners (Flux Store, WebSocket, document, etc.)
    };

    componentDidMount () {
        const {data} = this.props;
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        let PayMentChart = echarts.init(document.getElementById('PayMentChart'),'light');

        // 绘制图表
        PayMentChart.setOption({
            title:{
                text:"6560",
                textStyle:{
                    fontSize:24
                }
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'支付笔数',
                    type:'bar',
                    barWidth: '60%',
                    data:data.data
                }
            ]
        });
    };

    render () {
        return (
            <div id="PayMentChart" {...this.props}></div>
        );
    }
}