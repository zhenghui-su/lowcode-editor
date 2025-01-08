import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { CommonComponentProps } from '../../interface';
import { useEffect, useRef } from 'react';

/**
 * @description 柱状图
 */
function Bar({
	id,
	options, // 外部传入的配置
	width,
	height,
	styles,
}: CommonComponentProps & {
	options: echarts.ComposeOption<GridComponentOption | BarSeriesOption>;
}) {
	echarts.use([GridComponent, BarChart, CanvasRenderer, UniversalTransition]);

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
			className='w-[100%]'
			style={{ width: '100%', height, display: 'inline-block', ...styles }} // 设置图表大小
		></div>
	);
}

export default Bar;
