import * as echarts from "echarts/core";
import { GridComponent, GridComponentOption } from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { CommonComponentProps } from "../../interface";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { message } from "antd";

/**
 * @description 折线图
 */
function Line({
  id,
  options, // 外部传入的配置
  lineXAxisUrl,
  lineYAxisUrl,
  width,
  height,
  styles,
}: CommonComponentProps & {
  options: echarts.ComposeOption<GridComponentOption | LineSeriesOption>;
}) {
  echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

  const divRef = useRef<HTMLDivElement>(null);

  const [xAxisData, setXAxisData] = useState<any[]>([]);
  const [YAxisData, setYAxisData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (lineXAxisUrl && lineYAxisUrl) {
      setLoading(true);
      message.open({
        type: "loading",
        content: "加载数据中",
        duration: 0,
        key: "line",
      });
      const { data: xAxisData } = await axios.get(lineXAxisUrl);
      const { data: YAxisData } = await axios.get(lineYAxisUrl);
      setXAxisData(xAxisData);
      setYAxisData(YAxisData);
      message.destroy("line");
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (divRef.current) {
      // 初始化图表
      const myChart = echarts.init(divRef.current);

      // 设置外部传入的配置
      if (
        xAxisData &&
        xAxisData.length > 0 &&
        YAxisData &&
        YAxisData.length > 0
      ) {
        // @ts-ignore
        options.xAxis.data = xAxisData;
        // @ts-ignore
        options.series[0].data = YAxisData;
      }
      myChart.setOption(options);
      // 清理函数，组件卸载时销毁图表
      return () => {
        myChart.dispose();
      };
    }
  }, [id, options, width, height, styles, xAxisData, YAxisData]); // 当`id`或`chartOptions`变化时重新初始化图表

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

export default Line;
