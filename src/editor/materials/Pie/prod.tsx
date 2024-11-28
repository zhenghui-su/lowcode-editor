import * as echarts from 'echarts/core';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';
import {
	TitleComponent,
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	LegendComponent,
	LegendComponentOption,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
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

	useEffect(() => {
		if (divRef.current) {
			// 初始化图表
			const myChart = echarts.init(divRef.current);

			// 设置外部传入的配置
			myChart.setOption(options);

			// 清理函数，组件卸载时销毁图表
			return () => {
				myChart.dispose();
			};
		}
	}, [id, options, width, height, styles]); // 当`id`或`chartOptions`变化时重新初始化图表

	return (
		<div
			ref={divRef}
			data-component-id={id}
			style={{ width, height, display: 'inline-block', ...styles }} // 设置图表大小
		></div>
	);
}

export default Pie;
