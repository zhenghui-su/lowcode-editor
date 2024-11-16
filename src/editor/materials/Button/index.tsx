import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

/**
 * @description 按钮组件
 */

const Button = ({ id, type, text, styles }: CommonComponentProps) => {
	return (
		<AntdButton data-component-id={id} type={type} style={styles}>
			{text}
		</AntdButton>
	);
};

export default Button;
