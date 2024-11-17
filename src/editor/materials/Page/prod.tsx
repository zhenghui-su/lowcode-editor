import { CommonComponentProps } from '../../interface';
/**
 *
 * @description 页面组件-prod预览状态
 */
function Page({ children, styles }: CommonComponentProps) {
	return (
		<div className='p-[20px]' style={{ ...styles }}>
			{children}
		</div>
	);
}

export default Page;
