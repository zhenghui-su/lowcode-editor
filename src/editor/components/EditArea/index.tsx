import React, { MouseEventHandler, useState } from 'react';
import { Component, useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import HoverMask from '../HoverMask';
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

	const [hoverComponentId, setHoverComponentId] = useState<number>();

	const handleMouseOver: MouseEventHandler = (e) => {
		const path = e.nativeEvent.composedPath();

		for (let i = 0; i < path.length; i++) {
			const ele = path[i] as HTMLElement;

			const componentId = ele.dataset.componentId;
			if (componentId) {
				setHoverComponentId(+componentId);
				return;
			}
		}
	};

	return (
		<div
			className='h-[100%] edit-area'
			onMouseOver={handleMouseOver}
			onMouseLeave={() => setHoverComponentId(undefined)}
		>
			{renderComponents(components)}
			{hoverComponentId && (
				<HoverMask
					portalWrapperClassName='portal-wrapper'
					containerClassName='edit-area'
					componentId={hoverComponentId}
				/>
			)}
			<div className='portal-wrapper'></div>
		</div>
	);
}
