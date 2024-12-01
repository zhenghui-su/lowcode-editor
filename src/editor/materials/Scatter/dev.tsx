import * as echarts from 'echarts/core';
import { GridComponentOption, GridComponent } from 'echarts/components';
import { ScatterChart, ScatterSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';
import { useEffect, useRef } from 'react';

/**
 * @description 散点图
 */
function Scatter({
	id,
	options, // 外部传入的配置
	width,
	height,
	styles,
}: CommonComponentProps & {
	options: echarts.ComposeOption<GridComponentOption | ScatterSeriesOption>;
}) {
	echarts.use([
		GridComponent,
		ScatterChart,
		CanvasRenderer,
		UniversalTransition,
	]);

	const divRef = useRef<HTMLDivElement>(null);
	const [_, drag] = useDrag({
		type: 'Scatter',
		item: {
			type: 'Scatter',
			dragType: 'move',
			id: id,
		},
	});

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

	useEffect(() => {
		// 应用拖拽功能
		drag(divRef);
	}, [drag]); // 只有在`drag`函数变化时重新运行此效果

	return (
		<div
			ref={divRef}
			data-component-id={id}
			style={{ width, height, display: 'inline-block', ...styles }} // 设置图表大小
		></div>
	);
}

export default Scatter;
