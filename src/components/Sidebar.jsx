"use strict";
import React from "react";
import _ from "lodash";
import lunr from "lunr";
import classnames from "classnames";
import { Collapse } from "react-collapse";
import PerfectScrollbar from "react-perfect-scrollbar";

class Sidebar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: null,
			query: "",
			searchResult: []
		};
		this.search = this.search.bind(this);
		this.getSidebar = this.getSidebar.bind(this);
		this.renderItemMenu = this.renderItemMenu.bind(this);
	}

	componentDidMount() {

		const parsed = this
			.getSidebar()
			.filter(item => typeof item != "string");

		this.index = lunr(function () {
			this.field("name");
			this.field("description");
			parsed
				.map(item => item.items)
				.flat()
				.forEach(item => {
					this.add(item);
				});
		});
	}

	componentDidUpdate(prevProps) {
		const selected = this.state.selected;
		const { active } = this.props;

		const parsed = this
			.getSidebar()
			.filter(item => typeof item != "string");

		if (prevProps.active != active) {
			if (
				["introduction", "authentication"].includes(active)
				&& !["introduction", "authentication"].includes(selected)
			)
				this.setState({ selected: null });

			const tab = parsed.find(item => item.items.find(_item => _item.id == active))?.name;

			if (tab && tab != selected)
				this.setState({ selected: tab });
		}
	}

	search() {
		const { query } = this.state;
		if (query.trim() == "")
			return this.setState({ searchResult: [] });
		const match = this.index.search(query).map(item => item.ref);
		const parsed = this
			.getSidebar()
			.filter(item => typeof item != "string")
			.map(item => item.items)
			.flat()
			.filter(item => match.includes(item.id));
		this.setState({ searchResult: parsed });
	}

	getSidebar() {
		const { paths, groups } = this.props;
		// Group route by tags
		let tabs = _
			.uniq(paths.flatMap(route => route.tags))
			.map(tab => ({
				name: tab,
				items: paths.filter(route => (route.tags || []).includes(tab))
			}));
		// If tag group is specified, add the catalog
		if (groups) {
			tabs = groups
				.flatMap(group => [
					group.name,
					group.tags.map(tag => tabs.find(item => item.name == tag))
				])
				.flat();
		}
		return tabs;
	}

	renderItemMenu(item) {
		const { active } = this.props;
		return (
			<li
				key={item.id}
				className={
					classnames(
						"navigation__item",
						active == item.id && "active",
						item.deprecated && "deprecated"
					)}
			>
				<a href={`#tag-${item.id}`}>
					<span className="method">
						<span className={item.method}> {_.startCase(item.method)} </span>
					</span>
					<span className="label">
						{item.name}
					</span>
				</a>
			</li>
		);
	}

	render() {

		const { selected, query, searchResult } = this.state;
		const { logo, authentication, active } = this.props;
		const parsed = this.getSidebar();

		return (
			<PerfectScrollbar
				component="aside"
				className="sidebar"
				options={{ suppressScrollX: true }}
			>
				{
					logo && <div className="brand">
						<img src={logo} />
					</div>
				}

				<div className="search-container">
					<i className="fa fa-search" />
					<input
						placeholder="Search"
						onChange={event => this.setState({ query: event.target.value }, this.search)}
						value={query}
					/>
				</div>

				{
					query != "" && searchResult.length > 0 && (
						<PerfectScrollbar options={{ suppressScrollX: true }} style={{ height: "unset" }}>
							<ul className="navigation navigation--search">
								<li>
									<label> Search Result </label>
								</li>
								{
									searchResult.map(this.renderItemMenu)
								}
							</ul>
						</PerfectScrollbar>
					)
				}

				<ul className="navigation">
					<li className={classnames("navigation__item", active == "introduction" && "active")}>
						<a href="#introduction">Introduction</a>
					</li>
					{
						authentication && (
							<li className={classnames("navigation__item", active == "authentication" && "active")}>
								<a href="#authentication"> Authentication </a>
							</li>
						)
					}
					{
						parsed.map((menu, index) => {
							if (typeof menu === "string")
								return (
									<li key={index} className="navigation__header">
										<span>{menu}</span>
									</li>
								);
							const isSelected = selected == menu.name;
							return (
								<li key={index} className="navigation__item">
									<a
										onClick={() => this.setState({ selected: isSelected ? null : menu.name })}
									>
										<span> {_.startCase(menu.name)} </span>
										<i className={`fa fa-angle-${isSelected ? "down" : "right"}`} />
									</a>
									<Collapse isOpened={selected == menu.name}>
										<ul className={classnames("navigation__menu")}>
											{
												menu.items.map(this.renderItemMenu)
											}
										</ul>
									</Collapse>
								</li>
							);
						})
					}
				</ul>
			</PerfectScrollbar>
		);
	}

}

export default Sidebar;
