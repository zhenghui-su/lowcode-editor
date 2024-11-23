import { Table as AntdTable } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CommonComponentProps } from '../../interface';
/**
 * @description Table表格组件-prod预览状态
 */
const Table = ({ url, children }: CommonComponentProps) => {
	const [data, setData] = useState<Array<Record<string, any>>>([]);
	const [loading, setLoading] = useState(false);
	// prod的Table需要请求设置的url,拿到数据后设置到Table
	const getData = async () => {
		if (url) {
			setLoading(true);

			const { data } = await axios.get(url);
			setData(data);

			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);
	// 渲染列时, 如果是date用dayjs格式化
	const columns = useMemo(() => {
		return React.Children.map(children, (item: any) => {
			if (item?.props?.type === 'date') {
				return {
					title: item.props?.title,
					dataIndex: item.props?.dataIndex,
					render: (value: any) =>
						value ? dayjs(value).format('YYYY-MM-DD') : null,
				};
			} else {
				return {
					title: item.props?.title,
					dataIndex: item.props?.dataIndex,
				};
			}
		});
	}, [children]);

	return (
		<AntdTable
			columns={columns}
			dataSource={data}
			pagination={false}
			rowKey='id'
			loading={loading}
		/>
	);
};

export default Table;
