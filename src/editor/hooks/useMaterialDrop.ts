import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../stores/component-config';
import { useComponentsStore } from '../stores/components';
/**
 *
 * @param accept 接受拖拽的类型
 * @param id 接受拖拽的组件id
 * @returns canDrop, drop
 */
export function useMaterialDrop(accept: string[], id: number) {
	const { addComponent } = useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	const [{ canDrop }, drop] = useDrop(() => ({
		accept,
		drop: (item: { type: string }, monitor) => {
			const didDrop = monitor.didDrop();
			if (didDrop) return;

			const props = componentConfig[item.type].defaultProps;

			addComponent(
				{
					id: new Date().getTime(),
					name: item.type,
					props,
				},
				id,
			);
		},
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
		}),
	}));

	return { canDrop, drop };
}
