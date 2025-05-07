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
	csvData,
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

	// 创建 vchart 实例
	let vchart: VChart;

	// 检查缓存中是否有匹配当前提示词和CSV数据的图表
	const checkCache = () => {
		const cachedData = localStorage.getItem('AIChartData');
		if (cachedData) {
			try {
				const { prompt, csv, spec } = JSON.parse(cachedData);
				// 如果缓存的提示词和CSV数据与当前相同，直接使用缓存的spec
				if (prompt === userPrompt && csv === csvData && spec) {
					return spec;
				}
			} catch (error) {
				console.error('解析缓存数据失败:', error);
			}
		}
		return null;
	};

	const generateChart = async () => {
		if (csvData === '') return;
		if (userPrompt === '') return;

		// 检查缓存
		const cachedSpec = checkCache();
		if (cachedSpec) {
			if (divRef.current) {
				if (vchart) vchart.release();
				vchart = new VChart(cachedSpec, { dom: divRef.current });
				vchart.renderAsync();
				return;
			}
		}

		//传入csv字符串，获得fieldInfo和dataset用于图表生成
		const { fieldInfo, dataset } = vmind.parseCSVData(csvData);
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
			// 保存图表规格和生成它的提示词与CSV数据
			localStorage.setItem('AIChart', JSON.stringify(spec));
			localStorage.setItem(
				'AIChartData',
				JSON.stringify({
					prompt: userPrompt,
					csv: csvData,
					spec: spec,
				}),
			);

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
		if (csvData === '') return;
		// 调用生成图表的函数
		generateChart();
		return () => {
			if (vchart) {
				message.destroy('AIChart');
				vchart.release();
			}
		};
	}, [userPrompt, csvData]);

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
