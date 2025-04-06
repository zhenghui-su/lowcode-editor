import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { Flex } from "antd";
/**
 * @description Flex容器组件-dev开发状态
 */
const FlexContainer = ({
  id,
  name,
  children,
  styles,
  gap,
  wrap,
  vertical,
  justify,
  align,
}: CommonComponentProps) => {
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
      "Sankey",
      "Globe",
      "River",
      "Candlestick",
      "Funnel",
      "Pressure",
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
    // 需要将container里面的所有drag,drop都进行处理
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      data-component-id={id}
      ref={divRef}
      style={styles}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      <Flex
        gap={gap}
        wrap={wrap}
        vertical={vertical}
        justify={justify}
        align={align}
      >
        {children}
      </Flex>
    </div>
  );
};

export default FlexContainer;
