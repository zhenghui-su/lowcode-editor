import { useState } from 'react';
import { useComponentsStore } from '../../../stores/components';
import TextArea from 'antd/es/input/TextArea';

export interface GoToLinkConfig {
	type: 'goToLink';
	url: string;
}

export interface GoToLinkProps {
	defaultValue?: string;
	onChange?: (config: GoToLinkConfig) => void;
}

/**
 * @description 跳转链接事件行为
 */
export function GoToLink(props: GoToLinkProps) {
	const { defaultValue, onChange } = props;

	const { curComponentId } = useComponentsStore();
	const [value, setValue] = useState(defaultValue);
	// 修改链接时的事件暴露出去
	function urlChange(value: string) {
		if (!curComponentId) return;

		setValue(value);

		onChange?.({
			type: 'goToLink',
			url: value,
		});
	}

	return (
		<div className='mt-[40px]'>
			<div className='flex items-center gap-[10px]'>
				<div>跳转链接</div>
				<div>
					<TextArea
						style={{ height: 200, width: 500, border: '1px solid #000' }}
						onChange={(e) => {
							urlChange(e.target.value);
						}}
						value={value || ''}
					/>
				</div>
			</div>
		</div>
	);
}
