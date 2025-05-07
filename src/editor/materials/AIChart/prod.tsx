import { CommonComponentProps } from '../../interface';
import VChart from '@visactor/vchart';
import { useEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';

/**
 * @description ai生成图表
 */
function AIChart({ id, height, styles }: CommonComponentProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const [spec, setSpec] = useState<any>(null);

	// 拖拽改变大小时实时改变图表宽度
	const size = useSize(divRef);

	useEffect(() => {
		// 优先读取包含完整信息的缓存数据
		const cachedData = localStorage.getItem('AIChartData');
		if (cachedData) {
			try {
				const { spec } = JSON.parse(cachedData);
				if (spec) setSpec(spec);
			} catch (error) {
				console.error('解析缓存数据失败:', error);
				// 如果新格式缓存解析失败，尝试读取旧格式缓存
				const temp = localStorage.getItem('AIChart');
				if (temp) setSpec(JSON.parse(temp));
			}
		} else {
			// 如果没有新格式缓存，尝试读取旧格式缓存
			const temp = localStorage.getItem('AIChart');
			if (temp) setSpec(JSON.parse(temp));
		}
	}, []);
	useEffect(() => {
		// 只有在spec存在时才创建和渲染图表
		if (spec && divRef.current) {
			// 创建 vchart 实例
			const vchart = new VChart(spec, { dom: divRef.current });
			// 绘制
			vchart.renderSync();

			// 清理函数
			return () => {
				vchart.release();
			};
		}
	}, [spec, id, height, styles, size?.width]); // 当spec或其他关键属性变化时重新初始化图表

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
