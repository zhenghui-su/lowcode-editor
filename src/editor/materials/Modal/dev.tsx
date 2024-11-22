import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { CommonComponentProps } from '../../interface';

/**
 * @description 弹框组件-dev开发状态
 */
function Modal({ id, children, title, styles }: CommonComponentProps) {
	const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);
	// TODO 编辑区域也支持拖拽
	return (
		<div
			ref={drop}
			style={styles}
			data-component-id={id}
			className={`min-h-[100px] p-[20px] ${
				canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
			}`}
		>
			<h4>{title}</h4>
			<div>{children}</div>
		</div>
	);
}

export default Modal;
