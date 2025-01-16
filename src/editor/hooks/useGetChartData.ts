import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
/**
 * 用于获取图表数据
 * @param urlArray 数据请求url数组
 * @param key 图表key
 * @returns x轴数据、y轴数据、loading状态
 */
export function useGetChartData(urlArray: string[], key: string) {
  const [xAxisData, setXAxisData] = useState<any[]>([]);
  const [YAxisData, setYAxisData] = useState<any[]>([]);
  const [axisData, setAxisData] = useState<any[]>([]);
  const [radarIndicator, setRadarIndicator] = useState<any>([]);
  const [radarSeriesData, setRadarSeriesData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    if (key === "radar" && urlArray.length === 2) {
      setLoading(true);
      message.open({
        type: "loading",
        content: "加载数据中",
        duration: 0,
        key: key,
      });
      try {
        if (urlArray[0]) {
          const { data: indicator } = await axios.get(urlArray[0]);
          setRadarIndicator(indicator);
        }
        if (urlArray[1]) {
          const { data: seriesData } = await axios.get(urlArray[1]);
          setRadarSeriesData(seriesData);
        }
      } catch {
        message.error("数据获取失败");
      } finally {
        message.destroy(key);
        setLoading(false);
      }
    } else if (urlArray.length === 1 && urlArray[0]) {
      setLoading(true);
      message.open({
        type: "loading",
        content: "加载数据中",
        duration: 0,
        key: key,
      });
      try {
        const { data } = await axios.get(urlArray[0]);
        setAxisData(data);
      } catch (error) {
        message.error("数据获取失败");
      } finally {
        message.destroy(key);
        setLoading(false);
      }
    } else if (urlArray.length === 2 && urlArray[0] && urlArray[1]) {
      setLoading(true);
      message.open({
        type: "loading",
        content: "加载数据中",
        duration: 0,
        key: key,
      });
      try {
        const { data: xAxisData } = await axios.get(urlArray[0]);
        const { data: YAxisData } = await axios.get(urlArray[1]);
        setXAxisData(xAxisData);
        setYAxisData(YAxisData);
      } catch (error) {
        message.error("数据获取失败");
      } finally {
        message.destroy(key);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return {
    axisData,
    xAxisData,
    YAxisData,
    radarIndicator,
    radarSeriesData,
    loading,
  };
}
