import React from "react";
import _ from "lodash";
import Prism from "prismjs";
import PerfectScrollbar from "react-perfect-scrollbar";
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import Introduction from "./components/Introduction";
import Authentication from "./components/Authentication";
import APISection from "./components/APISection";
import parseSwagger from "./utils/parseSwagger";
import "prismjs/components/prism-json";

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			loading: true,
			active: "introduction"
		};
		this.onScroll = _.debounce(this.onScroll.bind(this), 200);
	}

	async componentDidMount() {
		const swagger = await import("./swagger.json");
		const json = await parseSwagger(swagger);
		this.setState({
			loaded: true,
			loading: false,
			json: json
		}, () => {
			Prism.highlightAll();
		});
	}

	onScroll(container) {
		const scrollTop = container.scrollTop;
		for (const node of document.getElementsByClassName("main")[0].childNodes) {
			if (scrollTop <= node.offsetTop) {
				const id = node.getAttribute("id");
				if (id) {
					const active = _.last(id.split("-"));
					if (this.state.active != active) {
						window.history.replaceState(void 0, void 0, `${window.location.origin}/#${id}`);
						return this.setState({ active: active });
					}
				}
			}
		}
	}

	render() {

		const { loaded, json, active } = this.state;

		if (!loaded)
			return (
				<Loading />
			);

		return (
			<>
				<Sidebar
					active={active}
					logo={json.logo}
					paths={json.paths}
					groups={json.groups}
					authentication={!!json.authentication}
				/>
				<PerfectScrollbar
					component="main"
					className="main"
					options={{ suppressScrollX: true }}
					onScrollY={this.onScroll}
				>
					<Introduction data={json.info} />
					<Authentication data={json.authentication} />
					{
						json.paths.map((path, index) => (
							<APISection
								key={index}
								data={path}
								endpoint={json.endpoint}
							/>
						))
					}
				</PerfectScrollbar>
				<div className="response__background" />
			</>
		);
	}

}

export default App;
