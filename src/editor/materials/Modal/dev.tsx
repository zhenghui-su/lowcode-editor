import { useEffect, useRef } from "react";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";

/**
 * @description 弹框组件-dev开发状态
 */
function Modal({ id, name, children, title, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    [
      "Button",
      "Container",
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
    ],
    id
  );

  const divRef = useRef<HTMLDivElement>(null);

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  });

  useEffect(() => {
    // 需要将modal里面的所有drag,drop都进行处理
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      ref={divRef}
      style={styles}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}

export default Modal;
