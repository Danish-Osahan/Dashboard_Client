/* eslint-disable no-unused-vars */
import BarChart from "../../Components/BarChart";
import styles from "./BarGraph.module.css";
import ham from "../../assets/ham.png";
import { useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";

const BarGraph = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <SideBar open={open} handleOpen={handleOpen} />
      <div className={styles.mainContainer}>
        <div className={styles.hamBurgerIcon} onClick={handleOpen}>
          <img src={ham} alt="DashBoard" />
        </div>
        <div className={styles.barGraph}>
          <BarChart />
        </div>
      </div>
    </>
  );
};

export default BarGraph;
