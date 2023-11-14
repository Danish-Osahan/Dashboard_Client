/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
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
import { Bar } from "react-chartjs-2";
import filter from "../assets/filter.svg";
import styles from "./ChartStyles/LineChart.module.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { useEffect, useState } from "react";
import axios from "axios";
const options = {
  plugins: {
    title: {
      display: true,
      // text: "Exploring Intensity Variation in Different Regions and Sectors",
    },
  },
  responsive: true,
  interaction: {
    mode: "index",
    intersect: true,
  },
  scales: {
    x: {
      stacked: false,
    },
    y: {
      stacked: true,
    },
  },
};
const BarChart = () => {
  const [open, setOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("Northern America");
  const [selectedSector, setSelectedSector] = useState("Energy");

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };
  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const url = import.meta.env.VITE_URL;
  const [barData, setBarData] = useState([]);
  const [uniqueRegions, setRegions] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const fetchBarData = () => {
    axios
      .get(`${url}?fields=intensity,sector,topic,region,start_year`)
      .then((response) => {
        const rawData = response.data;
        // Filter the data to exclude null values in sector, topic, and region
        const filteredData = rawData.filter(
          (dataPoint) => dataPoint.sector !== "" && dataPoint.region !== ""
        );
        // Extract unique regions
        const uniqueRegions = [
          ...new Set(filteredData.map((dataPoint) => dataPoint.region)),
        ];

        // Extracting unique sectors
        const uniquesectors = [
          ...new Set(filteredData.map((dataPoint) => dataPoint.sector)),
        ];

        // set unique regions
        setUniqueSectors(uniquesectors);

        // Set unique regions to state or use them as needed
        setRegions(uniqueRegions);

        // Set the filtered data to state or use it as needed
        setBarData(filteredData.slice(0, 200));

        console.log("Bar Data is:", rawData.slice(0, 6));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const data = {
    labels: [...barData.map((item) => item.start_year)],
    datasets: [
      {
        label: "Intensity",
        data: barData.map((item) => item.intensity),
        backgroundColor: "rgb(109,97,227,0.7)",
        stack: "Stack 0",
        barThickness: 10,
        borderRadius: 4,
      },
      {
        label: `${selectedRegion} `,
        data: barData.map((item) =>
          item.region === selectedRegion ? item.intensity : 0
        ),
        backgroundColor: "rgba(53, 162, 235, 0.7)",
        stack: "Stack 0",
        barThickness: 10,
        borderRadius: 4,
      },
      {
        label: `${selectedSector}`,
        data: barData.map((item) =>
          item.sector === selectedSector ? item.intensity : 0
        ),
        backgroundColor: "rgb(252,4,4,0.7)",
        stack: "Stack 1",
        barThickness: 10,
        borderRadius: 4,
      },
    ],
  };

  useEffect(() => {
    fetchBarData();
  }, []);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div className={styles.title}>
        <p>Exploring Intensity Variation in Different Regions and Sectors</p>
      </div>
      <div className={styles.filter}>
        <Button onClick={handleClickOpen}>
          <img className={styles.filter_icon} src={filter} alt="Filter" />
        </Button>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle sx={{ color: "rgba(255, 99, 132)" }}>
            Select Region & Sector
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Region</InputLabel>
                <Select
                  native
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  input={
                    <OutlinedInput label="Regions" id="demo-dialog-native" />
                  }
                >
                  <option aria-label="None" value="" />
                  {uniqueRegions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="demo-dialog-native">Sectors</InputLabel>
                <Select
                  native
                  value={selectedSector}
                  onChange={handleSectorChange}
                  input={
                    <OutlinedInput label="Sectors" id="demo-dialog-native" />
                  }
                >
                  <option aria-label="None" value="" />
                  {uniqueSectors.map((item) => (
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
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
