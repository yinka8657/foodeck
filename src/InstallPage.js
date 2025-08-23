// src/InstallPage.js
import React from "react";
import "./App.css"; // optional for styling
import logo from './logo2.svg'

const InstallPage = () => {
  return (
    <div className="install-container FullHeight">
        <div className="InstallHeaderContainer" style={{padding:"30px"}}>
            <div className="TxtCont" style={{position:"absolute", padding:'20px', margin:'auto', textAlign:'center', color:'white'}}>
                <img src={logo} alt="logo" style={{ width: '40%' }}/>
                <h1>Install Afrifoody</h1>
                <p>
                    You can install Afrifoody on your phone for a faster, app-like experience.
                </p>
            </div>
        </div>
        <div className="HowToInstallTxt">
            <h2>For iPhone (Safari):</h2>
            <ol>
                <li>Tap the <strong>Share</strong> button (the square with an arrow).</li>
                <li>Select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong>.</li>
            </ol>

            <h2>For Android (Chrome):</h2>
            <ol>
                <li>Tap the <strong>3 dots</strong> menu in the top-right.</li>
                <li>Select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Install</strong>.</li>
            </ol>

            <p>Once installed, Afrifoody will open like a normal app, and you’ll start from the Login / Sign up page if you’re not logged in yet.</p>
            <h3>Happy Cooking!</h3>
        </div>  
    </div>
  );
};

export default InstallPage;
