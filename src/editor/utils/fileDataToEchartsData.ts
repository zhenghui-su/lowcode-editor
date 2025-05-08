export const readCSV = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = (e.target?.result as string)
				.replace(/\r\n/g, '\n') // 统一换行符
				.replace(/\r/g, '\n'); // 处理Mac格式换行
			resolve(text);
		};
		reader.onerror = reject;
		reader.readAsText(file);
	});
};

/**
 * 将CSV字符串转换为适用于不同ECharts图表类型的数据结构
 * @param csvString CSV格式的字符串
 * @param chartType 图表类型（可选），支持 'Line', 'Bar', 'Pie', 'Scatter', 'Radar' 等
 * @returns 返回适配指定图表类型的数据结构
 */
export const convertCSVToEcharts = (csvString: string, chartType?: string) => {
	const rows = csvString
		.split('\n')
		.map((row) => row.trim())
		.filter((row) => row);

	if (rows.length < 1) return [];

	const headers = rows[0]
		.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
		.map((h) => h.replace(/^"|"$/g, '').trim());

	const commonData = rows.slice(1).map((row) => {
		const values = row
			.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
			.map((v) => v.replace(/^"|"$/g, '').trim());

		return headers.reduce((obj, header, index) => {
			const numericValue = Number(values[index]);
			obj[header] = isNaN(numericValue) ? values[index] : numericValue;
			return obj;
		}, {} as Record<string, any>);
	});

	// 自动识别时间列并排序（例如：年份）
	const isTimeColumn = (value: any): boolean => {
		return typeof value === 'number' && value >= 1900 && value <= 2100;
	};

	// 如果第一列是时间列（如年份），则排序
	if (commonData.length > 0 && isTimeColumn(commonData[0][headers[0]])) {
		commonData.sort((a, b) => a[headers[0]] - b[headers[0]]);
	}
	switch (chartType) {
		case 'Line':
			// 折线图 xAxis + 多个系列（支持堆叠）
			if (headers.length < 2) return commonData;

			return {
				xAxisData: commonData.map((item) => item[headers[0]]),
				series: headers.slice(1).map((header) => ({
					name: header,
					type: chartType.toLowerCase(),
					stack: 'Total', // 堆叠模式
					smooth: false,
					areaStyle: {
						opacity: 0,
					},
					data: commonData.map((item) => item[header]),
				})),
			};
		case 'Bar':
			if (headers.length < 2) return commonData;

			return {
				xAxisData: commonData.map((item) => item[headers[0]]),
				series: headers.slice(1).map((header) => ({
					name: header,
					type: 'bar',
					stack: 'Total', // 堆叠模式
					data: commonData.map((item) => item[header]),
				})),
			};
		case 'Scatter':
			// 散点图：需要两个数值列作为坐标
			if (headers.length < 2) return commonData;

			//headers.slice(1); // ['2016', '2017', ..., '2021']

			// 将每个城市的每一年转化为散点图数据项
			const seriesMap: Record<string, { data: number[][] }> = {};

			commonData.forEach((item) => {
				const city = item[headers[0]]; // 城市名
				seriesMap[city] = { data: [] };

				headers.slice(1).forEach((year, yearIndex) => {
					const value = item[year];
					if (!isNaN(value)) {
						seriesMap[city].data.push([yearIndex, Number(value)]);
					}
				});
			});

			// 转换为 ECharts 系列数组
			const series = Object.keys(seriesMap).map((city) => ({
				name: city,
				type: 'scatter',
				symbolSize: (params: number[]) => Math.sqrt(params[1]) / 10, // 根据值大小调整点的尺寸
				data: seriesMap[city].data,
				tooltip: {
					trigger: 'item',
					formatter: (params: any) => {
						return `${params.seriesName}<br/>年份: ${params.data[0]}<br/>数值: ${params.data[1]}`;
					},
				},
			}));

			return {
				xAxis: {
					type: 'category',
					data: headers.slice(1),
					name: '年份',
				},
				yAxis: {
					type: 'value',
					name: '数值',
				},
				series,
				legend: {
					data: Object.keys(seriesMap), // 城市名称列表
					type: 'scroll',
					top: '90%', // 距离顶部为90%，即靠近底部
					bottom: '5%', // 底部留白
					left: 'center', // 水平居中
					orient: 'horizontal', // 横向排列
					alignTo: 'center',
					padding: [5, 10], // 内边距
					pageButtonItemGap: 5,
					pageIconColor: '#666',
					pageIconInactiveColor: '#ccc',
					pageIconSize: 12,
				},
			};
		case 'Radar':
			// 雷达图：多个维度和对应的值（支持多组数据）
			if (headers.length < 2) return commonData;

			const indicator = headers.slice(1).map((name) => ({ name }));

			// 每个年份对应一个雷达图数据项
			const seriesData = commonData.map((item) => ({
				name: String(item[headers[0]]), // 年份作为雷达图例名称
				value: headers.slice(1).map((header) => item[header]), // 各项支出作为雷达图数值
			}));

			return {
				legend: {
					data: commonData.map((item) => String(item[headers[0]])), // 雷达图例数据,
					type: 'scroll',
					top: '90%', // 距离顶部为90%，即靠近底部
					bottom: '5%', // 底部留白
					left: 'center', // 水平居中
					orient: 'horizontal', // 横向排列
					alignTo: 'center',
					padding: [5, 10], // 内边距
					pageButtonItemGap: 5,
					pageIconColor: '#666',
					pageIconInactiveColor: '#ccc',
					pageIconSize: 12,
				},
				radar: {
					indicator,
					// shape: 'circle', // 可选圆形
				},
				series: [
					{
						type: 'radar',
						data: seriesData,
						tooltip: {
							trigger: 'item',
						},
						// areaStyle: {}, // 显示区域颜色
						emphasis: {
							areaStyle: { opacity: 0.3 }, // 强调时的透明度
						},
					},
				],
			};
		case 'Pie':
			// 饼图：label + value
			if (headers.length < 2) return commonData;

			const years = headers.slice(1); // ['第一产业', '第二产业', '第三产业']
			const latestRow = commonData[commonData.length - 1]; // 默认显示最新年份
			const pieData = years.map((name) => ({
				name,
				value: latestRow[name],
			}));

			return {
				series: [
					{
						type: 'pie',
						avoidLabelOverlap: false,
						label: { show: false },
						// emphasis: {
						// 	label: { show: true, fontSize: '16', fontWeight: 'bold' },
						// },
						data: pieData,
					},
				],
				legend: {
					data: years,
					top: '90%',
					left: 'center',
					orient: 'horizontal',
				},
				title: {
					text: `${latestRow[headers[0]]} 年产业结构占比`,
					left: 'center',
				},
			};

		case 'HeatMap':
			if (headers.length < 2) return commonData;

			const cities = commonData.map((item) => item[headers[0]]); // 城市列表
			console.log(cities);
			const values = commonData.flatMap((item, yIndex) =>
				headers.slice(1).map((year, xIndex) => {
					const value = item[year];
					return [xIndex, yIndex, isNaN(value) ? 0 : Number(value)];
				})
			);

			// 获取所有数值用于设置 visualMap min/max
			const allValues = values.map((v) => v[2]);

			return {
				xAxis: {
					type: 'category',
					data: headers.slice(1),
					splitArea: { show: true },
				},
				yAxis: {
					type: 'category',
					data: cities,
					splitArea: { show: true },
				},
				visualMap: {
					min: Math.min(...allValues),
					max: Math.max(...allValues),
					calculable: true,
					orient: 'horizontal',
					left: 'center',
					bottom: '15%',
				},
				tooltip: {
					trigger: 'item',
					formatter: (params: any) => {
						const xIndex = params.data[0]; // 年份索引
						const yIndex = params.data[1]; // 城市索引
						const value = params.data[2]; // 数值

						const year = headers[xIndex + 1]; // 年份
						const city = cities[yIndex]; // 城市名

						return `城市: ${city}<br/>年份: ${year}<br/>数值: ${value}`;
					},
				},
				series: [
					{
						name: 'HeatMap',
						type: 'heatmap',
						label: { show: false, color: '#fff' },
						itemStyle: {
							borderWidth: 0.5,
							borderColor: '#fff',
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
						data: values,
					},
				],
			};
		default:
			// 默认返回原始对象数组
			return commonData;
	}
};
