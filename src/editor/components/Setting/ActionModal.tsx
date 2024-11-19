import { useState } from 'react';
import { Modal, Segmented } from 'antd';
import { GoToLink } from './actions/GoToLink';
import { ShowMessage } from './actions/ShowMessage';
import { ActionConfig } from './actions/actionConfig';

interface ActionModalProps {
	visible: boolean;
	handleOk: (config?: ActionConfig) => void;
	handleCancel: () => void;
}
/**
 * 组件事件动作配置弹窗
 */
export function ActionModal(props: ActionModalProps) {
	const { visible, handleOk, handleCancel } = props;

	const [key, setKey] = useState<string>('访问链接');
	const [curConfig, setCurConfig] = useState<ActionConfig>();

	return (
		<Modal
			title='事件动作配置'
			width={800}
			open={visible}
			okText='确定'
			cancelText='取消'
			onOk={() => handleOk(curConfig)}
			onCancel={handleCancel}
		>
			<div className='h-[500px]'>
				<Segmented
					value={key}
					onChange={setKey}
					block
					options={['访问链接', '消息提示', '自定义 JS']}
				/>
				{key === '访问链接' && (
					<GoToLink
						onChange={(config) => {
							setCurConfig(config);
						}}
					/>
				)}
				{key === '消息提示' && (
					<ShowMessage
						onChange={(config) => {
							setCurConfig(config);
						}}
					/>
				)}
			</div>
		</Modal>
	);
}
