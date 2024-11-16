import { Form, Input, Select } from 'antd';
import { useComponentsStore } from '../../stores/components';
import {
	ComponentConfig,
	ComponentSetter,
	useComponentConfigStore,
} from '../../stores/component-config';
import { useEffect } from 'react';

/**
 *
 * @description 组件属性设置区域
 */
export function ComponentAttr() {
	const [form] = Form.useForm();

	const { curComponentId, curComponent, updateComponentProps } =
		useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	useEffect(() => {
		// 当curComponent即选择组件变化时, 将组件的props设置到表单用以回显数据
		const data = form.getFieldsValue();
		form.setFieldsValue({ ...data, ...curComponent?.props });
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
		}
	}
	// 当表单 value 变化的时候，同步到 store
	function valueChange(changeValues: ComponentConfig) {
		if (curComponentId) {
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
				<Form.Item key={setter.name} name={setter.name} label={setter.label}>
					{renderFormElement(setter)}
				</Form.Item>
			))}
		</Form>
	);
}
