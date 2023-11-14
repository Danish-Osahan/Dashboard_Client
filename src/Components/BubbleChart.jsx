/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bubble } from "react-chartjs-2";
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);
const options = {
  plugins: {
    title: {
      display: true,
      text: "Multi-Dimensional Analysis: Impact, Intensity, and Relevance",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
const BubbleChart = () => {
  const url = import.meta.env.VITE_URL;
  const [bubbleData, setBubbleData] = useState([]);
  const fetchBarData = () => {
    axios
      .get(`${url}?fields=intensity,relevance,impact`)
      .then((response) => {
        const rawData = response.data;
        // Filter the data to exclude null values in sector, topic, and region
        const filteredData = rawData.filter(
          (dataPoint) => dataPoint.impact !== "" && dataPoint.relevance !== ""
        );

        // Set the filtered data to state or use it as needed
        setBubbleData(filteredData);

        console.log("Bubble Data is:", rawData.slice(0, 6));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const data = {
    datasets: [
      {
        label: "Intensity,Relevance,Impact",
        data: bubbleData.map((dataPoint) => ({
          x: dataPoint.intensity,
          y: dataPoint.relevance,
          r: dataPoint.impact,
        })),
        backgroundColor: "rgb(109,97,227)",
      },
    ],
  };
  useEffect(() => {
    fetchBarData();
  }, []);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Bubble options={options} data={data} />
    </div>
  );
};

export default BubbleChart;
