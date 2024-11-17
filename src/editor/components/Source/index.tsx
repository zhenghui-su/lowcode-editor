import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useComponentsStore } from '../../stores/components';
/**
 *
 * @description 左侧组件源码展示区域
 */
export function Source() {
	const { components } = useComponentsStore();
	// 格式化 ctrl + j 或 command + j
	const handleEditorMount: OnMount = (editor, monaco) => {
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
			editor.getAction('editor.action.formatDocument')?.run();
		});
	};

	return (
		<MonacoEditor
			height={'100%'}
			path='components.json'
			language='json'
			onMount={handleEditorMount}
			value={JSON.stringify(components, null, 2)}
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
			}}
		/>
	);
}
