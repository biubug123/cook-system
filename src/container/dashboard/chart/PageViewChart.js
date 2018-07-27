import React from 'react';
import echarts from "echarts/lib/echarts";
// 引入线状图
import  'echarts/lib/chart/line';


let PageView,color,xAxis;
let xAxisData=[];
export default class PageViewChart extends React.Component {

    state={

    };
    pageViewSetOption=(xAxisData)=>{
        // 横轴
        xAxis={
            type: 'category',
            boundaryGap: false,
            data:xAxisData
        };
        // 绘制图表
        PageView.setOption({
            title: {
                text: '访问量趋势',
                textStyle:{
                    fontSize:18,
                }
            },
            grid: {
                left: '3%',
                bottom: '3%',
                containLabel: true
            },
            itemStyle: {
                // 设置颜色
                color: color,
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            tooltip: {
                trigger: 'axis'
            },

            xAxis: xAxis,
            yAxis: {
                type: 'value'
            },
            series: [{
                name:'访问量',
                type:'line',
                // step: 'middle',
                data:[220, 282, 201, 234, 290, 430, 410],
                areaStyle: {}
            }]
        });
    }
    componentDidMount=()=>{
        color='#9900ff';
        for(let i=1;i<=7;i++){
            xAxisData=["周一","周二","周三","周四","周五","周六","周日"]
        }
        // React.getDOMNode()
        // 基于准备好的dom，初始化echarts实例
        PageView = echarts.init(document.getElementById('PageView'),'default');
        this.pageViewSetOption(xAxisData);

    }

    componentDidUpdate= ()=> {
        //选择年月日
        const {pageviewvalue} = this.props;
        //根据周月年定义横轴数据
        if(pageviewvalue==="week"){
            color='#9900ff';
            for(let i=1;i<=7;i++){
                xAxisData=["周一","周二","周三","周四","周五","周六","周日"]
            }
        }else if(pageviewvalue === "month"){
            let date = new Date();
            date.setMonth(date.getMonth()+1);
            date.setDate(0);
            let lastDay = date.getDate();
            color="#4d79ff";
            for(let i=1;i<=lastDay;i++){
                xAxisData.push(i+"日");
            }
        }else if(pageviewvalue === "year"){
            for(let i=1;i<=12;i++){
                xAxisData.push(i+"月");
            }
            color="#00cc66";
        }
        this.pageViewSetOption(xAxisData);
    };



    render () {
        return (
            <div id="PageView" {...this.props}></div>
        );
    }
}