import { Form, Input, Select, Switch } from 'antd';
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
		}
	}
	const handleEditorChange = debounce((value) => {
		setChartOptions(value);
		const options = JSON.parse(value);
		try {
			updateComponentProps(curComponentId, { options });
		} catch (e) {}
	}, 500);
	// 当表单 value 变化的时候，同步到 store
	function valueChange(changeValues: any) {
		if (curComponent?.name === 'Line' && curComponentId) {
			let options = JSON.parse(chartOptions);
			options.series.map((item: any) => {
				item.smooth = changeValues.smooth;
			});
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
