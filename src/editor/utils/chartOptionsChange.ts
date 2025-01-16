import { cloneDeep } from "lodash-es";

export function optionsChange(options: any, axisData: any[], key?: string) {
  // 不改变开发dev的options配置，要查看效果，通过预览查看
  const newOptions = cloneDeep(options);
  if (key === "radar") {
    const indicator = axisData[0];
    const seriesData = axisData[1];
    if (indicator && indicator.length > 0) {
      newOptions.radar.indicator = indicator;
    }
    if (seriesData && seriesData.length > 0) {
      newOptions.series[0].data = seriesData;
    }
  } else if (axisData.length === 1) {
    const AxisData = axisData[0];
    if (AxisData && AxisData.length > 0) {
      // @ts-ignore
      newOptions.series[0].data = AxisData;
    }
  } else if (axisData.length === 2) {
    const xAxisData = axisData[0];
    const YAxisData = axisData[1];
    if (
      xAxisData &&
      YAxisData &&
      xAxisData.length > 0 &&
      YAxisData.length > 0
    ) {
      // @ts-ignore
      newOptions.xAxis.data = xAxisData;
      // @ts-ignore
      newOptions.series[0].data = YAxisData;
    }
  }
  return newOptions;
}
