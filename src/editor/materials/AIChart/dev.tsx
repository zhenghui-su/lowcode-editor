import { CommonComponentProps } from '../../interface';
import VMind from '@visactor/vmind';
import VChart from '@visactor/vchart';
import { useDrag } from 'react-dnd';
import { useEffect, useRef } from 'react';
import { message } from 'antd';

/**
 * @description ai生成图表
 */
function AIChart({
	id,
	url,
	model,
	apiKey,
	// csvData,
	userPrompt,
	height,
	styles,
}: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const isFirstRef = useRef<boolean>(true);
	const [_, drag] = useDrag({
		type: 'AIChart',
		item: {
			type: 'AIChart',
			dragType: 'move',
			id: id,
		},
	});
	const vmind = new VMind({
		url,
		model,
		maxTokens: 8192,
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});
	const csvData = `商品名称,region,销售额
可乐,south,2350
可乐,east,1027
可乐,west,1027
可乐,north,1027
雪碧,south,215
雪碧,east,654
雪碧,west,159
雪碧,north,28
芬达,south,345
芬达,east,654
芬达,west,2100
芬达,north,1679
醒目,south,1476
醒目,east,830
醒目,west,532
醒目,north,498`;
	//传入csv字符串，获得fieldInfo和dataset用于图表生成
	const { fieldInfo, dataset } = vmind.parseCSVData(csvData);
	// 创建 vchart 实例
	let vchart: VChart;
	const generateChart = async () => {
		message.open({
			type: 'loading',
			content: '图表生成中...',
			duration: 0,
			key: 'AIChart',
		});
		const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
		if (spec === undefined) {
			message.destroy('AIChart');
			message.error('图表生成失败！您可以尝试重新生成！');
			return;
		}
		if (divRef.current && spec !== undefined) {
			if (!isFirstRef.current) {
				vchart = new VChart(spec, { dom: divRef.current });
				// 绘制
				vchart.renderAsync();
				message.destroy('AIChart');
				message.success('图表生成成功！');
				return;
			}
			if (isFirstRef.current) {
				isFirstRef.current = false;
				vchart = new VChart(spec, { dom: divRef.current });
				// 绘制
				vchart.renderAsync();
				message.destroy('AIChart');
				message.success('图表生成成功！');
			}
		}
	};

	useEffect(() => {
		if (userPrompt === '') return;
		// 调用生成图表的函数
		generateChart();
		return () => {
			vchart.release();
		};
	}, [userPrompt]);

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
