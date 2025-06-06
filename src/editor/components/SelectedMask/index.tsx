import { useEffect, useMemo, useState } from 'react';
import { getComponentById, useComponentsStore } from '../../stores/components';
import { createPortal } from 'react-dom';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface SelectedMaskProps {
	portalWrapperClassName: string;
	containerClassName: string;
	componentId: number;
	scrolling: boolean;
}

function SelectedMask({
	portalWrapperClassName,
	containerClassName,
	componentId,
	scrolling,
}: SelectedMaskProps) {
	const [position, setPosition] = useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		labelTop: 0,
		labelLeft: 0,
	});

	const { components, curComponentId, setCurComponentId, deleteComponent } =
		useComponentsStore();

	useEffect(() => {
		updatePosition();
	}, [componentId]);
	// 删除后更新
	useEffect(() => {
		// ? 在样式变化后到渲染完成再获取改变后的宽高需要时间，所以延迟一下
		// ? 虽然大部分情况下不会有延迟
		setTimeout(() => {
			updatePosition();
		}, 200);
	}, [components]);
	// 窗口变化时更新位置
	const maskElement = document.querySelector(`.${portalWrapperClassName}`);
	const resizeObserver = new ResizeObserver(() => {
		updatePosition();
	});
	resizeObserver.observe(maskElement!);
	// 滚动时更新位置
	useEffect(() => {
		if (scrolling) {
			updatePosition();
		}
	}, [scrolling]);

	function updatePosition() {
		if (!componentId) return;

		const container = document.querySelector(`.${containerClassName}`);
		if (!container) return;

		const node = document.querySelector(`[data-component-id="${componentId}"]`);
		if (!node) return;

		const { left, top, width, height } = node.getBoundingClientRect();
		const { left: containerLeft, top: containerTop } =
			container.getBoundingClientRect();

		let labelTop = top - containerTop + container.scrollTop;
		const labelLeft = left - containerLeft + width;

		if (labelTop <= 0) {
			labelTop -= -20;
		}

		setPosition({
			top: top - containerTop + container.scrollTop,
			left: left - containerLeft + container.scrollTop,
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

	function handleDelete() {
		deleteComponent(componentId!);
		setCurComponentId(null);
	}
	// 找寻当前组件的所有父组件-用于Dropdown的菜单
	const parentComponents = useMemo(() => {
		const parentComponents = [];
		let component = curComponent;

		while (component?.parentId) {
			component = getComponentById(component.parentId, components);
			parentComponents.push(component);
		}
		return parentComponents;
	}, [curComponent]);
	return createPortal(
		<>
			<div
				style={{
					position: 'absolute',
					left: position.left,
					top: position.top,
					backgroundColor: 'rgba(0, 0, 255, 0.1)',
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
				<Space>
					<Dropdown
						menu={{
							items: parentComponents.map((item: any) => ({
								key: item.id,
								label: item.desc,
							})),
							onClick: ({ key }) => {
								setCurComponentId(+key);
							},
						}}
						disabled={parentComponents.length === 0}
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
					</Dropdown>
					{curComponentId !== 1 && (
						<div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
							<Popconfirm
								title='确认删除？'
								okText={'确认'}
								cancelText={'取消'}
								onConfirm={handleDelete}
							>
								<DeleteOutlined style={{ color: '#fff' }} />
							</Popconfirm>
						</div>
					)}
				</Space>
			</div>
		</>,
		el,
	);
}

export default SelectedMask;
