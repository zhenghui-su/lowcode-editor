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
 *
 * @param csvString csv字符串
 * @param chartType 图表类型
 * @returns
 */
export const convertCSVToEcharts = (csvString: string, chartType?: string) => {
	// 更健壮的行分割方式
	const rows = csvString
		.split('\n')
		.map((row) => row.trim())
		.filter((row) => row);

	if (rows.length < 1) return [];

	// 改进的列分割（处理带引号的字段）
	const headers = rows[0]
		.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
		.map((h) => h.replace(/^"|"$/g, '').trim());

	const commonData = rows.slice(1).map((row) => {
		// 处理带引号的内容
		const values = row
			.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
			.map((v) => v.replace(/^"|"$/g, '').trim());

		return headers.reduce((obj, header, index) => {
			const numericValue = Number(values[index]);
			obj[header] = isNaN(numericValue) ? values[index] : numericValue;
			return obj;
		}, {} as Record<string, any>);
	});

	switch (chartType) {
		case 'Line':
		case 'Bar':
			// 增强健壮性检查
			if (headers.length < 2) return commonData;

			return {
				xAxisData: commonData.map((item) => item[headers[0]]),
				series: headers.slice(1).map((header) => ({
					name: header,
					data: commonData.map((item) => item[header]),
				})),
			};

		default:
			return commonData;
	}
};
