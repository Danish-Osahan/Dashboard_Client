/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import styles from "./Home.module.css";
import LineChart from "../../Components/LineChart";
import BarChart from "../../Components/BarChart";
import RadarChart from "../../Components/RadarChart";
import region from "../../assets/region.png";
import country from "../../assets/country.png";
import sector from "../../assets/sector.png";
import topics from "../../assets/topics.png";
import intensity from "../../assets/intensity.png";
import relevant from "../../assets/relevant.png";
import likelihood from "../../assets/likelihood.png";
import impact from "../../assets/impact.png";
import ham from "../../assets/ham.png";
import BubbleChart from "../../Components/BubbleChart";
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../Components/SideBar/SideBar";

const Home = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const url = import.meta.env.VITE_URL;
  let sumIntensity = 0;
  let countIntensity = 0;
  let sumRelevance = 0;
  let countRelevance = 0;
  let sumLikelihood = 0;
  let countLikelihood = 0;
  let countimpact = 0;
  let sumimpact = 0;

  const [averageIntensity, setAverageIntensity] = useState(0);
  const [averageRelevance, setAverageRelevance] = useState(0);
  const [averageLikelihood, setAverageLikelihood] = useState(0);
  const [averageImpact, setAverageImpact] = useState(0);
  const fetchBarData = () => {
    axios
      .get(`${url}?fields=intensity,likelihood,relevance,impact`)
      .then((response) => {
        const filteredData = response.data.filter(
          (dataPoint) =>
            dataPoint.start_year !== null &&
            dataPoint.intensity !== null &&
            dataPoint.relevance !== ""
        );

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
          // Check if the data point has a valid impact
          if (dataPoint.impact !== null) {
            sumimpact += dataPoint.impact;
            countimpact++;
          }
        });
        const average_intensity =
          countIntensity > 0 ? sumIntensity / countIntensity : 0;

        const average_relevance =
          countRelevance > 0 ? sumRelevance / countRelevance : 0;
        const average_likelihood =
          countLikelihood > 0 ? sumLikelihood / countLikelihood : 0;
        let average_impact = countimpact > 0 ? sumimpact / countimpact : 0;
        average_impact = average_impact.toExponential(2);

        setAverageIntensity(average_intensity.toFixed(2));
        setAverageRelevance(average_relevance.toFixed(2));
        setAverageLikelihood(average_likelihood.toFixed(2));
        setAverageImpact(average_impact);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchBarData();
  }, []);
  return (
    <>
      <SideBar open={open} handleOpen={handleOpen} />
      <div className={styles.mainContainer}>
        <div className={styles.hamBurgerIcon} onClick={handleOpen}>
          <img src={ham} alt="DashBoard" />
        </div>
        <div className={styles.line_bar_cahrt_div}>
          <div className={styles.CardSectionDiv}>
            <div className={styles.row_div}>
              <div className={styles.item}>
                <div>
                  <p>Regions</p>
                  <p style={{ marginTop: "-0.5rem" }}>22</p>
                </div>
                <div className={styles.imageDiv}>
                  <img
                    src={country}
                    alt="Not found"
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                </div>
              </div>
              <div className={styles.item}>
                <div>
                  <p>Country</p>
                  <p style={{ marginTop: "-0.5rem" }}>55</p>
                </div>
                <div className={styles.imageDiv}>
                  <img
                    src={region}
                    alt="Not found"
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.row_div}>
              <div className={styles.item}>
                <div>
                  <p>Sector</p>
                  <p style={{ marginTop: "-0.5rem" }}>17</p>
                </div>
                <div className={styles.imageDiv}>
                  <img
                    src={sector}
                    alt="Not found"
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                </div>
              </div>
              <div className={styles.item}>
                <div>
                  <p>Topics</p>
                  <p style={{ marginTop: "-0.5rem" }}>97</p>
                </div>
                <div className={styles.imageDiv}>
                  <img
                    src={topics}
                    alt="Not found"
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.lineChart}>
            <LineChart />
          </div>
        </div>

        <div className={styles.line_bar_cahrt_div}>
          <div className={styles.lineChart}>
            <BubbleChart />
          </div>

          <div className={styles.static_data}>
            <div className={styles.static_data_item}>
              <div className={styles.icon}>
                <img
                  src={intensity}
                  alt="Not found"
                  style={{ objectFit: "contain", width: "100%" }}
                />
              </div>
              <p>Avg.Intensity </p>
              <p>{averageIntensity}</p>
            </div>
            <div className={styles.static_data_item}>
              <div className={styles.icon}>
                <img
                  src={relevant}
                  alt="Not found"
                  style={{ objectFit: "contain", width: "100%" }}
                />
              </div>
              <p>Avg.Relevance</p>
              <p>{averageRelevance}</p>
            </div>
            <div className={styles.static_data_item}>
              <div className={styles.icon}>
                <img
                  src={likelihood}
                  alt="Not found"
                  style={{ objectFit: "contain", width: "100%" }}
                />
              </div>
              <p>Avg.Likelihood</p>
              <p>{averageLikelihood}</p>
            </div>
            <div className={styles.static_data_item}>
              <div className={styles.icon}>
                <img
                  src={impact}
                  alt="Not found"
                  style={{ objectFit: "contain", width: "100%" }}
                />
              </div>
              <p>Avg.Impact</p>
              <p>{averageImpact}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
