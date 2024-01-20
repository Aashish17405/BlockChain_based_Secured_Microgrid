import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Solar from "./Solar";
import Load from "./Load";
import Grid from "./Grid";
import Battery from "./Battery";
import Genset from "./Generator";
import { TbSolarElectricity } from "react-icons/tb";
import { FiBatteryCharging } from "react-icons/fi";
import { AiFillThunderbolt } from "react-icons/ai";
import { GiPowerGenerator } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { FaHouseChimneyCrack } from "react-icons/fa6";
import UseAnimations from "react-useanimations";
import arrowUp from 'react-useanimations/lib/arrowUp';
import Lottie from 'lottie-react';
import animationData from './abc.json';

const Organization = () => {
  const scrolltoTop = () => {
    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };

  const [showButton, setShowButton] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [cost, setCost] = useState(0.2);
  const [showSolarPage, setShowSolarPage] = useState(false);
  const [showBatteryPage, setShowBatteryPage] = useState(false);
  const [showGridPage, setShowGridPage] = useState(false);
  const [showLoadPage, setShowLoadPage] = useState(false);
  const [showGensetPage, setShowGensetPage] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setCost(e.target.value);
  };

  const handleSubmit = async () => {
    setIsClicked(!isClicked);

    if (!inputValue) {
      toast.error("Please enter a value for Genset cost");
      return;
    }

    if (isNaN(inputValue) || parseInt(inputValue) > 4) {
      toast.error("Genset cost can't exceed 5rs");
      setInputValue("");
    } else {
      try {
        await axios.post("http://localhost:5000/organization", {
          data: inputValue,
        });
        setInputValue("");
        console.log("List updated successfully");
        toast.success("Genset cost updated successfully!");
      } catch (error) {
        setInputValue("");
        console.error("Error updating list:", error);
        toast.error("Error updating genset cost");
      }
    }
  };

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
  const handleRegisterButtonClick = () => {
    window.location.href = "/register";
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

  useEffect(() => {
    const shouldShowLottie = !showSolarPage && !showBatteryPage && !showLoadPage && !showGensetPage && !showGridPage;
    setShowButton(!shouldShowLottie);
    setShowLottie(shouldShowLottie);
  }, [showSolarPage, showBatteryPage, showLoadPage, showGensetPage, showGridPage]);

  return (
    <>
      <div>
        <div>
          {/* {cost !== null ? (
                    <p>Cost from gen_cost endpoint: {cost}</p>
                ) : (
                    <p>Loading cost...</p>
                )} */}
        </div>
        <div className="inputoo">
          <label>Update the cost of Genset: </label>
          <input type="text" value={inputValue} placeholder={`current cost: ${cost}`} onChange={handleInputChange} className="inputField"/>
          <button className={isClicked ? "bottonoo" : "botton"} onClick={handleSubmit}>Update</button>
        </div>
        <div>
          <div className="row">
            <div className="col-1">
              <div className="buttoncontaineroo">
                <div>
                  {showButton && (<button style={{position:"fixed",bottom:"20px",right:"20px",padding:"10px",fontSize:"16px",borderRadius:"35px",}}onClick={scrolltoTop} ><UseAnimations animation={arrowUp} size={35} /></button>
                  )}
                </div>
                <button className="solaro" onClick={handleSolarButtonClick}> <TbSolarElectricity size={30} /> </button>
                <button className="batteryo" onClick={handleBatteryButtonClick}> <FiBatteryCharging size={30} /></button>
                <button className="loado" onClick={handleLoadButtonClick}><FaHouseChimneyCrack size={30} /></button>
                <button className="grido" onClick={handleGridButtonClick}><AiFillThunderbolt size={30} /></button>
                <button className="generatoro" onClick={handleGensetButtonClick}><GiPowerGenerator size={30} /></button>               
                <button className="loado" onClick={handleRegisterButtonClick}> <CgProfile /><FaPlus size={10} /></button>
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
          {showLottie && (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ marginLeft: "600px", width: "350px", height: "400px" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Organization;
