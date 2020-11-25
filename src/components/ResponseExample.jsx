import React from "react";
import getSchema from "../utils/getSchema";
import getCurlCommand from "../utils/getCurlCommand";

class Example extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			loading: true
		};
	}

	render() {

		const path = this.props.data;
		const endpoint = this.props.endpoint;

		let example;

		const successResponse = path.responses && path.responses
			.find(item => (item.code.startsWith("2") || item.code.startsWith("d")) && item.schema);

		if (successResponse) {
			example = successResponse.schema.example ?
				JSON.stringify(successResponse.schema.example, null, 4) :
				getSchema(successResponse.schema, { toJsonString: true });
		}

		let curlCommand = getCurlCommand(path, endpoint);

		return (
			<div className="response">
				{
					(curlCommand || example) && <blockquote>
						<p> API Request Example </p>
					</blockquote>
				}
				{
					curlCommand && (
						<pre>
							<code className="language-clike">
								{curlCommand}
							</code>
						</pre>
					)
				}
				{
					(curlCommand && example) && (
						<blockquote>
							<p> The above command returns JSON structured like this: </p>
						</blockquote>
					)
				}
				{
					example && (
						<pre>
							<code className="language-javascript">
								{example}
							</code>
						</pre>
					)
				}
			</div>
		);
	}

}

export default Example;
