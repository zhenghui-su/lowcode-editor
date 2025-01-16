import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { RadarChart, RadarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { CommonComponentProps } from "../../interface";
import { useEffect, useRef } from "react";
import { useGetChartData } from "../../hooks/useGetChartData";
import { optionsChange } from "../../utils/chartOptionsChange";

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | LegendComponentOption | RadarSeriesOption
>;
/**
 * @description 雷达图
 */
function Radar({
  id,
  options, // 外部传入的配置
  radarIndicatorUrl,
  radarDataUrl,
  width,
  height,
  styles,
}: CommonComponentProps & {
  options: EChartsOption;
}) {
  echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);

  const divRef = useRef<HTMLDivElement>(null);

  const { radarIndicator, radarSeriesData, loading } = useGetChartData(
    [radarIndicatorUrl, radarDataUrl],
    "radar"
  );

  useEffect(() => {
    if (divRef.current) {
      // 初始化图表
      const myChart = echarts.init(divRef.current);
      options = optionsChange(
        options,
        [radarIndicator, radarSeriesData],
        "radar"
      );
      // 设置外部传入的配置
      myChart.setOption(options);

      // 清理函数，组件卸载时销毁图表
      return () => {
        myChart.dispose();
      };
    }
  }, [
    id,
    options,
    width,
    height,
    styles,
    radarIndicator,
    radarSeriesData,
    loading,
  ]); // 当`id`或`chartOptions`变化时重新初始化图表

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

export default Radar;
