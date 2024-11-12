import { CommonComponentProps } from '../../interface';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

function Page({ id, children }: CommonComponentProps) {
	const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);

	return (
		<div
			ref={drop}
			className='p-[20px] h-[100%] box-border'
			style={{ border: canDrop ? '2px solid blue' : 'none' }}
		>
			{children}
		</div>
	);
}

export default Page;
