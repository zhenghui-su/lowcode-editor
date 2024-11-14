import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

export interface ComponentConfig {
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	defaultProps: Record<string, any>;
	desc: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
