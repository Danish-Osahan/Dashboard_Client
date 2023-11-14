/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styles from "./ChartStyles/LineChart.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import filter from "../assets/filter.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      // text: "Start Year Impact on Intensity, Relevance, and Likelihood",
    },
  },
};

const LineChart = () => {
  let sumIntensity = 0;
  let countIntensity = 0;
  let sumRelevance = 0;
  let countRelevance = 0;
  let sumLikelihood = 0;
  let countLikelihood = 0;
  const url = import.meta.env.VITE_URL;
  const [lineChartData, setLineChartData] = useState([]);
  const [open, setOpen] = useState(false);

  const [topicRange, setTopicRange] = useState([]);
  const [selectedtopic, setTopic] = useState("");
  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const labels = [...new Set(lineChartData.map((item) => item.start_year))];
  const data = {
    labels,
    datasets: [
      {
        label: "Intensity",
        data: lineChartData.map((item) =>
          selectedtopic == ""
            ? item.intensity
            : item.country == selectedtopic && item.intensity
        ),
        borderColor: "rgb(109,97,227)",
        backgroundColor: "rgb(109,97,227,0.5)",
      },
      {
        label: "Relevance",
        data: lineChartData.map((item) => item.relevance),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Likelihood",
        data: lineChartData.map((item) => item.likelihood),
        borderColor: "rgb(252,4,4)",
        backgroundColor: "rgb(252,4,4,0.5)",
      },
    ],
  };

  const fetchBarData = () => {
    axios
      .get(
        `${url}?fields=intensity,likelihood,relevance,start_year,topic,country`
      )
      .then((response) => {
        const filteredData = response.data.filter(
          (dataPoint) =>
            dataPoint.start_year !== null &&
            dataPoint.intensity !== null &&
            dataPoint.relevance !== ""
        );
        const uniqueIntensity = [
          ...new Set(filteredData.map((item) => item.country)),
        ];

        filteredData.forEach((dataPoint) => {
          // Check if the data point has a valid intensity
          if (dataPoint.intensity !== null) {
            sumIntensity += dataPoint.intensity;
            countIntensity++;
          }

          // Check if the data point has a valid relevance
          if (dataPoint.relevance !== "") {
            sumRelevance += parseFloat(dataPoint.relevance);
            countRelevance++;
          }

          // Check if the data point has a valid likelihood
          if (dataPoint.likelihood !== null) {
            sumLikelihood += dataPoint.likelihood;
            countLikelihood++;
          }
        });
        const averageIntensity =
          countIntensity > 0 ? sumIntensity / countIntensity : 0;
        const averageRelevance =
          countRelevance > 0 ? sumRelevance / countRelevance : 0;
        const averageLikelihood =
          countLikelihood > 0 ? sumLikelihood / countLikelihood : 0;
        // setting unique intensity Range
        setTopicRange(uniqueIntensity);

        setLineChartData(filteredData);
        // console.log("line Chart Data is :- ", response?.data.slice(0, 6));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchBarData();
  }, []);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div className={styles.title}>
        <p>Start Year Impact on Intensity, Relevance, and Likelihood</p>
      </div>
      <div className={styles.filter}>
        <Button onClick={handleClickOpen}>
          <img className={styles.filter_icon} src={filter} alt="Filter" />
        </Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle sx={{ color: "#8364E8" }}>Select Country</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Country</InputLabel>
                <Select
                  native
                  value={selectedtopic}
                  onChange={handleTopicChange}
                  input={
                    <OutlinedInput label="Regions" id="demo-dialog-native" />
                  }
                >
                  <option aria-label="None" value="" />
                  {topicRange
                    .filter((item) => item !== "")
                    .map((item, index) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
