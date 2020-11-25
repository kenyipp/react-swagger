import React from "react";
import marked from "marked";

class Introduction extends React.Component {

	render() {

		const { data } = this.props;
		const description = data.description ? marked.parseInline(data.description) : null;

		return (
			<section id="introduction">
				<div className="content">
					<h1> {data.title} </h1>
					<ul className="introduction__contact-list">
						{
							data.contact?.email && (
								<li>
									<label> Email: </label>
									<a href={"mailto:" + data.contact?.email}> {data.contact?.email} </a>
								</li>
							)
						}
						{
							data.license && (
								<li>
									<label> License: </label>
									{
										data.license?.url && <a target="__blank" href={data.license.url}> {data.license?.name} </a>
									}
									{
										!data.license?.url && <span> {data.license?.name} </span>
									}
								</li>
							)
						}
						{
							data.termsOfService && (
								<li>
									<a href={data.termsOfService} target="__blank">Terms of Service</a>
								</li>
							)
						}
					</ul>
					{
						description && <p dangerouslySetInnerHTML={{ __html: description }} />
					}
					{
						data.externalDocs && <a href={data.externalDocs.url}> {data.externalDocs.description} </a>
					}
				</div>
				<div className="response" />
			</section>
		);
	}

}

export default Introduction;
