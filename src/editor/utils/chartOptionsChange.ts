export function optionsChange(options: any, axisData: any[]) {
  if (axisData.length === 1) {
    const AxisData = axisData[0];
    if (AxisData && AxisData.length > 0) {
      // @ts-ignore
      options.series[0].data = AxisData;
    }
  }
  if (axisData.length === 2) {
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
