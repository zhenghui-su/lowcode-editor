import { Form, Input, Select, Slider, Switch } from 'antd';
import { useComponentsStore } from '../../stores/components';
import {
	ComponentSetter,
	useComponentConfigStore,
} from '../../stores/component-config';
import { useEffect, useState } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { debounce } from 'lodash-es';

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
			case 'json':
				return (
					<div className='h-[200px] border-[1px] border-[#ccc] z-10'>
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
		}
	}
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
		} catch (e) {}
	}, 500);
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
				item.smooth = changeValues.smooth || item.smooth;
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
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Scatter' && curComponentId) {
			if (changeValues.scatterDataUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Radar' && curComponentId) {
			if (changeValues.radarIndicatorUrl || changeValues.radarDataUrl) {
				updateComponentProps(curComponentId, changeValues);
			}
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'HeatMap' && curComponentId) {
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Sunburst' && curComponentId) {
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Parallel' && curComponentId) {
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'Sankey' && curComponentId) {
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponent?.name === 'River' && curComponentId) {
			let options = JSON.parse(chartOptions);
			// 正标题
			options.title.text = changeValues.text || options.title.text;
			// 副标题
			options.title.subtext = changeValues.subtext || options.title.subtext;
			// title 位置
			options.title.left = changeValues.left || options.title.left;
			setChartOptions(JSON.stringify(options, null, 2));
			updateComponentProps(curComponentId, { options });
		} else if (curComponentId) {
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
