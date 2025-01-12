export function optionsChange(
  options: any,
  xAxisData: any[],
  YAxisData: any[]
) {
  if (xAxisData && YAxisData && xAxisData.length > 0 && YAxisData.length > 0) {
    // @ts-ignore
    options.xAxis.data = xAxisData;
    // @ts-ignore
    options.series[0].data = YAxisData;
  }
  return options;
}
