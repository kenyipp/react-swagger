import React from "react";
import axios from "axios";
import isUrl from "is-url";
import ReactDOM from "react-dom";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./styles/index.scss";
import App from "./App";

export async function initialize(swagger) {

	let json;

	if (isUrl(swagger)) {
		json = await axios.get(swagger).then(response => response.data);
	} else {
		json = swagger;
	}

	ReactDOM.render(
		<React.StrictMode>
			<App swagger={json} />
		</React.StrictMode>,
		document.getElementById("root")
	);

}


if (process.env.NODE_ENV === "development")
	initialize("https://asset.kenyip.cc/pet-store-swagger.json");

