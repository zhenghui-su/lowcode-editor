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
		case 'Bar':
			// 折线图/柱状图：xAxis + 多个系列（支持堆叠）
			if (headers.length < 2) return commonData;

			return {
				xAxisData: commonData.map((item) => item[headers[0]]),
				series: headers.slice(1).map((header) => ({
					name: header,
					type: chartType.toLowerCase(),
					stack: 'Total', // 堆叠模式
					// itemStyle: { opacity: 0.8 },
					data: commonData.map((item) => item[header]),
				})),
			};

		case 'Pie':
			// 饼图：label + value
			if (headers.length < 2) return commonData;

			return {
				series: [
					{
						type: 'pie',
						radius: ['40%', '70%'],
						avoidLabelOverlap: false,
						label: { show: false },
						emphasis: {
							label: { show: true, fontSize: '16', fontWeight: 'bold' },
						},
						data: commonData.map((item) => ({
							name: item[headers[0]],
							value: item[headers[1]],
						})),
					},
				],
			};

		case 'Scatter':
			// 散点图：需要两个数值列作为坐标
			if (headers.length < 2) return commonData;

			return {
				series: [
					{
						type: 'scatter',
						symbolSize: (data: number[]) => Math.sqrt(data[1]) * 2, // 根据值大小调整点的尺寸
						data: commonData.map((item) => [
							item[headers[0]],
							item[headers[1]],
						]),
						markPoint: {
							data: [{ type: 'max', name: '最大值' }],
						},
					},
				],
			};

		case 'Radar':
			// 雷达图：多个维度和对应的值（支持多组数据）
			if (headers.length < 2) return commonData;

			const indicator = headers.slice(1).map((name) => ({ name }));

			const seriesData = commonData.map((item) => ({
				name: item[headers[0]],
				value: headers.slice(1).map((header) => item[header]),
			}));

			return {
				radar: { indicator },
				series: [
					{
						type: 'radar',
						data: seriesData,
						areaStyle: {},
					},
				],
			};

		default:
			// 默认返回原始对象数组
			return commonData;
	}
};
