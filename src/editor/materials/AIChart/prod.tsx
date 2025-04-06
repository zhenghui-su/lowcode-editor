import { CommonComponentProps } from '../../interface';
import VMind from '@visactor/vmind';
import VChart from '@visactor/vchart';
import { useEffect, useRef } from 'react';
import { useSize } from 'ahooks';

/**
 * @description ai生成图表
 */
async function AIChart({
	id,
	url,
	model,
	apiKey,
	csvData,
	width,
	height,
	styles,
}: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);

	// 拖拽改变大小时实时改变图表宽度
	const size = useSize(divRef);
	const vmind = new VMind({
		url, //指定你的大模型服务url。default is https://api.openai.com/v1/chat/completions
		model: model, //指定你指定的模型
		headers: {
			//指定调用大模型服务时的header
			'api-key': apiKey, //Your LLM API Key
		},
	});
	const { fieldInfo, dataset } = vmind.parseCSVData(csvData);
	const userPrompt =
		'show me the changes in sales rankings of various car brand';
	//调用图表生成接口，获得spec和图表动画时长
	const { spec, time } = await vmind.generateChart(
		userPrompt,
		fieldInfo,
		dataset,
	);
	useEffect(() => {
		// 创建 vchart 实例
		const vchart = new VChart(spec, { dom: divRef.current! });
		// 绘制
		vchart.renderSync();
	}, [id, width, height, styles, size?.width]); // 当`id`或`chartOptions`变化时重新初始化图表

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
