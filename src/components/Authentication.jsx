import React from "react";
import _ from "lodash";

class Authentication extends React.Component {

	render() {

		const data = this.props.data;

		return (
			<section id="authentication">
				<div className="content">
					<div className="content__title-section">
						<h2> Authentication </h2>
					</div>

					{
						data.map((definition, index) => (
							<div key={index}>
								<h4> {definition.name} </h4>
								<p> {definition.description} </p>
								{
									["basic", "bearer"].includes(definition.type) && (
										<table>
											<tbody>
												<tr>
													<th>Security Scheme Type</th>
													<td>HTTP</td>
												</tr>
												<tr>
													<th>HTTP Authorization Scheme</th>
													<td>{definition.type}</td>
												</tr>
											</tbody>
										</table>
									)
								}
								{
									definition.type == "apiKey" && (
										<table>
											<tbody>
												<tr>
													<th>Security Scheme Type</th>
													<td>API Key</td>
												</tr>
												<tr>
													<th>Header parameter name</th>
													<td>{definition.name}</td>
												</tr>
											</tbody>
										</table>
									)
								}
								{
									definition.type == "oauth2" && (
										<table>
											<tbody>
												<tr>
													<th>Security Scheme Type</th>
													<td>OAuth2</td>
												</tr>
												<tr>
													<th>{_.startCase(definition.flow)} OAuth Flow</th>
													<td>
														{
															definition.url && <div>
																<b>Authorization URL</b>
																<br />
																<a href={definition.url}>{definition.url}</a>
															</div>
														}
														{
															definition.scopes && <div>
																<b>Scopes</b>
																<br />
																<ul>
																	{
																		definition.scopes.map((scope, index) => (
																			<li key={index}>
																				<b>{scope.id}</b> <span>{scope.description}</span>
																			</li>
																		))
																	}
																</ul>
															</div>
														}
													</td>
												</tr>
											</tbody>
										</table>
									)
								}
							</div>
						))
					}
				</div>
				<div className="response" />
			</section>
		);
	}

}

export default Authentication;
