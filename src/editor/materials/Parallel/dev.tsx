import * as echarts from "echarts/core";
import {
  ParallelComponent,
  TitleComponent,
  TitleComponentOption,
} from "echarts/components";
import { ParallelChart, ParallelSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { useEffect, useRef } from "react";
import { useSize } from "ahooks";

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | ParallelSeriesOption
>;
/**
 * @description 平行坐标系图
 */
function Parallel({
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
    ParallelComponent,
    ParallelChart,
    CanvasRenderer,
  ]);

  const divRef = useRef<HTMLDivElement>(null);
  const [_, drag] = useDrag({
    type: "Parallel",
    item: {
      type: "Parallel",
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

export default Parallel;
