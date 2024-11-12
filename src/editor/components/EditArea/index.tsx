import React from 'react';
import { Component, useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
/**
 * @description 组件编辑区域即画布区域
 */
export function EditArea() {
	const { components } = useComponentsStore();
	const { componentConfig } = useComponentConfigStore();
	// 递归渲染components 用到的组件配置从componentConfig取
	function renderComponents(components: Component[]): React.ReactNode {
		return components.map((component: Component) => {
			const config = componentConfig?.[component.name];

			if (!config?.component) return null;

			return React.createElement(
				config.component,
				{
					key: component.id,
					id: component.id,
					name: component.name,
					...config.defaultProps,
					...component.props,
				},
				renderComponents(component.children || []),
			);
		});
	}

	return <div className='h-[100%]'>{renderComponents(components)}</div>;
}
