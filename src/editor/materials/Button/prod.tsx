import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

/**
 * @description 按钮组件-prod预览状态
 */

const Button = ({ type, text, styles }: CommonComponentProps) => {
	return (
		<AntdButton type={type} style={styles}>
			{text}
		</AntdButton>
	);
};

export default Button;
