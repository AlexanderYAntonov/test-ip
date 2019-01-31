import React, { Component } from 'react';
//import './App.css';
import { HeaderInput } from './components/HeaderInput';
import { Result } from './components/Result';

class App extends Component {
	state = {
		resObject: {
			ip: '8.8.8.8',
			country_code: 'US',
			country: 'United states',
		},
		lastIP: '',
		isLoading: false,
	};

	componentDidMount() {
		fetch('http://localhost:3000/data/lastIP.json')
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState({ lastIP: data });
			});
	}

	handleInput = ip => {
		console.log('Lets check ip ', ip);
	};

	render() {
		const { resObject, lastIP } = this.state;

		return (
			<div className="App">
				<HeaderInput handleInput={this.handleInput} lastIP={lastIP} />
				<Result resObject={resObject} />
			</div>
		);
	}
}

export default App;
