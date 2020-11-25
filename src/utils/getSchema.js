"use strict";
function prase(schema) {

	if (schema.type == "string") {
		let response = "string";
		if (schema.enum)
			response += ` <${schema.enum.join(", ")}>`;
		if (schema.example)
			response += ` (${schema.example})`;
		return response;
	}

	if (schema.type == "integer") {
		if (schema.format)
			return `integer <${schema.format}>`;
		return "integer";
	}

	if (schema.type == "array") {
		return [prase(schema.schema)];
	}

	if (schema.type == "object") {
		return schema.properties.reduce((prev, curr) => {
			prev[curr.name] = prase(curr);
			return prev;
		}, {});
	}

	return schema.type;
}

function getSchema(schema, options = {}) {
	const json = prase(schema);
	if (options.toJsonString)
		return JSON
			.stringify(json, null, 4)
			.replace(/"(.+?)":/ig, "$1:");
	return json;
}

module.exports = getSchema;
