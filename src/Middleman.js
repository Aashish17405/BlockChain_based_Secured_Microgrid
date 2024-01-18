import React, { useState, useEffect } from "react";
import Solar from "./Solar";
import Load from "./Load";
import Grid from "./Grid";
import Battery from "./Battery";
import Genset from "./Generator";
import { TbSolarElectricity } from "react-icons/tb";
import { FiBatteryCharging } from "react-icons/fi";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiPowerGenerator } from "react-icons/gi";
import { FaHouseChimneyCrack } from "react-icons/fa6";
import { IoIosArrowDropupCircle } from "react-icons/io";

const Middleman = () => {
  const [showButton, setShowButton] = useState(false);

  const scrolltoTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };
  const [cost, setCost] = useState(0.2);
  const [showSolarPage, setShowSolarPage] = useState(false);
  const [showBatteryPage, setShowBatteryPage] = useState(false);
  const [showGridPage, setShowGridPage] = useState(false);
  const [showLoadPage, setShowLoadPage] = useState(false);
  const [showGensetPage, setShowGensetPage] = useState(false);

  const handleSolarButtonClick = () => {
    setShowSolarPage((prevState) => !prevState);
    setShowButton(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };
  const handleLoadButtonClick = () => {
    setShowLoadPage((prevState) => !prevState); 
    setShowButton(true);
    setTimeout(() => {
      window.scrollTo({
        top:800,
        behavior: "smooth",
      });
    }, 50);
  };
  const handleBatteryButtonClick = () => {
    setShowBatteryPage((prevState) => !prevState); 
    setShowButton(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };
  const handleGridButtonClick = () => {
    setShowGridPage((prevState) => !prevState); 
    setShowButton(true);
    setTimeout(() => {
      window.scrollTo({
        top: 120,
        behavior: "smooth",
      });
    }, 50);
  };
  const handleGensetButtonClick = () => {
    setShowGensetPage((prevState) => !prevState); 
    setShowButton(true);
    setTimeout(() => {
      window.scrollTo({
        top: 800,
        behavior: "smooth",
      });
    }, 50);
  };
  

  useEffect(() => {
    fetch("http://localhost:5005/gen_cost")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCost(data);
      })
      .catch((error) => {
        console.error("Error fetching cost data:", error);
      });
  }, []);

  return (
    <>
      <div>
        <div>
          <h5>Genset Cost: ₹{cost}</h5>
          <div className="row" >
            <div className="col-1">
              <div className="buttoncontaineroo" style={{marginTop:"50px"}}>
                <div>
                  {showButton && (<button style={{position:"fixed",bottom:"20px",right:"20px",padding:"10px",fontSize:"16px",borderRadius:"35px",}}onClick={scrolltoTop} ><IoIosArrowDropupCircle size={35} /></button>
                  )}
                </div>
                <button className="solaro" onClick={handleSolarButtonClick}> <TbSolarElectricity size={30} /> </button>
                <button className="batteryo" onClick={handleBatteryButtonClick}> <FiBatteryCharging size={30} /></button>
                <button className="loado" onClick={handleLoadButtonClick}><FaHouseChimneyCrack size={30} /></button>
                <button className="grido" onClick={handleGridButtonClick}><AiFillThunderbolt size={30} /></button>
                <button className="generatoro" onClick={handleGensetButtonClick}><GiPowerGenerator size={30} /></button>
              </div>
            </div>
            <div className="col-2">
              {showSolarPage && <Solar />}
              {showLoadPage && <Load />}
              {showBatteryPage && <Battery />}
            </div>
            <div className="col-3">
              {showGridPage && <Grid />}
              {showGensetPage && <Genset />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Middleman;