import { CommonComponentProps } from "../../interface";
import { Flex } from "antd";
/**
 * @description Flex容器组件-dev开发状态
 */
const FlexContainer = ({
  id,
  children,
  styles,
  gap,
  wrap,
  vertical,
  justify,
  align,
}: CommonComponentProps) => {
  return (
    <div data-component-id={id} style={styles} className={`p-[20px]`}>
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
