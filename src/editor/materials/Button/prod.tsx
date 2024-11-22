import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

/**
 * @description 按钮组件-prod预览状态
 */
const Button = ({ id, type, text, styles, ...props }: CommonComponentProps) => {
	return (
		<AntdButton type={type} style={styles} {...props}>
			{text}
		</AntdButton>
	);
};

export default Button;
