import { CSSProperties } from 'react';
import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 组件定义类型
 */
export interface Component {
	id: number;
	name: string;
	props: any;
	styles?: CSSProperties;
	desc: string;
	children?: Component[];
	parentId?: number;
}
interface State {
	components: Component[];
	mode: 'edit' | 'preview';
	curComponentId?: number | null;
	curComponent: Component | null;
}

interface Action {
	addComponent: (component: Component, parentId?: number) => void;
	deleteComponent: (componentId: number) => void;
	updateComponentProps: (componentId: number, props: any) => void;
	updateComponentStyles: (
		componentId: number,
		styles: CSSProperties,
		replace?: boolean,
	) => void;
	setCurComponentId: (componentId: number | null) => void;
	setMode: (mode: State['mode']) => void;
}

const creator: StateCreator<State & Action> = (set, get) => ({
	components: [
		{
			id: 1,
			name: 'Page',
			props: {},
			desc: '页面',
		},
	],
	curComponentId: null,
	curComponent: null,
	mode: 'edit',
	setMode: (mode) => set({ mode }),
	setCurComponentId: (componentId) => {
		set((state) => ({
			curComponentId: componentId,
			curComponent: getComponentById(componentId, state.components),
		}));
	},
	addComponent: (component, parentId) =>
		set((state) => {
			// 根据父id查找父组件
			if (parentId) {
				const parentComponent = getComponentById(parentId, state.components);
				// 有就放到children里
				if (parentComponent) {
					if (parentComponent.children) {
						parentComponent.children.push(component);
					} else {
						parentComponent.children = [component];
					}
				}

				component.parentId = parentId;
				return { components: [...state.components] };
			}
			// 找不到父组件就放到根组件components里
			return { components: [...state.components, component] };
		}),
	deleteComponent: (componentId) => {
		if (!componentId) return;

		const component = getComponentById(componentId, get().components);
		// 找到要删除节点的parent组件然后对其children删除
		if (component?.parentId) {
			const parentComponent = getComponentById(
				component.parentId,
				get().components,
			);

			if (parentComponent) {
				parentComponent.children = parentComponent.children?.filter(
					(item) => item.id !== +componentId,
				);

				set({ components: [...get().components] });
			}
		}
	},
	updateComponentProps: (componentId, props) => {
		set((state) => {
			// 修改 props 也是找到目标 component，修改属性
			const component = getComponentById(componentId, state.components);
			if (component) {
				component.props = {
					...component.props,
					...props,
				};
				return { components: [...state.components] };
			}

			return { components: [...state.components] };
		});
	},
	updateComponentStyles: (componentId, styles, replace) => {
		set((state) => {
			const component = getComponentById(componentId, state.components);
			if (component) {
				// 支持样式覆盖用以css编辑器修改
				component.styles = replace
					? { ...styles }
					: { ...component.styles, ...styles };
				return { components: [...state.components] };
			}

			return { components: [...state.components] };
		});
	},
});

export const useComponentsStore = create<State & Action>()(
	persist(creator, {
		name: 'components',
		partialize: (state) => {
			// 过滤掉 curComponentId
			const { curComponentId, ...restState } = state;
			return restState;
		},
	}),
);

export function getComponentById(
	id: number | null,
	components: Component[],
): Component | null {
	if (!id) return null;

	for (const component of components) {
		if (component.id === id) return component;
		if (component.children && component.children.length > 0) {
			const result = getComponentById(id, component.children);
			if (result !== null) return result;
		}
	}
	return null;
}
