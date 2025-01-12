import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
/**
 * 用于获取图表数据 - x轴数据、y轴数据、loading状态
 * @param urlArray 数据请求url数组
 * @param key 图表key
 * @returns x轴数据、y轴数据、loading状态
 */
export function useGetChartData(urlArray: string[], key: string) {
  const [xAxisData, setXAxisData] = useState<any[]>([]);
  const [YAxisData, setYAxisData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    if (urlArray.length === 2 && urlArray[0] && urlArray[1]) {
      setLoading(true);
      message.open({
        type: "loading",
        content: "加载数据中",
        duration: 0,
        key: key,
      });
      const { data: xAxisData } = await axios.get(urlArray[0]);
      const { data: YAxisData } = await axios.get(urlArray[1]);
      setXAxisData(xAxisData);
      setYAxisData(YAxisData);
      message.destroy(key);
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return {
    xAxisData,
    YAxisData,
    loading,
  };
}
