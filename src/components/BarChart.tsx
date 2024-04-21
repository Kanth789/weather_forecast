import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface Props {
  dataset: {
    month: string | number | Date;
    seoul: number;
    time: string;
  }[];
}

const chartSetting = {
  yAxis: [{ label: 'Temperature °C' }],
  width: 1120,
  height: 400,
};

const valueFormatter = (value: number | null) => `${value}°C`;

const combineMonthAndTime = (data: { month: string | number | Date; time: string }[]) => {
  return data.map(item => ({
    ...item,
    label: `${item.month} - ${item.time}`
  }));
};

const HorizontalBars: React.FC<Props> = (props) => {
  const { dataset } = props;
  console.log(dataset.length)
  const combinedData = combineMonthAndTime(dataset);

  return (
    <BarChart
      dataset={combinedData}
      xAxis={[{ scaleType: 'band', dataKey: 'label', label: 'Time' }]} 
      series={[{ dataKey: 'seoul', valueFormatter }]}
      {...chartSetting}
    />
  );
};

export default HorizontalBars;
