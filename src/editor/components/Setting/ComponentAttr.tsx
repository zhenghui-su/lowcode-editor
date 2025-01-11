import { Form, Input, Select, Slider, Switch } from "antd";
import { useComponentsStore } from "../../stores/components";
import {
  ComponentSetter,
  useComponentConfigStore,
} from "../../stores/component-config";
import { useEffect, useState } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { debounce } from "lodash-es";

/**
 *
 * @description 组件属性设置区域
 */
export function ComponentAttr() {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [chartOptions, setChartOptions] = useState(
    JSON.stringify(curComponent?.props.options, null, 2)
  );

  // 格式化 ctrl + j 或 command + j
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };
  useEffect(() => {
    setChartOptions(JSON.stringify(curComponent?.props.options, null, 2));
    form.resetFields();
    form.setFieldsValue({ ...curComponent?.props });
  }, [curComponent]);
  useEffect(() => {
    // 折线图属性初始化
    updateLineFromOptions(curComponent, form);
    // 柱状图属性初始化
    updateBarFromOptions(curComponent, form);
  }, [curComponent]);
  // 没有选择组件时候返回null
  if (!curComponentId || !curComponent) return null;
  // 根据组件配置信息渲染表单项
  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;

    switch (type) {
      case "select":
        return <Select options={options} />;
      case "input":
        return <Input />;
      case "switch":
        return <Switch />;
      case "slider":
        return <Slider min={0} defaultValue={0} max={100} />;
      case "json":
        return (
          <div className="h-[200px] border-[1px] border-[#ccc] z-10">
            <MonacoEditor
              height={"100%"}
              path="options.json"
              language="json"
              onMount={handleEditorMount}
              onChange={handleEditorChange}
              value={chartOptions}
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
          </div>
        );
    }
  }
  const handleEditorChange = debounce((value) => {
    setChartOptions(value);
    try {
      const options = JSON.parse(value);
      updateComponentProps(curComponentId, { options });
      updateLineFromOptions(curComponent, form);
      updateBarFromOptions(curComponent, form);
    } catch (e) {}
  }, 500);
  // 当表单 value 变化的时候，同步到 store
  function valueChange(changeValues: any) {
    if (curComponent?.name === "Line" && curComponentId) {
      if (changeValues.lineXAxisUrl || changeValues.lineYAxisUrl) {
        updateComponentProps(curComponentId, changeValues);
      }
      let options = JSON.parse(chartOptions);
      // 标题
      options.title.text = changeValues.title || options.title.text;
      // 边界间隔
      options.xAxis.boundaryGap =
        changeValues.boundaryGap ?? options.xAxis.boundaryGap;
      options.series.map((item: any) => {
        // 平滑曲线
        item.smooth = changeValues.smooth || item.smooth;
        // 面积图透明度
        item.areaStyle.opacity =
          changeValues.areaStyleOpacity / 100 || item.areaStyle.opacity;
      });
      setChartOptions(JSON.stringify(options, null, 2));
      updateComponentProps(curComponentId, { options });
    } else if (curComponent?.name === "Bar" && curComponentId) {
      let options = JSON.parse(chartOptions);
      // 轴刻度对齐标签
      options.xAxis.axisTick.alignWithLabel =
        changeValues.alignWithLabel ?? options.xAxis.axisTick.alignWithLabel;
      setChartOptions(JSON.stringify(options, null, 2));
      updateComponentProps(curComponentId, { options });
    } else if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  }
  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[curComponent.name]?.setter?.map((setter) => (
        <Form.Item
          key={setter.name}
          name={setter.name}
          label={setter.label}
          rules={
            setter.required
              ? [
                  {
                    required: true,
                    message: "不能为空",
                  },
                ]
              : []
          }
        >
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
}

function updateLineFromOptions(curComponent: any, form: any) {
  if (curComponent?.name === "Line") {
    const { title } = curComponent.props.options;
    const { text } = title;
    const { smooth } = curComponent.props.options.series[0];
    const areaStyleOpacity =
      curComponent.props.options.series[0].areaStyle.opacity * 100;
    const boundaryGap = curComponent.props.options.xAxis.boundaryGap;
    form.setFieldsValue({ title: text, smooth, areaStyleOpacity, boundaryGap });
  }
}

function updateBarFromOptions(curComponent: any, form: any) {
  if (curComponent?.name === "Bar") {
    const { alignWithLabel } = curComponent.props.options.xAxis.axisTick;
    form.setFieldsValue({ alignWithLabel });
  }
}
