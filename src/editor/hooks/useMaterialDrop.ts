import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../stores/component-config';
import { getComponentById, useComponentsStore } from '../stores/components';

export interface ItemType {
	type: string;
	dragType?: 'move' | 'add';
	id: number;
}

/**
 *
 * @param accept 接受拖拽的类型
 * @param id 接受拖拽的组件id
 * @returns canDrop, drop
 */
export function useMaterialDrop(accept: string[], id: number) {
	const { components, addComponent, deleteComponent } = useComponentsStore();
	const { componentConfig } = useComponentConfigStore();

	const [{ canDrop }, drop] = useDrop(() => ({
		accept,
		drop: (item: ItemType, monitor) => {
			const didDrop = monitor.didDrop();
			if (didDrop) return;

			if (item.dragType === 'move') {
				const component = getComponentById(item.id, components)!;

				deleteComponent(item.id);

				addComponent(component, id);
			} else {
				const config = componentConfig[item.type];

				addComponent(
					{
						id: new Date().getTime(),
						name: item.type,
						desc: config.desc,
						props: config.defaultProps,
					},
					id,
				);
			}
		},
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
		}),
	}));

	return { canDrop, drop };
}
