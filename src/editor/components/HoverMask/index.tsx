import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '../../stores/components';

interface HoverMaskProps {
	portalWrapperClassName: string;
	containerClassName: string;
	componentId: number;
	scrolling: boolean;
}
/**
 * 鼠标悬浮时，显示组件的边框
 */
function HoverMask({
	portalWrapperClassName,
	containerClassName,
	componentId,
	scrolling,
}: HoverMaskProps) {
	const { components } = useComponentsStore();

	const [position, setPosition] = useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		labelTop: 0,
		labelLeft: 0,
	});

	useEffect(() => {
		updatePosition();
	}, [componentId]);

	useEffect(() => {
		setTimeout(() => {
			updatePosition();
		}, 200);
	}, [components]);

	useEffect(() => {
		if (scrolling) {
			updatePosition();
		}
	}, [scrolling]);

	// 窗口变化时更新位置
	const maskElement = document.querySelector(`.${portalWrapperClassName}`);
	const resizeObserver = new ResizeObserver(() => {
		updatePosition();
	});
	resizeObserver.observe(maskElement!);

	function updatePosition() {
		if (!componentId) return;

		const container = document.querySelector(`.${containerClassName}`);
		if (!container) return;

		const node = document.querySelector(`[data-component-id="${componentId}"]`);
		if (!node) return;

		const { top, left, width, height } = node.getBoundingClientRect();
		const { top: containerTop, left: containerLeft } =
			container.getBoundingClientRect();

		let labelTop = top - containerTop + container.scrollTop;
		const labelLeft = left - containerLeft + width;

		if (labelTop <= 0) {
			labelTop -= -20;
		}

		setPosition({
			left: left - containerLeft + container.scrollTop,
			top: top - containerTop + container.scrollTop,
			width,
			height,
			labelTop,
			labelLeft,
		});
	}

	const el = useMemo(() => {
		return document.querySelector(`.${portalWrapperClassName}`)!;
	}, []);

	const curComponent = useMemo(() => {
		return getComponentById(componentId, components);
	}, [componentId]);

	return createPortal(
		<>
			<div
				style={{
					position: 'absolute',
					left: position.left,
					top: position.top,
					backgroundColor: 'rgba(0, 0, 255, 0.05)',
					border: '1px dashed blue',
					pointerEvents: 'none',
					width: position.width,
					height: position.height,
					zIndex: 12,
					borderRadius: 4,
					boxSizing: 'border-box',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: position.labelLeft,
					top: position.labelTop,
					fontSize: '14px',
					zIndex: 13,
					display: !position.width || position.width < 10 ? 'none' : 'inline',
					transform: 'translate(-100%, -100%)',
				}}
			>
				<div
					style={{
						padding: '0 8px',
						backgroundColor: 'blue',
						borderRadius: 4,
						color: '#fff',
						cursor: 'pointer',
						whiteSpace: 'nowrap',
					}}
				>
					{curComponent?.desc}
				</div>
			</div>
		</>,
		el,
	);
}

export default HoverMask;
