import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

/**
 * 组件属性表单配置
 */
export interface ComponentSetter {
	name: string;
	label: string;
	type: string;
	[key: string]: any;
}
/**
 * 组件配置
 */
export interface ComponentConfig {
	name: string;
	defaultProps: Record<string, any>;
	desc: string;
	setter?: ComponentSetter[];
	stylesSetter?: ComponentSetter[]; // 样式配置
	component: any;
}
// 组件映射配置
// key: 组件名 value: 组件配置(包括组件实例、默认参数)
interface State {
	componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
	registerConfig: (name: string, componentConfig: ComponentConfig) => void;
}
/**
 * 组件配置 store
 */
export const useComponentConfigStore = create<State & Action>((set) => ({
	componentConfig: {
		Container: {
			name: 'Container',
			defaultProps: {},
			desc: '容器',
			component: Container,
		},
		Button: {
			name: 'Button',
			defaultProps: {
				type: 'primary',
				text: '按钮',
			},
			setter: [
				{
					name: 'type',
					label: '按钮类型',
					type: 'select',
					options: [
						{ label: '主按钮', value: 'primary' },
						{ label: '次按钮', value: 'default' },
					],
				},
				{
					name: 'text',
					label: '文本',
					type: 'input',
				},
			],
			stylesSetter: [
				{
					name: 'width',
					label: '宽度',
					type: 'inputNumber',
				},
				{
					name: 'height',
					label: '高度',
					type: 'inputNumber',
				},
			],
			desc: '按钮',
			component: Button,
		},
		Page: {
			name: 'Page',
			defaultProps: {},
			desc: '页面',
			component: Page,
		},
	},
	registerConfig: (name, componentConfig) =>
		set((state) => {
			return {
				...state,
				componentConfig: {
					...state.componentConfig,
					[name]: componentConfig,
				},
			};
		}),
}));
