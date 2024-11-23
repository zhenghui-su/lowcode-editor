import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';

/**
 * @description 按钮组件-dev开发状态
 */
const Button = ({ id, type, text, styles }: CommonComponentProps) => {
	const [_, drag] = useDrag({
		type: 'Button',
		item: {
			type: 'Button',
			dragType: 'move',
			id: id,
		},
	});

	return (
		<AntdButton ref={drag} data-component-id={id} type={type} style={styles}>
			{text}
		</AntdButton>
	);
};

export default Button;
