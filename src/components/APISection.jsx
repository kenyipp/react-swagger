import React from "react";
import Parameters from "./Parameters";
import Response from "./Response";
import ResponseExample from "./ResponseExample";

const BODY_MAPPING = {
	path: {
		name: "Path Parameters",
	},
	formData: {
		name: "Request Body Schema",
		meta: "multipart/form-data"
	},
	query: {
		name: "Query Parameters"
	},
	body: {
		name: "Request Body Schema",
		meta: "application/json"
	},
	header: {
		name: "Header Parameters"
	}
};

class APISection extends React.Component {

	renderParameter(props) {
		const data = props.data;

		let parameters, description, isArray;

		if (data.type == "body") {
			const item = data.parameters[0];
			description = item.description;
			if (item.type == "object") {
				parameters = item.properties;
			} else if (item.type == "array") {
				parameters = item?.schema?.properties;
				isArray = true;
			}
		} else {
			parameters = data.parameters;
		}

		return (
			<>
				{
					description && <p className="parameter-section__description">{description}</p>
				}
				{
					isArray && <p className="parameter-section__description margin-bottom-0">Array()</p>
				}
				{
					parameters && <Parameters data={parameters} />
				}
			</>
		);
	}

	render() {

		const path = this.props.data;
		const endpoint = this.props.endpoint;

		return (
			<section id={`tag-${path.id}`}>
				<div className="content">
					<div className="content__title-section">
						<h2> 
							{path.name} 
							{
								path.deprecated && <span className="deprecated"> deprecated </span>
							}
						</h2>
						{
							path.description != "" && <p> {path.description} </p>
						}
					</div>
					{
						path.security && path.security.length > 0 && (
							<div className="parameter-section__container">
								<h5 className="parameter-section__title"> Authorizations </h5>
								<ul className="parameter-section__security-list">
									{
										path.security.map((item, index) => (
											<li key={index}>
												<a>{item.id}</a>
												{
													item.scopes && item.scopes.length > 0 && (
														<div>
															<span>(</span>
															{item.scopes.map((item, index) => <code key={index}>{item}</code>)}
															<span>)</span>
														</div>
													)
												}
											</li>
										))
									}
								</ul>
							</div>
						)
					}
					{
						path.parameters && path.parameters.length > 0 && path.parameters.map((parameter, index) => {
							const path = BODY_MAPPING[parameter.type];
							return (
								<div className="parameter-section__container" key={index}>
									<h5 className="parameter-section__title">
										{path?.name}
										<span className="meta"> {path?.meta} </span>
									</h5>
									<this.renderParameter data={parameter} />
								</div>
							);
						})
					}
					{
						path.responses && path.responses.length > 0 && (
							<div className="parameter--response__container">
								<h4> Responses </h4>
								{
									path.responses.map((response, index) => <Response key={index} data={response} />)
								}
							</div>
						)
					}
				</div>

				<ResponseExample
					data={path}
					endpoint={endpoint}
				/>

			</section>

		);
	}

}

export default APISection;
