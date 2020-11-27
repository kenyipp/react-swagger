import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./styles/index.scss";
import App from "./App";

function initialize() {

	const tag = document.getElementsByTagName("doc")[0];

	if (!tag)
		console.error("No <doc> element is found");

	const url = tag.getAttribute("data-script");
	
	axios
		.get(url)
		.then(response => response.data)
		.then(json => {
			ReactDOM.render(
				<React.StrictMode>
					<App swagger={json} />
				</React.StrictMode>,
				document.getElementById("root")
			);
		});		
}

initialize();
