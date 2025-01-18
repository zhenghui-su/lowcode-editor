import * as echarts from "echarts/core";
import {
  GridComponentOption,
  GridComponent,
  TitleComponent,
} from "echarts/components";
import { ScatterChart, ScatterSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { CommonComponentProps } from "../../interface";
import { useEffect, useRef } from "react";
import { useGetChartData } from "../../hooks/useGetChartData";
import { optionsChange } from "../../utils/chartOptionsChange";

/**
 * @description 散点图
 */
function Scatter({
  id,
  options, // 外部传入的配置
  scatterDataUrl,
  width,
  height,
  styles,
}: CommonComponentProps & {
  options: echarts.ComposeOption<GridComponentOption | ScatterSeriesOption>;
}) {
  echarts.use([
    GridComponent,
    TitleComponent,
    ScatterChart,
    CanvasRenderer,
    UniversalTransition,
  ]);

  const divRef = useRef<HTMLDivElement>(null);

  const { axisData, loading } = useGetChartData([scatterDataUrl], "scatter");
  useEffect(() => {
    if (divRef.current) {
      // 初始化图表
      const myChart = echarts.init(divRef.current);
      options = optionsChange(options, [axisData]);
      // 设置外部传入的配置
      myChart.setOption(options);

      // 清理函数，组件卸载时销毁图表
      return () => {
        myChart.dispose();
      };
    }
  }, [id, options, width, height, styles, axisData, loading]); // 当`id`或`chartOptions`变化时重新初始化图表

  return (
    <>
      {loading ? null : (
        <div
          ref={divRef}
          data-component-id={id}
          className="w-[100%]"
          style={{ width: "100%", height, display: "inline-block", ...styles }} // 设置图表大小
        ></div>
      )}
    </>
  );
}

export default Scatter;
