import { CommonComponentProps } from '../../interface';
import VMind from '@visactor/vmind';
import VChart from '@visactor/vchart';
import { useDrag } from 'react-dnd';
import { useEffect, useRef } from 'react';
import { useSize } from 'ahooks';

/**
 * @description ai生成图表
 */
function AIChart({
	id,
	url,
	model,
	apiKey,
	csvData,
	spec,
	width,
	height,
	styles,
}: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const [_, drag] = useDrag({
		type: 'AIChart',
		item: {
			type: 'AIChart',
			dragType: 'move',
			id: id,
		},
	});
	// 拖拽改变大小时实时改变图表宽度
	const size = useSize(divRef);
	// const vmind = new VMind({
	// 	url, //指定你的大模型服务url。default is https://api.openai.com/v1/chat/completions
	// 	model: model, //指定你指定的模型
	// 	headers: {
	// 		Authorization: `Bearer ${apiKey}`, //Your DEEPSEEK_KEY
	// 	},
	// });
	// const { fieldInfo, dataset } = vmind.parseCSVData(csvData);
	// const userPrompt =
	// 	'show me the changes in sales rankings of various car brand';
	// //调用图表生成接口，获得spec和图表动画时长
	// ? 如何让这里await去掉，考虑将生成函数抽离出去
	//   const { spec, time } = await vmind.generateChart(
	// 	userPrompt,
	// 	fieldInfo,
	// 	dataset
	// );

	function renderChart() {
		// if (divRef.current && spec) {
		// 	// 创建 vchart 实例
		// 	const vchart = new VChart(spec, { dom: 'chart' });
		// 	// 绘制
		// 	vchart.renderSync();
		// }
	}

	useEffect(() => {
		if (divRef.current) {
			const vchart = new VChart(spec, { dom: divRef.current });
			vchart.renderAsync();
			console.log('1');
		}
	}, []);
	useEffect(() => {
		if (divRef.current && size) {
			const vchart = new VChart(spec, { dom: divRef.current });
			vchart.resize(size?.width, size.height);
			return () => {
				// 清理
				vchart.clearAllStates();
			};
		}
	}, [id, width, height, styles, size?.width]); // 当`id`或`chartOptions`变化时重新初始化图表
	// console.log(size?.height);
	useEffect(() => {
		// 应用拖拽功能
		drag(divRef);
	}, [drag]); // 只有在`drag`函数变化时重新运行此效果

	return (
		<div
			ref={divRef}
			data-component-id={id}
			className='w-[100%]'
			style={{ width: '100%', height, display: 'inline-block', ...styles }} // 设置图表大小
		></div>
	);
}

export default AIChart;
