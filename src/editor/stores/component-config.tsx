import { create } from "zustand";
import ContainerDev from "../materials/Container/dev";
import ContainerProd from "../materials/Container/prod";
import ButtonDev from "../materials/Button/dev";
import ButtonProd from "../materials/Button/prod";
import ModalDev from "../materials/Modal/dev";
import ModalProd from "../materials/Modal/prod";
import PageDev from "../materials/Page/dev";
import PageProd from "../materials/Page/prod";
import TableDev from "../materials/Table/dev";
import TableProd from "../materials/Table/prod";
import TableColumnDev from "../materials/TableColumn/dev";
import TableColumnProd from "../materials/TableColumn/prod";
import FormDev from "../materials/Form/dev";
import FormProd from "../materials/Form/prod";
import FormItemDev from "../materials/FormItem/dev";
import FormItemProd from "../materials/FormItem/prod";
import LineDev from "../materials/Line/dev";
import LineProd from "../materials/Line/prod";
import BarDev from "../materials/Bar/dev";
import BarProd from "../materials/Bar/prod";
import PieDev from "../materials/Pie/dev";
import PieProd from "../materials/Pie/prod";
import ScatterDev from "../materials/Scatter/dev";
import ScatterProd from "../materials/Scatter/prod";
import RadarDev from "../materials/Radar/dev";
import RadarProd from "../materials/Radar/prod";
import HeatMapDev from "../materials/Heatmap/dev";
import HeatMapProd from "../materials/Heatmap/prod";

/**
 * 组件属性表单配置
 */
export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}
/**
 * 组件事件
 */
export interface ComponentEvent {
  name: string;
  label: string;
}
/**
 * 组件方法配置-用于组件联动
 */
export interface ComponentMethod {
  name: string;
  label: string;
}
/**
 * 组件配置
 */
export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>;
  desc: string;
  setter?: ComponentSetter[]; // 属性配置
  stylesSetter?: ComponentSetter[]; // 样式配置
  events?: ComponentEvent[]; // 事件配置
  methods?: ComponentMethod[]; // 方法配置
  dev: any;
  prod: any;
}
// 组件映射配置
// key: 组件名 value: 组件配置(包括组件实例、默认参数)
interface State {
  componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
  registerConfig: (name: string, componentConfig: ComponentConfig) => void;
}
/**
 * 组件配置 store
 */
export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: "Button",
      defaultProps: {
        type: "primary",
        text: "按钮",
      },
      setter: [
        {
          name: "type",
          label: "按钮类型",
          type: "select",
          options: [
            { label: "主按钮", value: "primary" },
            { label: "次按钮", value: "default" },
          ],
        },
        {
          name: "text",
          label: "文本",
          type: "input",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
      events: [
        {
          name: "onClick",
          label: "点击事件",
        },
        {
          name: "onDoubleClick",
          label: "双击事件",
        },
      ],
      desc: "按钮",
      dev: ButtonDev,
      prod: ButtonProd,
    },
    Modal: {
      name: "Modal",
      defaultProps: {
        title: "弹窗",
      },
      setter: [
        {
          name: "title",
          label: "标题",
          type: "input",
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: "onOpen",
          label: "确认事件",
        },
        {
          name: "onClose",
          label: "取消事件",
        },
      ],
      methods: [
        {
          name: "open",
          label: "打开弹窗",
        },
        {
          name: "close",
          label: "关闭弹窗",
        },
      ],
      desc: "弹窗",
      dev: ModalDev,
      prod: ModalProd,
    },
    Page: {
      name: "Page",
      defaultProps: {},
      desc: "页面",
      dev: PageDev,
      prod: PageProd,
    },
    Table: {
      name: "Table",
      defaultProps: {},
      desc: "表格",
      setter: [
        {
          name: "url",
          label: "url",
          type: "input",
        },
      ],
      dev: TableDev,
      prod: TableProd,
    },
    TableColumn: {
      name: "TableColumn",
      defaultProps: {
        dataIndex: `col_${new Date().getTime()}`,
        title: "列名",
      },
      desc: "表格列",
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            {
              label: "文本",
              value: "text",
            },
            {
              label: "日期",
              value: "date",
            },
          ],
        },
        {
          name: "title",
          label: "标题",
          type: "input",
        },
        {
          name: "dataIndex",
          label: "字段",
          type: "input",
        },
      ],
      dev: TableColumnDev,
      prod: TableColumnProd,
    },
    Form: {
      name: "Form",
      defaultProps: {},
      desc: "表单",
      setter: [
        {
          name: "title",
          label: "标题",
          type: "input",
        },
      ],
      events: [
        {
          name: "onFinish",
          label: "提交事件",
        },
      ],
      methods: [
        {
          name: "submit",
          label: "提交",
        },
      ],
      dev: FormDev,
      prod: FormProd,
    },
    FormItem: {
      name: "FormItem",
      desc: "表单项",
      defaultProps: {
        // TODO ? 解决传入字段name重复问题
        // name: new Date().getTime(),
        label: "默认标题",
        type: "input",
      },
      dev: FormItemDev,
      prod: FormItemProd,
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            {
              label: "文本",
              value: "input",
            },
            {
              label: "日期",
              value: "date",
            },
          ],
        },
        {
          name: "label",
          label: "标题",
          type: "input",
        },
        {
          name: "name",
          label: "字段",
          type: "input",
          required: true,
        },
        {
          name: "rules",
          label: "校验",
          type: "select",
          options: [
            {
              label: "必填",
              value: "required",
            },
          ],
        },
      ],
    },
    // TODO更多属性编辑
    Line: {
      name: "Line",
      defaultProps: {
        height: "400px",
        options: {
          title: {
            text: "折线图",
          },
          xAxis: {
            type: "category",
            boundaryGap: true,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: "line",
              smooth: false,
              areaStyle: {
                opacity: 0,
              },
            },
          ],
        },
      },
      desc: "折线图",
      dev: LineDev,
      prod: LineProd,
      setter: [
        {
          name: "text",
          label: "正标题",
          type: "input",
        },
        {
          name: "subtext",
          label: "副标题",
          type: "input",
        },
        {
          name: "left",
          label: "标题位置",
          type: "select",
          options: [
            {
              label: "居左",
              value: "left",
            },
            {
              label: "居中",
              value: "center",
            },
            {
              label: "居右",
              value: "right",
            },
          ],
        },
        {
          name: "smooth",
          label: "平滑",
          type: "switch",
        },
        {
          name: "areaStyleOpacity",
          label: "面积图透明度",
          type: "slider",
        },
        {
          name: "boundaryGap",
          label: "边界间隔",
          type: "switch",
        },
        {
          name: "lineXAxisUrl",
          label: "X轴数据请求",
          type: "input",
        },
        {
          name: "lineYAxisUrl",
          label: "y轴数据请求",
          type: "input",
        },
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
    Bar: {
      name: "Bar",
      defaultProps: {
        height: "400px",
        options: {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: false,
            },
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: "bar",
            },
          ],
        },
      },
      desc: "柱状图",
      dev: BarDev,
      prod: BarProd,
      setter: [
        {
          name: "alignWithLabel",
          label: "轴刻度对齐标签",
          type: "switch",
        },
        {
          name: "barXAxisUrl",
          label: "X轴数据请求",
          type: "input",
        },
        {
          name: "barYAxisUrl",
          label: "y轴数据请求",
          type: "input",
        },
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
    Pie: {
      name: "Pie",
      defaultProps: {
        height: "400px",
        options: {
          title: {
            text: "Referer of a Website",
            subtext: "Fake Data",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "50%",
              data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
      },
      desc: "饼图",
      dev: PieDev,
      prod: PieProd,
      setter: [
        {
          name: "text",
          label: "正标题",
          type: "input",
        },
        {
          name: "subtext",
          label: "副标题",
          type: "input",
        },
        {
          name: "left",
          label: "标题位置",
          type: "select",
          options: [
            {
              label: "居左",
              value: "left",
            },
            {
              label: "居中",
              value: "center",
            },
            {
              label: "居右",
              value: "right",
            },
          ],
        },
        {
          name: "pieDataUrl",
          label: "饼图数据请求",
          type: "input",
        },
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
    Scatter: {
      name: "Scatter",
      desc: "散点图",
      defaultProps: {
        height: "400px",
        options: {
          xAxis: {},
          yAxis: {},
          series: [
            {
              symbolSize: 20,
              data: [
                [10.0, 8.04],
                [8.07, 6.95],
                [13.0, 7.58],
                [9.05, 8.81],
                [11.0, 8.33],
                [14.0, 7.66],
                [13.4, 6.81],
                [10.0, 6.33],
                [14.0, 8.96],
                [12.5, 6.82],
                [9.15, 7.2],
                [11.5, 7.2],
                [3.03, 4.23],
                [12.2, 7.83],
                [2.02, 4.47],
                [1.05, 3.33],
                [4.05, 4.96],
                [6.03, 7.24],
                [12.0, 6.26],
                [12.0, 8.84],
                [7.08, 5.82],
                [5.02, 5.68],
              ],
              type: "scatter",
            },
          ],
        },
      },
      dev: ScatterDev,
      prod: ScatterProd,
      setter: [
        {
          name: "scatterDataUrl",
          label: "散点图数据请求",
          type: "input",
        },
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
    Radar: {
      name: "Radar",
      desc: "雷达图",
      defaultProps: {
        height: "400px",
        options: {
          title: {
            text: "Basic Radar Chart",
          },
          legend: {
            data: ["Allocated Budget", "Actual Spending"],
          },
          radar: {
            // shape: 'circle',
            indicator: [
              { name: "Sales", max: 6500 },
              { name: "Administration", max: 16000 },
              { name: "Information Technology", max: 30000 },
              { name: "Customer Support", max: 38000 },
              { name: "Development", max: 52000 },
              { name: "Marketing", max: 25000 },
            ],
          },
          series: [
            {
              name: "Budget vs spending",
              type: "radar",
              data: [
                {
                  value: [4200, 3000, 20000, 35000, 50000, 18000],
                  name: "Allocated Budget",
                },
                {
                  value: [5000, 14000, 28000, 26000, 42000, 21000],
                  name: "Actual Spending",
                },
              ],
            },
          ],
        },
      },
      dev: RadarDev,
      prod: RadarProd,
      setter: [
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
    HeatMap: {
      name: "HeatMap",
      desc: "热力图",
      defaultProps: {
        height: "400px",
        options: {
          tooltip: {
            position: "top",
          },
          grid: {
            height: "50%",
            top: "10%",
          },
          xAxis: {
            type: "category",
            data: [
              "12a",
              "1a",
              "2a",
              "3a",
              "4a",
              "5a",
              "6a",
              "7a",
              "8a",
              "9a",
              "10a",
              "11a",
              "12p",
              "1p",
              "2p",
              "3p",
              "4p",
              "5p",
              "6p",
              "7p",
              "8p",
              "9p",
              "10p",
              "11p",
            ],
            splitArea: {
              show: true,
            },
          },
          yAxis: {
            type: "category",
            data: [
              "Saturday",
              "Friday",
              "Thursday",
              "Wednesday",
              "Tuesday",
              "Monday",
              "Sunday",
            ],
            splitArea: {
              show: true,
            },
          },
          visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: "15%",
          },
          series: [
            {
              name: "Punch Card",
              type: "heatmap",
              data: [
                [0, 0, 5],
                [0, 1, 1],
                [0, 2, 0],
                [0, 3, 0],
                [0, 4, 0],
                [0, 5, 0],
                [0, 6, 0],
                [0, 7, 0],
                [0, 8, 0],
                [0, 9, 0],
                [0, 10, 0],
                [0, 11, 2],
                [0, 12, 4],
                [0, 13, 1],
                [0, 14, 1],
                [0, 15, 3],
                [0, 16, 4],
                [0, 17, 6],
                [0, 18, 4],
                [0, 19, 4],
                [0, 20, 3],
                [0, 21, 3],
                [0, 22, 2],
                [0, 23, 5],
                [1, 0, 7],
                [1, 1, 0],
                [1, 2, 0],
                [1, 3, 0],
                [1, 4, 0],
                [1, 5, 0],
                [1, 6, 0],
                [1, 7, 0],
                [1, 8, 0],
                [1, 9, 0],
                [1, 10, 5],
                [1, 11, 2],
                [1, 12, 2],
                [1, 13, 6],
                [1, 14, 9],
                [1, 15, 11],
                [1, 16, 6],
                [1, 17, 7],
                [1, 18, 8],
                [1, 19, 12],
                [1, 20, 5],
                [1, 21, 5],
                [1, 22, 7],
                [1, 23, 2],
                [2, 0, 1],
                [2, 1, 1],
                [2, 2, 0],
                [2, 3, 0],
                [2, 4, 0],
                [2, 5, 0],
                [2, 6, 0],
                [2, 7, 0],
                [2, 8, 0],
                [2, 9, 0],
                [2, 10, 3],
                [2, 11, 2],
                [2, 12, 1],
                [2, 13, 9],
                [2, 14, 8],
                [2, 15, 10],
                [2, 16, 6],
                [2, 17, 5],
                [2, 18, 5],
                [2, 19, 5],
                [2, 20, 7],
                [2, 21, 4],
                [2, 22, 2],
                [2, 23, 4],
                [3, 0, 7],
                [3, 1, 3],
                [3, 2, 0],
                [3, 3, 0],
                [3, 4, 0],
                [3, 5, 0],
                [3, 6, 0],
                [3, 7, 0],
                [3, 8, 1],
                [3, 9, 0],
                [3, 10, 5],
                [3, 11, 4],
                [3, 12, 7],
                [3, 13, 14],
                [3, 14, 13],
                [3, 15, 12],
                [3, 16, 9],
                [3, 17, 5],
                [3, 18, 5],
                [3, 19, 10],
                [3, 20, 6],
                [3, 21, 4],
                [3, 22, 4],
                [3, 23, 1],
                [4, 0, 1],
                [4, 1, 3],
                [4, 2, 0],
                [4, 3, 0],
                [4, 4, 0],
                [4, 5, 1],
                [4, 6, 0],
                [4, 7, 0],
                [4, 8, 0],
                [4, 9, 2],
                [4, 10, 4],
                [4, 11, 4],
                [4, 12, 2],
                [4, 13, 4],
                [4, 14, 4],
                [4, 15, 14],
                [4, 16, 12],
                [4, 17, 1],
                [4, 18, 8],
                [4, 19, 5],
                [4, 20, 3],
                [4, 21, 7],
                [4, 22, 3],
                [4, 23, 0],
                [5, 0, 2],
                [5, 1, 1],
                [5, 2, 0],
                [5, 3, 3],
                [5, 4, 0],
                [5, 5, 0],
                [5, 6, 0],
                [5, 7, 0],
                [5, 8, 2],
                [5, 9, 0],
                [5, 10, 4],
                [5, 11, 1],
                [5, 12, 5],
                [5, 13, 10],
                [5, 14, 5],
                [5, 15, 7],
                [5, 16, 11],
                [5, 17, 6],
                [5, 18, 0],
                [5, 19, 5],
                [5, 20, 3],
                [5, 21, 4],
                [5, 22, 2],
                [5, 23, 0],
                [6, 0, 1],
                [6, 1, 0],
                [6, 2, 0],
                [6, 3, 0],
                [6, 4, 0],
                [6, 5, 0],
                [6, 6, 0],
                [6, 7, 0],
                [6, 8, 0],
                [6, 9, 0],
                [6, 10, 1],
                [6, 11, 0],
                [6, 12, 2],
                [6, 13, 1],
                [6, 14, 3],
                [6, 15, 4],
                [6, 16, 0],
                [6, 17, 0],
                [6, 18, 0],
                [6, 19, 0],
                [6, 20, 1],
                [6, 21, 2],
                [6, 22, 2],
                [6, 23, 6],
              ].map(function (item) {
                return [item[1], item[0], item[2] || "-"];
              }),
              label: {
                show: true,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
      },
      dev: HeatMapDev,
      prod: HeatMapProd,
      setter: [
        {
          name: "options",
          label: "Echarts配置",
          type: "json",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
    },
  },
  registerConfig: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
