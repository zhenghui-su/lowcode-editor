import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

/**
 * @description 按钮组件-dev开发状态
 */
const Button = ({ id, type, text, styles }: CommonComponentProps) => {
	// TODO 编辑区域也支持拖拽
	return (
		<AntdButton data-component-id={id} type={type} style={styles}>
			{text}
		</AntdButton>
	);
};

export default Button;
