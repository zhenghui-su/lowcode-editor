import { create } from 'zustand';

/**
 * 组件定义类型
 */
export interface Component {
	id: number;
	name: string;
	props: any;
	desc: string;
	children?: Component[];
	parantId?: number;
}
interface State {
	components: Component[];
	curComponentId?: number | null;
	curComponent: Component | null;
}

interface Action {
	addComponent: (component: Component, parentId?: number) => void;
	deleteComponent: (componentId: number) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateComponentProps: (componentId: number, props: any) => void;
	setCurComponentId: (componentId: number | null) => void;
}
/**
 * @returns {Component} components 组件列表
 * @returns {funciton} addComponent 添加组件
 * @returns {funciton} deleteComponent 删除组件
 * @returns {funciton} updateComponentProps 更新组件属性
 */
export const useComponentsStore = create<State & Action>((set, get) => ({
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

				component.parantId = parentId;
				return { components: [...state.components] };
			}
			// 找不到父组件就放到根组件components里
			return { components: [...state.components, component] };
		}),
	deleteComponent: (componentId) => {
		if (!componentId) return;

		const component = getComponentById(componentId, get().components);
		// 找到要删除节点的parent组件然后对其children删除
		if (component?.parantId) {
			const parentComponent = getComponentById(
				component.parantId,
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
}));

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
