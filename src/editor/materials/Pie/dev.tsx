import * as echarts from "echarts/core";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { useEffect, useRef } from "react";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useSize } from "ahooks";
type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;
/**
 * @description 饼图
 */
function Pie({
  id,
  options, // 外部传入的配置
  width,
  height,
  styles,
}: CommonComponentProps & {
  options: EChartsOption;
}) {
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
  ]);

  const divRef = useRef<HTMLDivElement>(null);
  const [_, drag] = useDrag({
    type: "Pie",
    item: {
      type: "Pie",
      dragType: "move",
      id: id,
    },
  });
  // 拖拽改变大小时实时改变图表宽度
  const size = useSize(divRef);
  useEffect(() => {
    if (divRef.current) {
      // 初始化图表
      const myChart = echarts.init(divRef.current);

      // 设置外部传入的配置
      myChart.setOption(options);
      myChart.resize();
      // 清理函数，组件卸载时销毁图表
      return () => {
        myChart.dispose();
      };
    }
  }, [id, options, width, height, styles, size?.width]); // 当`id`或`chartOptions`变化时重新初始化图表

  useEffect(() => {
    // 应用拖拽功能
    drag(divRef);
  }, [drag]); // 只有在`drag`函数变化时重新运行此效果

  return (
    <div
      ref={divRef}
      data-component-id={id}
      className="w-[100%]"
      style={{ width: "100%", height, display: "inline-block", ...styles }} // 设置图表大小
    ></div>
  );
}

export default Pie;
