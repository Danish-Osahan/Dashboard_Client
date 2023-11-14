/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import Switch from "@mui/material/Switch";
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
import filter from "../assets/filter.svg";
import styles from "./ChartStyles/RadarChart.module.css";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const url = import.meta.env.VITE_URL;
  const [radialChartData, setRadialChartData] = useState([]);
  const [showChart, setShowChart] = useState(true);
  const [attribute, setAttribute] = useState("PESTLE");
  const Attributes = ["PESTLE", "SECTOR", "TOPIC"];
  //   intensity range factor
  const [uniqueIntensity, setUniqueIntensity] = useState([]);
  const [intensity, setIntensity] = useState(1);

  //   unique topics
  const [uniqueTopics, setUniqueTopics] = useState([]);
  // const [topic, setTopic] = useState("");

  // const handleImpactChange = (event) => {
  //   setImpact(event.target.value);
  // };
  const handleIntensityChange = (event) => {
    setIntensity(event.target.value);
  };
  const handleAttributeChange = (event) => {
    setAttribute(event.target.value);
  };
  const handleChange = (event) => {
    setShowChart(event.target.checked);
  };
  const fetchBarData = () => {
    axios
      .get(`${url}?fields=intensity,pestle,impact,sector,topic`)
      .then((response) => {
        const filteredData = response.data.filter(
          (dataPoint) =>
            dataPoint.pestle !== null &&
            dataPoint.impact !== null &&
            dataPoint.intensity !== null &&
            dataPoint.sector !== null &&
            dataPoint.topic !== null
        );
        setRadialChartData(filteredData);

        // getting unique intensities
        const rawIntensity = [
          ...new Set(filteredData.map((item) => item.intensity)),
        ];

        // getting unique topics
        // const rawTopics = [...new Set(filteredData.map((item) => item.topic))];

        setUniqueIntensity(rawIntensity);
        // setUniqueTopics(rawTopics);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const pestlelLabels = [
    ...new Set(radialChartData.map((item) => item.pestle)),
  ];
  const sectorLabels = [...new Set(radialChartData.map((item) => item.sector))];
  const topicLabels = [...new Set(radialChartData.map((item) => item.topic))];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Multivariate Analysis: ${attribute} Factors, Impact, and Intensity`,
      },
    },
  };
  const data = {
    labels:
      (attribute.toLowerCase() == "pestle" && pestlelLabels) ||
      (attribute.toLowerCase() == "sector" && sectorLabels) ||
      (attribute.toLowerCase() == "topic" && topicLabels.slice(0,25)),

    datasets: [
      showChart
        ? {
            label: "Intensity",
            data: radialChartData.map(
              (item) => item.intensity >= intensity && item.intensity
            ),
            backgroundColor: "rgb(53, 162, 235,0.5)",
            borderColor: "rgb(53, 162, 235)",
            borderWidth: 2,
          }
        : {
            label: "Intensity",
            backgroundColor: "rgb(53, 162, 235,0.5)",
            borderColor: "rgb(53, 162, 235)",
            borderWidth: 2,
          },
      {
        label: "Impact",
        data: radialChartData.map((item) => item.impact),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };
  useEffect(() => {
    console.log("api called");
    fetchBarData();
  }, [intensity]);
  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div className={styles.switch}>
        <Switch
          checked={showChart}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
      <div className={styles.filter}>
        <Button onClick={handleClickOpen}>
          <img src={filter} alt="Filter" className={styles.filter_icon} />
        </Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle sx={{ color: "rgba(255, 99, 132)" }}>
            Filters
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Attributes</InputLabel>
                <Select
                  native
                  value={attribute}
                  onChange={handleAttributeChange}
                  input={
                    <OutlinedInput label="Attributes" id="demo-dialog-native" />
                  }
                >
                  {/* <option aria-label="None" value="" /> */}
                  {Attributes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Intensity</InputLabel>
                <Select
                  native
                  value={intensity}
                  onChange={handleIntensityChange}
                  input={
                    <OutlinedInput label="Intensity" id="demo-dialog-native" />
                  }
                >
                  {/* <option aria-label="None" value="" /> */}
                  {uniqueIntensity
                    .sort((a, b) => a - b)
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
              </FormControl>
              {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Impact</InputLabel>
                <Select
                  native
                  value={Impact}
                  onChange={handleImpactChange}
                  input={
                    <OutlinedInput label="Impact" id="demo-dialog-native" />
                  }
                >
                  <option aria-label="None" value="" />
                  {uniqueImpact
                    .sort((a, b) => a - b)
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </Select>
              </FormControl> */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
