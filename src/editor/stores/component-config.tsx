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
        width: "700px",
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
          name: "title",
          label: "标题",
          type: "input",
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
        width: "700px",
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
        width: "700px",
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
        width: "700px",
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
        width: "700px",
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
