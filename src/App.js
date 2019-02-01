import React, { Component } from 'react';
import { HeaderInput } from './components/HeaderInput';
import { Result } from './components/Result';

class App extends Component {
	state = {
		searchIP: '',
	};

	handleInput = ip => {
		this.setState({ searchIP: ip });
	};

	render() {
		const { searchIP } = this.state;

		return (
			<div className="App">
				<HeaderInput handleInput={this.handleInput} />
				<Result searchIP={searchIP} />
			</div>
		);
	}
}

export default App;
