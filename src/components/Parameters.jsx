import React from "react";
import classnames from "classnames";

class Parameters extends React.Component {

	render() {
		const data = this.props.data;
		return (
			<ul className="parameter__container">
				{
					data.map((parameter, index) => (
						<li key={index} className={classnames(
							index == 0 && "first",
							index + 1 == data.length && "last"
						)}>
							<span />
							<div className="parameter__attribute">
								<label>{parameter.name}</label>
								{
									parameter.required && <span className="required">required</span>
								}
							</div>
							<div className="parameter__description">
								<span className="date-type">
									<span className="type">{parameter.type}</span>
									{
										parameter.format && <span className="format">{"<"}{parameter.format}{">"}</span>
									}
								</span>
								<span className="description">{parameter.description}</span>
							</div>
						</li>
					))
				}
			</ul>
		);
	}

}

export default Parameters;
