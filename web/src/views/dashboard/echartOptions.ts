import { EChartsOption } from "echarts";
export const lineOptions: EChartsOption = {
  title: {
    text: "每月销售额",
    left: "center",
  },
  xAxis: {
    data: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    boundaryGap: false,
    axisTick: {
      show: false,
    },
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    top: 80,
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
    padding: [5, 10],
  },
  yAxis: {
    axisTick: {
      show: false,
    },
  },
  legend: {
    data: ["预计", "实际"],
    top: 50,
  },
  series: [
    {
      name: "预计",
      smooth: true,
      type: "line",
      data: [100, 120, 161, 134, 105, 160, 165, 114, 163, 185, 118, 123],
      animationDuration: 2800,
      animationEasing: "cubicInOut",
    },
    {
      name: "实际",
      smooth: true,
      type: "line",
      itemStyle: {},
      data: [120, 82, 91, 154, 162, 140, 145, 250, 134, 56, 99, 123],
      animationDuration: 2800,
      animationEasing: "quadraticOut",
    },
  ],
};
export const pieOptions: EChartsOption = {
  title: {
    text: "用户访问来源",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
  },
  series: [
    {
      name: "用户访问来源",
      type: "pie",
      radius: "55%",
      center: ["50%", "50%"],
      data: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" },
      ],
    },
  ],
};
export const barOptions: EChartsOption = {
  title: {
    text: "每周用户活跃量",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20,
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "活跃量",
      data: [13253, 34235, 26321, 12340, 24643, 1322, 1324],
      type: "bar",
    },
  ],
};
export const radarOption: EChartsOption = {
  title: {
    text: "考核指标",
    left: "center",
  },
  legend: {
    data: ["个人", "团队"],
    orient: "vertical",
    left: "left",
    top: "center"
  },
  radar: {
    // shape: 'circle',
    center: ['50%', '60%'],
    indicator: [
      { name: '引用', max: 100 },
      { name: '贡献', max: 100 },
      { name: '热度', max: 100 },
      { name: '产量', max: 100 },
      { name: '关注', max: 100 },
    ],
  },
  series: [
    {
      name: `xxx指数`,
      type: "radar",
      data: [
        {
          value: [42, 30, 20, 35, 80],
          name: "个人",
        },
        {
          value: [50, 60, 29, 100, 90],
          name: "团队",
        },
      ],
    },
  ],
};
