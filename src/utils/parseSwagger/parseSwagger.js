"use strict";
const _ = require("lodash");
const RefParser = require("json-schema-ref-parser");

async function parse(json) {

	json = await RefParser.dereference(json);

	/**
	 * 
	 * Base information section
	 * 
	 */
	const info = json.info;
	info.externalDocs = json.externalDocs;

	/**
	 * 
	 * Authentication
	 * 
	 */
	const authentication = _.map(json.securityDefinitions, (definition, key) => ({
		key: key,
		type: definition.type,
		name: definition.name ?? key,
		description: definition.description,
		flow: definition.flow, // https://swagger.io/specification/#oauth-flow-object
		url: definition.authorizationUrl,
		in: definition.in, // The location of the API key. Valid values are "query", "header" or "cookie".
		scopes: definition.scopes && _.map(definition.scopes, (description, scope) => ({
			id: scope,
			description
		}))
	}));

	/**
	 * 
	 * For paths
	 * 
	 */
	const paths = _.map(json.paths, (methods, path) => _.map(methods, (route, method) => ({
		method,
		path,
		id: route.operationId,
		deprecated: route.deprecated,
		name: route.summary,
		description: route.description,
		tags: route.tags,
		consumes: route.consumes,
		produces: route.produces,
		parameters: _.map(_.groupBy(
			route.parameters.map(parameter => parseSchema(parameter)),
			"in"
		), (value, key) => ({
			type: key,
			parameters: value
		})),
		responses: _.map(route.responses, (item, code) => ({
			code,
			description: item.description,
			schema: item.schema && parseSchema(item.schema)
		})),
		security: route.security ? route.security.map(security => _.map(security, (scopes, permission) => ({
			id: permission,
			scopes
		}))).flat() : void 0,
	}))).flat();

	/**
	 * 
	 * For sidebar 
	 * 
	 */
	const groups = json["x-tagGroups"];

	let endpoint;

	if (json.host) {
		endpoint = {
			schemes: json.schemes || ["http"],
			host: json.host,
			basePath: json.basePath || "",
		};
		endpoint.baseUrls = endpoint.schemes.map(protocol => `${protocol}://${endpoint.host}${endpoint.basePath}`)
	}

	const logo = json["x-logo"];

	return {
		info,
		logo,
		endpoint,
		authentication,
		paths,
		groups
	};
}

function parseSchema(schema) {

	if (schema.in == "body") {
		const { schema: _schema, ...other } = schema;
		const result = {
			...other,
			...parseSchema(_schema)
		};
		return result;
	}

	switch (schema?.type) {
		case "array": {
			const { type, items, ...addition } = schema;
			return {
				type: type,
				schema: parseSchema(items),
				...addition
			};
		}
		case "object": {
			const { type, properties, required, ...addition } = schema;
			return {
				type: type,
				properties: _.map(properties, (property, key) => {
					return ({
						name: key,
						required: required ? required.includes(key) : void 0,
						...addition,
						...parseSchema(property),
					});
				})
			};
		}
		case "file":
		case "integer":
		case "string":
		case "boolean":
			return schema;
		default:
			return schema;
	}
}

module.exports = parse;
