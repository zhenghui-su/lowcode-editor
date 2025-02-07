import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
} from "echarts/components";
import { GaugeChart, GaugeSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { CommonComponentProps } from "../../interface";
import { useEffect, useRef } from "react";
import { useSize } from "ahooks";

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | GaugeSeriesOption | TooltipComponentOption
>;
/**
 * @description 仪表盘
 */
function Pressure({
  id,
  options, // 外部传入的配置
  width,
  height,
  styles,
}: CommonComponentProps & {
  options: EChartsOption;
}) {
  echarts.use([TitleComponent, TooltipComponent, GaugeChart, CanvasRenderer]);

  const divRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={divRef}
      data-component-id={id}
      className="w-[100%]"
      style={{ width: "100%", height, display: "inline-block", ...styles }} // 设置图表大小
    ></div>
  );
}

export default Pressure;
