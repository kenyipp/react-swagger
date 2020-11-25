"use strict";
const getSchema = require("./getSchema");

function getCurlCommand(path, endpoint) {

	// Not handle form-data input this version
	if (path.parameters.find(item => item.type == "formData")) {
		return null;
	}

	let scheme = "http";
	let host = "example.com"
	let basePath = "";

	if (
		Array.isArray(endpoint?.schemes) &&
		endpoint.schemes.includes("https")
	)
		scheme = "https";

	if (endpoint?.host)
		host = endpoint.host;

	let commands = [
		"curl",
		`    -X ${path.method == "GET" ? "" : path.method.toUpperCase()}`,
	];

	if (path.security && path.security.length > 0) {
		commands.push(`    -H "Authorization: your-authorization-code"`);
	}

	if (path.consumes && path.consumes.includes("application/json")) {
		commands.push(`    -H "Content-Type: application/json"`);
	}

	let body = path.parameters.find(item => item.type == "body");

	if (body){
		body = getSchema(body?.parameters[0]);
		commands.push(`    -d '${JSON.stringify(body)}' `)
	}

	commands.push(`    "${scheme}://${host}${basePath}${path.path}"`);
	return commands.join(" \\\n");
}

module.exports = getCurlCommand;
