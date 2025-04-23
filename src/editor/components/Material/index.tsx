import { useMemo } from 'react';
import { useComponentConfigStore } from '../../stores/component-config';
import { MaterialItem } from '../MaterialItem';
/**
 * @description 左侧组件选择物料区域
 */
export function Material() {
	const { componentConfig } = useComponentConfigStore();

	const components = useMemo(() => {
		return Object.values(componentConfig).filter(
			(item) => item.name !== 'Page'
		);
	}, [componentConfig]);

	return (
		<div className='h-[calc(100vh-60px-30px-20px)] overflow-y-auto'>
			{components.map((item, index) => {
				return (
					<MaterialItem
						name={item.name}
						desc={item.desc}
						key={item.name + index}
					/>
				);
			})}
		</div>
	);
}
