import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

export interface EditorFile {
	name: string;
	value: string;
	language: string;
}

interface CssEditorProps {
	value: string;
	onChange?: EditorProps['onChange'];
	options?: editor.IStandaloneEditorConstructionOptions;
}
/**
 * @description: css编辑器
 */
export default function CssEditor(props: CssEditorProps) {
	const { value, onChange, options } = props;

	const handleEditorMount: OnMount = (editor, monaco) => {
		// 支持ctrl + j或cmd + j 格式化代码
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
			editor.getAction('editor.action.formatDocument')?.run();
		});
	};

	return (
		<MonacoEditor
			height={'100%'}
			path='component.css'
			language='css'
			onMount={handleEditorMount}
			onChange={onChange}
			value={value}
			options={{
				fontSize: 14,
				scrollBeyondLastLine: false,
				minimap: {
					enabled: false,
				},
				scrollbar: {
					verticalScrollbarSize: 6,
					horizontalScrollbarSize: 6,
				},
				...options,
			}}
		/>
	);
}
