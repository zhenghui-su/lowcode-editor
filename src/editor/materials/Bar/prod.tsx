import * as echarts from 'echarts/core';
import {
	GridComponent,
	GridComponentOption,
	TitleComponent,
	TooltipComponent,
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';
import { useGetChartData } from '../../hooks/useGetChartData';
import { optionsChange } from '../../utils/chartOptionsChange';
import { TooltipComponentOption } from 'echarts';

/**
 * @description 柱状图
 */
function Bar({
	id,
	options, // 外部传入的配置
	barXAxisUrl,
	barYAxisUrl,
	width,
	height,
	styles,
}: CommonComponentProps & {
	options: echarts.ComposeOption<
		GridComponentOption | TooltipComponentOption | BarSeriesOption
	>;
}) {
	echarts.use([
		GridComponent,
		TitleComponent,
		TooltipComponent,
		BarChart,
		CanvasRenderer,
		UniversalTransition,
	]);

	const divRef = useRef<HTMLDivElement>(null);

	const { xAxisData, YAxisData, loading } = useGetChartData(
		[barXAxisUrl, barYAxisUrl],
		'bar'
	);

	useEffect(() => {
		if (divRef.current) {
			// 初始化图表
			const myChart = echarts.init(divRef.current);
			// 如果有请求数据, 改变options
			options = optionsChange(options, [xAxisData, YAxisData]);
			// 设置外部传入的配置
			myChart.setOption(options);

			// 清理函数，组件卸载时销毁图表
			return () => {
				myChart.dispose();
			};
		}
	}, [id, options, width, height, styles, xAxisData, YAxisData, loading]); // 当`id`或`chartOptions`变化时重新初始化图表

	return (
		<>
			{loading ? null : (
				<div
					ref={divRef}
					data-component-id={id}
					className='w-[100%]'
					style={{ width: '100%', height, display: 'inline-block', ...styles }} // 设置图表大小
				></div>
			)}
		</>
	);
}

export default Bar;
