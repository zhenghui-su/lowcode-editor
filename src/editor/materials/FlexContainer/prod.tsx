import { CommonComponentProps } from '../../interface';
/**
 * @description Flex容器组件-dev开发状态
 */
const FlexContainer = ({
	id,
	children,
	styles,
	gap,
	wrap,
	vertical,
	justify,
	align,
}: CommonComponentProps) => {
	return (
		<div
			data-component-id={id}
			className={`p-[20px]`}
			style={{
				display: 'flex',
				flexDirection: vertical ? 'column' : 'row',
				justifyContent: justify,
				alignItems: align,
				gap: gap,
				flexWrap: wrap ? 'wrap' : 'nowrap',
				...styles,
			}}
		>
			{children}
		</div>
	);
};

export default FlexContainer;
