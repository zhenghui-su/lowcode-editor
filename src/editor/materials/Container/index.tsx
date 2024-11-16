import { CommonComponentProps } from '../../interface';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
/**
 * @description 容器组件
 */
const Container = ({ id, children, styles }: CommonComponentProps) => {
	const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);

	return (
		<div
			data-component-id={id}
			ref={drop}
			style={styles}
			className={`min-h-[100px] p-[20px] ${
				canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
			}`}
		>
			{children}
		</div>
	);
};

export default Container;
