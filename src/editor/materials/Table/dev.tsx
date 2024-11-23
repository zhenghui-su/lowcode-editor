import React, { useEffect, useMemo, useRef } from 'react';
import { Table as AntdTable } from 'antd';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';
/**
 * @description Table表格组件-dev开发状态
 */
function Table({ id, name, children, styles }: CommonComponentProps) {
	const { canDrop, drop } = useMaterialDrop(['TableColumn'], id);

	const divRef = useRef<HTMLDivElement>(null);

	const [_, drog] = useDrag({
		type: name,
		item: {
			type: name,
			dragType: 'move',
			id: id,
		},
	});

	useEffect(() => {
		drop(divRef);
		drog(divRef);
	}, []);
	// 拖拽TableColum组件进来时处理成antd的columns列表形式
	const columns = useMemo(() => {
		return React.Children.map(children, (item: any) => {
			return {
				title: (
					<div
						className='m-[-16px] p-[16px]'
						data-component-id={item.props?.id}
					>
						{item.props?.title}
					</div>
				),
				dataIndex: item.props?.dataIndex,
				key: item,
			};
		});
	}, [children]);

	return (
		<div
			className={`w-[100%] ${
				canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
			}`}
			ref={divRef}
			data-component-id={id}
			style={styles}
		>
			<AntdTable columns={columns} dataSource={[]} pagination={false} />
		</div>
	);
}

export default Table;
