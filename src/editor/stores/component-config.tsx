import { create } from 'zustand';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonDev from '../materials/Button/dev';
import ButtonProd from '../materials/Button/prod';
import ModalDev from '../materials/Modal/dev';
import ModalProd from '../materials/Modal/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';
import TableDev from '../materials/Table/dev';
import TableProd from '../materials/Table/prod';
import TableColumnDev from '../materials/TableColumn/dev';
import TableColumnProd from '../materials/TableColumn/prod';

/**
 * 组件属性表单配置
 */
export interface ComponentSetter {
	name: string;
	label: string;
	type: string;
	[key: string]: any;
}
/**
 * 组件事件
 */
export interface ComponentEvent {
	name: string;
	label: string;
}
/**
 * 组件方法配置-用于组件联动
 */
export interface ComponentMethod {
	name: string;
	label: string;
}
/**
 * 组件配置
 */
export interface ComponentConfig {
	name: string;
	defaultProps: Record<string, any>;
	desc: string;
	setter?: ComponentSetter[]; // 属性配置
	stylesSetter?: ComponentSetter[]; // 样式配置
	events?: ComponentEvent[]; // 事件配置
	methods?: ComponentMethod[]; // 方法配置
	dev: any;
	prod: any;
}
// 组件映射配置
// key: 组件名 value: 组件配置(包括组件实例、默认参数)
interface State {
	componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
	registerConfig: (name: string, componentConfig: ComponentConfig) => void;
}
/**
 * 组件配置 store
 */
export const useComponentConfigStore = create<State & Action>((set) => ({
	componentConfig: {
		Container: {
			name: 'Container',
			defaultProps: {},
			desc: '容器',
			dev: ContainerDev,
			prod: ContainerProd,
		},
		Button: {
			name: 'Button',
			defaultProps: {
				type: 'primary',
				text: '按钮',
			},
			setter: [
				{
					name: 'type',
					label: '按钮类型',
					type: 'select',
					options: [
						{ label: '主按钮', value: 'primary' },
						{ label: '次按钮', value: 'default' },
					],
				},
				{
					name: 'text',
					label: '文本',
					type: 'input',
				},
			],
			stylesSetter: [
				{
					name: 'width',
					label: '宽度',
					type: 'inputNumber',
				},
				{
					name: 'height',
					label: '高度',
					type: 'inputNumber',
				},
			],
			events: [
				{
					name: 'onClick',
					label: '点击事件',
				},
				{
					name: 'onDoubleClick',
					label: '双击事件',
				},
			],
			desc: '按钮',
			dev: ButtonDev,
			prod: ButtonProd,
		},
		Modal: {
			name: 'Modal',
			defaultProps: {
				title: '弹窗',
			},
			setter: [
				{
					name: 'title',
					label: '标题',
					type: 'input',
				},
			],
			stylesSetter: [],
			events: [
				{
					name: 'onOpen',
					label: '确认事件',
				},
				{
					name: 'onClose',
					label: '取消事件',
				},
			],
			methods: [
				{
					name: 'open',
					label: '打开弹窗',
				},
				{
					name: 'close',
					label: '关闭弹窗',
				},
			],
			desc: '弹窗',
			dev: ModalDev,
			prod: ModalProd,
		},
		Page: {
			name: 'Page',
			defaultProps: {},
			desc: '页面',
			dev: PageDev,
			prod: PageProd,
		},
		Table: {
			name: 'Table',
			defaultProps: {},
			desc: '表格',
			setter: [
				{
					name: 'url',
					label: 'url',
					type: 'input',
				},
			],
			dev: TableDev,
			prod: TableProd,
		},
		TableColumn: {
			name: 'TableColumn',
			defaultProps: {
				dataIndex: `col_${new Date().getTime()}`,
				title: '列名',
			},
			desc: '表格列',
			setter: [
				{
					name: 'type',
					label: '类型',
					type: 'select',
					options: [
						{
							label: '文本',
							value: 'text',
						},
						{
							label: '日期',
							value: 'date',
						},
					],
				},
				{
					name: 'title',
					label: '标题',
					type: 'input',
				},
				{
					name: 'dataIndex',
					label: '字段',
					type: 'input',
				},
			],
			dev: TableColumnDev,
			prod: TableColumnProd,
		},
	},
	registerConfig: (name, componentConfig) =>
		set((state) => {
			return {
				...state,
				componentConfig: {
					...state.componentConfig,
					[name]: componentConfig,
				},
			};
		}),
}));
