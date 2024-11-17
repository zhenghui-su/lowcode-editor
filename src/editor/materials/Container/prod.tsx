import { CommonComponentProps } from '../../interface';
/**
 * @description 容器组件-prod预览状态
 */
const Container = ({ children, styles }: CommonComponentProps) => {
	return (
		<div style={styles} className={`p-[20px]`}>
			{children}
		</div>
	);
};

export default Container;
