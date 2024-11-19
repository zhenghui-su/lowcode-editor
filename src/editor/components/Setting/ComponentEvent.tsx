import { Button, Collapse, CollapseProps } from 'antd';
import { useComponentConfigStore } from '../../stores/component-config';
import type { ComponentEvent } from '../../stores/component-config';
import { useComponentsStore } from '../../stores/components';
import { useState } from 'react';
import { ActionModal } from './ActionModal';
import { ActionConfig } from './actions/actionConfig';
import { DeleteOutlined } from '@ant-design/icons';

/**
 *
 * @description 组件事件编辑区域
 */
export function ComponentEvent() {
	const { curComponent, updateComponentProps } = useComponentsStore();
	const { componentConfig } = useComponentConfigStore();
	const [actionModalOpen, setActionModalOpen] = useState(false);
	const [curEvent, setCurEvent] = useState<ComponentEvent>();

	if (!curComponent) return null;

	function deleteAction(event: ComponentEvent, index: number) {
		if (!curComponent) return;

		const actions = curComponent.props[event.name]?.actions;

		actions.splice(index, 1);

		updateComponentProps(curComponent.id, {
			[event.name]: {
				actions: actions,
			},
		});
	}

	const items: CollapseProps['items'] = (
		componentConfig[curComponent.name].events || []
	).map((event) => {
		return {
			key: event.name,
			label: (
				<div className='flex justify-between leading-[30px]'>
					{event.label}
					<Button
						type='primary'
						onClick={(e) => {
							e.stopPropagation();

							setCurEvent(event);
							setActionModalOpen(true);
						}}
					>
						添加动作
					</Button>
				</div>
			),
			children: (
				<div>
					{(curComponent.props[event.name]?.actions || []).map(
						(item: ActionConfig, index: number) => {
							return (
								<div>
									{item.type === 'goToLink' ? (
										<div className='border border-[#aaa] m-[10px] p-[10px] relative'>
											<div className='text-[blue]'>跳转链接</div>
											<div>{item.url}</div>
											<div
												style={{
													position: 'absolute',
													top: 10,
													right: 10,
													cursor: 'pointer',
												}}
												onClick={() => deleteAction(event, index)}
											>
												<DeleteOutlined />
											</div>
										</div>
									) : null}
									{item.type === 'showMessage' ? (
										<div className='border border-[#aaa] m-[10px] p-[10px] relative'>
											<div className='text-[blue]'>消息弹窗</div>
											<div>{item.config.type}</div>
											<div>{item.config.text}</div>
											<div
												style={{
													position: 'absolute',
													top: 10,
													right: 10,
													cursor: 'pointer',
												}}
												onClick={() => deleteAction(event, index)}
											>
												<DeleteOutlined />
											</div>
										</div>
									) : null}
								</div>
							);
						},
					)}
				</div>
			),
		};
	});

	function handleModalOk(config?: ActionConfig) {
		if (!config || !curEvent || !curComponent) return;

		updateComponentProps(curComponent.id, {
			[curEvent.name]: {
				actions: [
					...(curComponent.props[curEvent.name]?.actions || []),
					config,
				],
			},
		});

		setActionModalOpen(false);
	}

	return (
		<div className='px-[10px]'>
			<Collapse
				className='mb-[10px]'
				items={items}
				defaultActiveKey={componentConfig[curComponent.name].events?.map(
					(item) => item.name,
				)}
			/>
			<ActionModal
				visible={actionModalOpen}
				handleOk={handleModalOk}
				handleCancel={() => {
					setActionModalOpen(false);
				}}
			/>
		</div>
	);
}
