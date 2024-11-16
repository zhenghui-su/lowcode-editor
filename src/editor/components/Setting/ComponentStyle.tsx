import { Form, Input, InputNumber, Select } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import {
	ComponentSetter,
	useComponentConfigStore,
} from '../../stores/component-config';
import { useComponentsStore } from '../../stores/components';
import CssEditor from './CssEditor';
import { debounce } from 'lodash-es';
import StyleToObject from 'style-to-object';
/**
 *
 * @description 组件样式编辑区域
 */
export function ComponentStyle() {
	const [form] = Form.useForm();

	const { curComponentId, curComponent, updateComponentStyles } =
		useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	const [css, setCss] = useState<string>(`.comp{\n\n}`);

	useEffect(() => {
		form.resetFields();

		const data = form.getFieldsValue();
		form.setFieldsValue({ ...data, ...curComponent?.styles });

		setCss(toCSSStr(curComponent?.styles!));
	}, [curComponent]);
	// 将表单css对象转为 css 字符串 用以下方css编辑器显示
	function toCSSStr(css: Record<string, any>) {
		let str = `.comp {\n`;
		for (let key in css) {
			let value = css[key];
			if (!value) continue;
			if (
				['width', 'height'].includes(key) &&
				!value.toString().endsWith('px')
			) {
				value += 'px';
			}
			str += `\t${key}: ${value};\n`;
		}
		str += `}`;
		return str;
	}

	if (!curComponentId || !curComponent) return null;

	function renderFormElememt(setting: ComponentSetter) {
		const { type, options } = setting;

		switch (type) {
			case 'select':
				return <Select options={options} />;
			case 'input':
				return <Input />;
			case 'inputNumber':
				return <InputNumber />;
		}
	}
	// style 变化时更新到 store
	function valueChange(changeValues: CSSProperties) {
		if (curComponentId) {
			updateComponentStyles(curComponentId, changeValues);
		}
	}
	// css 变化时更新到 store
	const handleEditorChange = debounce((value) => {
		setCss(value);

		let css: Record<string, any> = {};
		try {
			const cssStr = value
				.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
				.replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
				.replace('}', ''); // 去掉 }

			StyleToObject(cssStr, (name, value) => {
				css[
					name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))
				] = value;
			});

			updateComponentStyles(
				curComponentId,
				{ ...form.getFieldsValue(), ...css },
				true,
			);
		} catch (e) {}
	}, 500);

	return (
		<Form
			form={form}
			onValuesChange={valueChange}
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 14 }}
		>
			{componentConfig[curComponent.name]?.stylesSetter?.map((setter) => (
				<Form.Item key={setter.name} name={setter.name} label={setter.label}>
					{renderFormElememt(setter)}
				</Form.Item>
			))}
			<div className='h-[200px] border-[1px] border-[#ccc] z-10'>
				<CssEditor value={css} onChange={handleEditorChange} />
			</div>
		</Form>
	);
}
