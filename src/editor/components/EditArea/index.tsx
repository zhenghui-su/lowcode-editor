import React, { MouseEventHandler, useRef, useState } from 'react';
import { Component, useComponentsStore } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import HoverMask from '../HoverMask';
import SelectedMask from '../SelectedMask';
import { useScrolling } from 'react-use';
/**
 * @description 组件编辑区域即画布区域
 */
export function EditArea() {
	const { components, curComponentId, setCurComponentId } =
		useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	const scrollRef = useRef<HTMLDivElement>(null);
	const scrolling = useScrolling(scrollRef);

	// 递归渲染components 用到的组件配置从componentConfig取
	function renderComponents(components: Component[]): React.ReactNode {
		return components.map((component: Component) => {
			const config = componentConfig?.[component.name];

			if (!config?.dev) return null;

			return React.createElement(
				config.dev,
				{
					key: component.id,
					id: component.id,
					name: component.name,
					styles: component.styles,
					...config.defaultProps,
					...component.props,
				},
				renderComponents(component.children || []),
			);
		});
	}

	const [hoverComponentId, setHoverComponentId] = useState<number>();
	// 鼠标移入组件时，记录当前组件id
	const handleMouseOver: MouseEventHandler = (e) => {
		const path = e.nativeEvent.composedPath();

		for (let i = 0; i < path.length; i++) {
			const ele = path[i] as HTMLElement;

			const componentId = ele.dataset?.componentId;
			if (componentId) {
				setHoverComponentId(+componentId);
				return;
			}
		}
	};
	const handleClick: MouseEventHandler = (e) => {
		const path = e.nativeEvent.composedPath();

		for (let i = 0; i < path.length; i++) {
			const ele = path[i] as HTMLElement;

			const componentId = ele.dataset?.componentId;
			if (componentId) {
				setCurComponentId(+componentId);
				return;
			}
		}
	};
	return (
		<div
			className='h-[100%] edit-area'
			onMouseOver={handleMouseOver}
			onMouseLeave={() => setHoverComponentId(undefined)}
			onClick={handleClick}
		>
			{renderComponents(components)}
			{/* 鼠标悬浮时的边框 */}
			{hoverComponentId && hoverComponentId !== curComponentId && (
				<HoverMask
					portalWrapperClassName='portal-wrapper'
					containerClassName='edit-area'
					componentId={hoverComponentId}
					scrolling={scrolling}
				/>
			)}
			{/* 鼠标点击时的边框 */}
			{curComponentId && (
				<SelectedMask
					portalWrapperClassName='portal-wrapper'
					containerClassName='edit-area'
					componentId={curComponentId}
					scrolling={scrolling}
				/>
			)}
			<div className='portal-wrapper'></div>
		</div>
	);
}
