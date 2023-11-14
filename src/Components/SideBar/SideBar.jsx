/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Drawer from "@mui/material/Drawer";
import cross from "../../assets/cross.png";
import home from "../../assets/home.gif";
import bar from "../../assets/bar.gif";
import radar from "../../assets/radar.gif";
import { useState } from "react";
import styles from "./SideBar.module.css";
import { Link, useNavigate } from "react-router-dom";

const SideBar = ({ open, handleOpen }) => {

  return (
    <div>
      <Drawer
        anchor="left"
        autoFocus={false}
        open={open}
        ModalProps={{
          keepMounted: false,
        }}
        variant="temporary"
        key={open}
      >
        <div className={styles.sideBar}>
          <div className={styles.logo}>
            <p>InsightHub</p>
            <div
              className={styles.img}
              onClick={() => {
                handleOpen();
              }}
            >
              <img src={cross} alt="Not Found" />
            </div>
          </div>
          <Link
            to="/home"
            className={styles.sideItem}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#000000",
            }}
          >
            <div className={styles.icon}>
              <img src={home} alt="Not found" />
            </div>
            <p>Home</p>
          </Link>
          <Link
            className={styles.sideItem}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#000000",
            }}
            to="/barGraph"
          >
            <div className={styles.icon}>
              <img src={bar} alt="Not found" />
            </div>
            <p>ChartAnalytics</p>
          </Link>
          <Link
            className={styles.sideItem}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#000000",
            }}
            to="/radarChart"
          >
            <div className={styles.icon}>
              <img src={radar} alt="Not found" />
            </div>
            <p>RadarScope</p>
          </Link>
        </div>
      </Drawer>
    </div>
  );
};

export default SideBar;
