import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
/**
 *
 * @description 页面组件-dev开发状态
 */
function Page({ id, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    [
      "Button",
      "Container",
      "Modal",
      "Table",
      "Form",
      "Line",
      "Bar",
      "Pie",
      "Scatter",
      "Radar",
      "HeatMap",
      "Sunburst",
      "Parallel",
      "Sankey",
    ],
    id
  );

  return (
    <div
      data-component-id={id}
      ref={drop}
      className="p-[20px] box-border h-[100%] overflow-y-auto"
      style={{ ...styles, border: canDrop ? "2px solid blue" : "none" }}
    >
      {children}
    </div>
  );
}

export default Page;
