import React from "react";
import classnames from "classnames";
import Parameters from "./Parameters";

class Response extends React.Component {

	constructor(props) {
		super(props);
		this.state = { opened: true };
	}

	renderParameter(props) {

		const data = props.data;
		let parameters = data.properties;
		let isArray = data.type == "array";

		return (
			<>
				{
					isArray && <p className="parameter-section__description margin-bottom-0">Array({data.schema.type})</p>
				}
				{
					parameters && <Parameters data={parameters} />
				}
			</>
		);
	}

	render() {

		const data = this.props.data;
		const isFailure = data.code.startsWith("4");
		const hasSample = !!data.schema && data.schema.type != "string";
		const opened = this.state.opened;

		return (
			<>
				<div
					className={classnames(
						isFailure ? "parameter--response__well--failure" : "parameter--response__well",
						hasSample ? "pointer" : void 0
					)}
					onClick={() => this.setState({ opened: !opened })}
				>
					{
						hasSample && <div className={`arrow--${opened ? "down" : "right"}`} />
					}
					<label className="code">{data.code}</label>
					<span className="description">{data.description}</span>
				</div>
				{
					hasSample && opened && ["array", "object"].includes(data.schema.type) && (
						<div className="parameter-section__container">
							<h5 className="parameter-section__title"> Response Schema </h5>
							<this.renderParameter data={data.schema} />
						</div>
					)
				}
			</>
		);
	}

}

export default Response;
