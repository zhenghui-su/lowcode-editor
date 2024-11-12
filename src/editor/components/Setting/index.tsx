import { useComponentsStore } from '../../stores/components';
/**
 * @description 组件 JSON 结构
 */
export function Setting() {
	const { components } = useComponentsStore();

	return (
		<div>
			<pre>{JSON.stringify(components, null, 2)}</pre>
		</div>
	);
}
