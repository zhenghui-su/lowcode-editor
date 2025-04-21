import {
	Form,
	Input,
	Select,
	Slider,
	Switch,
	Upload,
	Button,
	Tooltip,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useComponentsStore } from '../../stores/components';
import {
	ComponentSetter,
	useComponentConfigStore,
} from '../../stores/component-config';
import { useEffect, useState } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { debounce } from 'lodash-es';
import {
	convertCSVToEcharts,
	readCSV,
} from '../../utils/fileDataToEchartsData';

// const { Dragger } = Upload;

/**
 *
 * @description 组件属性设置区域
 */
export function ComponentAttr() {
	const [form] = Form.useForm();

	const { curComponentId, curComponent, updateComponentProps } =
		useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	const [chartOptions, setChartOptions] = useState(
		JSON.stringify(curComponent?.props.options, null, 2),
	);

	// 格式化 ctrl + j 或 command + j
	const handleEditorMount: OnMount = (editor, monaco) => {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
			editor.getAction('editor.action.formatDocument')?.run();
		});
	};
	useEffect(() => {
		setChartOptions(JSON.stringify(curComponent?.props.options, null, 2));
		form.resetFields();
		form.setFieldsValue({ ...curComponent?.props });
	}, [curComponent]);
	useEffect(() => {
		// 折线图属性初始化
		updateLineFromOptions(curComponent, form);
		// 柱状图属性初始化
		updateBarFromOptions(curComponent, form);
		// 饼图属性初始化
		updatePieFromOptions(curComponent, form);
		// 散点图属性初始化
		updateScatterFromOptions(curComponent, form);
		// 雷达图属性初始化
		updateRadarFromOptions(curComponent, form);
		// 热力图属性初始化
		updateHeatMapFromOptions(curComponent, form);
		// 旭日图属性初始化
		updateSunburstFromOptions(curComponent, form);
		// 平行坐标系属性初始化
		updateParallelFromOptions(curComponent, form);
		// 桑基图属性初始化
		updateSankeyFromOptions(curComponent, form);
		// 河流图属性初始化
		updateRiverFromOptions(curComponent, form);
		// K线图属性初始化
		updateCandlestickFromOptions(curComponent, form);
		// 漏斗图属性初始化
		updateFunnelFromOptions(curComponent, form);
		// 仪表盘属性初始化
		updatePressureFromOptions(curComponent, form);
	}, [curComponent]);
	// 没有选择组件时候返回null
	if (!curComponentId || !curComponent) return null;
	// 根据组件配置信息渲染表单项
	function renderFormElement(setting: ComponentSetter) {
		const { type, options } = setting;

		switch (type) {
			case 'select':
				return <Select options={options} />;
			case 'input':
				return <Input />;
			case 'switch':
				return <Switch />;
			case 'slider':
				return <Slider min={0} defaultValue={0} max={100} />;
			case 'prompt':
				return (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Input.TextArea
							defaultValue={curComponent?.props.userPrompt}
							onBlur={(e) => {
								form.setFieldValue('userPrompt', e.target.value);
							}}
						/>
						<Button
							onClick={() => {
								const userPrompt = form.getFieldValue('userPrompt');
								if (userPrompt && curComponentId) {
									updateComponentProps(curComponentId, {
										userPrompt,
									});
								}
							}}
						>
							发送
						</Button>
					</div>
				);
			case 'json':
				return (
					<div className='h-[600px] border-[1px] border-[#ccc] z-10'>
						<MonacoEditor
							height={'100%'}
							path='options.json'
							language='json'
							onMount={handleEditorMount}
							onChange={handleEditorChange}
							value={chartOptions}
							options={{
								fontSize: 14,
								scrollBeyondLastLine: false,
								minimap: {
									enabled: false,
								},
								scrollbar: {
									verticalScrollbarSize: 6,
									horizontalScrollbarSize: 6,
								},
							}}
						/>
					</div>
				);
			// 修改file类型渲染部分
			case 'file':
				return (
					// TODO 文件上传样式待更新, 图表对应格式提示待更新
					<Upload
						name='file'
						multiple={false}
						accept='.csv'
						maxCount={1}
						itemRender={(_, file) => <div>{file.name}</div>}
						// TODO 待更新上传地址
						onChange={async (info) => {
							const file = info.file.originFileObj;
							if (file && curComponent) {
								const csvData = await readCSV(file);
								const echartsName = curComponent.name;
								const echartsData = convertCSVToEcharts(csvData, echartsName);
								updateEchartsDataFromCsvFileData(echartsName, echartsData);
							}
						}}
					>
						<Tooltip title={<div>支持csv格式文件</div>}>
							<Button icon={<InboxOutlined />}>点击上传</Button>
						</Tooltip>
					</Upload>
				);
		}
	}
	const updateEchartsDataFromCsvFileData = (name: string, echartsData: any) => {
		if (name == 'Line' && curComponentId) {
			const xAsisData = echartsData.xAxisData;
			const seriesData = echartsData.series[0].data;
			let options = JSON.parse(chartOptions);

			options.xAxis.data = xAsisData;
			options.series[0].data = seriesData;
			updateComponentProps(curComponentId, { options });
		}
	};

	const handleEditorChange = debounce((value) => {
		setChartOptions(value);
		try {
			const options = JSON.parse(value);
			updateComponentProps(curComponentId, { options });
			updateLineFromOptions(curComponent, form);
			updateBarFromOptions(curComponent, form);
			updatePieFromOptions(curComponent, form);
			updateScatterFromOptions(curComponent, form);
			updateRadarFromOptions(curComponent, form);
			updateHeatMapFromOptions(curComponent, form);
			updateSunburstFromOptions(curComponent, form);
			updateParallelFromOptions(curComponent, form);
			updateSankeyFromOptions(curComponent, form);
			updateRiverFromOptions(curComponent, form);
			updateCandlestickFromOptions(curComponent, form);
			updateFunnelFromOptions(curComponent, form);
			updatePressureFromOptions(curComponent, form);
		} catch (e) {}
	}, 500);

	// 更新基础属性
	function updateBasicAttributes(changeValues: any, curComponentId: number) {
		let options = JSON.parse(chartOptions);
		// 正标题
		options.title.text = changeValues.text || options.title.text;
		// 副标题
		options.title.subtext = changeValues.subtext || options.title.subtext;
		// title 位置
		options.title.left = changeValues.left || options.title.left;
		setChartOptions(JSON.stringify(options, null, 2));
		updateComponentProps(curComponentId, { options });
	}
	// 当表单 value 变化的时候，同步到 store
	function valueChange(changeValues: any) {
		if (curComponent?.name === 'Line' && curComponentId) {
			if (changeValues.lineXAxisUrl || changeValues.lineYAxisUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			// 边界间隔
			options.xAxis.boundaryGap =
				changeValues.boundaryGap ?? options.xAxis.boundaryGap;
			options.series.map((item: any) => {
				// 平滑曲线
				item.smooth = changeValues.smooth ?? item.smooth;
				// 面积图透明度
				item.areaStyle.opacity =
					changeValues.areaStyleOpacity / 100 || item.areaStyle.opacity;
			});
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Bar' && curComponentId) {
			if (changeValues.barXAxisUrl || changeValues.barYAxisUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			// 轴刻度对齐标签
			options.xAxis.axisTick.alignWithLabel =
				changeValues.alignWithLabel ?? options.xAxis.axisTick.alignWithLabel;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Pie' && curComponentId) {
			if (changeValues.pieDataUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Scatter' && curComponentId) {
			if (changeValues.scatterDataUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Radar' && curComponentId) {
			if (changeValues.radarIndicatorUrl || changeValues.radarDataUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'HeatMap' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Sunburst' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Parallel' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Sankey' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'River' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Candlestick' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Funnel' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponent?.name === 'Pressure' && curComponentId) {
			updateBasicAttributes(curComponentId, changeValues);
		} else if (curComponentId && curComponent?.name !== 'AIChart') {
			updateComponentProps(curComponentId, changeValues);
		}
	}
	return (
		<Form
			form={form}
			onValuesChange={valueChange}
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 14 }}
		>
			<Form.Item label='组件id'>
				<Input value={curComponent.id} disabled />
			</Form.Item>
			<Form.Item label='组件名称'>
				<Input value={curComponent.name} disabled />
			</Form.Item>
			<Form.Item label='组件描述'>
				<Input value={curComponent.desc} disabled />
			</Form.Item>
			{componentConfig[curComponent.name]?.setter?.map((setter) => (
				<Form.Item
					key={setter.name}
					name={setter.name}
					label={setter.label}
					rules={
						setter.required
							? [
									{
										required: true,
										message: '不能为空',
									},
							  ]
							: []
					}
				>
					{renderFormElement(setter)}
				</Form.Item>
			))}
		</Form>
	);
}
function updateLineFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Line') {
		const { text, subtext, left } = curComponent.props.options.title;
		const { smooth } = curComponent.props.options.series[0];
		const areaStyleOpacity =
			curComponent.props.options.series[0].areaStyle.opacity * 100;
		const boundaryGap = curComponent.props.options.xAxis.boundaryGap;
		form.setFieldsValue({
			text,
			subtext,
			left,
			smooth,
			areaStyleOpacity,
			boundaryGap,
		});
	}
}
function updateBarFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Bar') {
		const { text, subtext, left } = curComponent.props.options.title;
		const { alignWithLabel } = curComponent.props.options.xAxis.axisTick;
		form.setFieldsValue({ text, subtext, left, alignWithLabel });
	}
}
function updatePieFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Pie') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateScatterFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Scatter') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateRadarFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Radar') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateHeatMapFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'HeatMap') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateSunburstFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Sunburst') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateParallelFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Parallel') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateSankeyFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Sankey') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateRiverFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'River') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateCandlestickFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Candlestick') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updateFunnelFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Funnel') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
function updatePressureFromOptions(curComponent: any, form: any) {
	if (curComponent?.name === 'Pressure') {
		const { text, subtext, left } = curComponent.props.options.title;
		form.setFieldsValue({ text, subtext, left });
	}
}
