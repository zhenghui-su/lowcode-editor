export function optionsChange(options: any, axisData: any[], key?: string) {
  if (key === "radar") {
    const indicator = axisData[0];
    const seriesData = axisData[1];
    if (
      indicator &&
      seriesData &&
      indicator.length > 0 &&
      seriesData.length > 0
    ) {
      // @ts-ignore
      options.radar.indicator = indicator;
      // @ts-ignore
      options.series[0].data = seriesData;
    }
  } else if (axisData.length === 1) {
    const AxisData = axisData[0];
    if (AxisData && AxisData.length > 0) {
      // @ts-ignore
      options.series[0].data = AxisData;
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
      options.xAxis.data = xAxisData;
      // @ts-ignore
      options.series[0].data = YAxisData;
    }
  }
  return options;
}
