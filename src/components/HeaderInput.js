import React from 'react';
import PropTypes from 'prop-types';
import './HeaderInput.css';

export class HeaderInput extends React.Component {
	state = {
		valid: false,
		ip: '',
		status: false,
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		const { lastIP } = nextProps;

		if (lastIP !== prevState.ip && prevState.ip === '') {
			return { ip: lastIP };
		}
		return null;
	}

	validate = () => {
		let { ip } = this.state;
		ip = ip.trim();

		if (/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/.test(ip)) {
			const bytes = ip.split('.');
			let flag = true;

			bytes.forEach(value => {
				if (value < 0 || value > 255) {
					flag = false;
				}
			});

			if (flag) {
				this.setState({ valid: true });
				return true;
			}
		}

		this.setState({ valid: false });
		return false;
	};

	//handle button click
	handleClickOK = () => {
		if (this.validate()) {
			this.setState({ status: true });
			this.props.handleInput(this.state.ip);
		}
	};

	handleChange = event => {
		const { value } = event.currentTarget;
		this.setState({ ip: value, status: false });
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevState.ip !== this.state.ip && prevState.ip !== '') {
			console.log('Write new IP to .json ', this.state.ip);
			const ip = this.state.ip;
			fetch('http://localhost:3000/data/lastIP.json', {
				method: 'post',
				body: JSON.stringify(ip),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(function(data) {
					console.log('Request succeeded with response', data);
				})
				.catch(function(error) {
					console.log('Request failed', error);
				});
		}
	}

	render() {
		const { valid, ip } = this.state;
		console.log('Render props:', this.props);
		return (
			<React.Fragment>
				<header className="HeaderInput">
					<label name="inputIP">
						<span>Введите IP</span>
						<input
							type="text"
							className={
								valid
									? 'HeaderInput__input'
									: 'HeaderInput__error HeaderInput__input'
							}
							onChange={this.handleChange}
							autoFocus={true}
							value={ip}
						/>
					</label>
					<input
						type="button"
						className="HeaderInput__Btn"
						value="Проверить"
						onClick={this.handleClickOK}
					/>
				</header>
			</React.Fragment>
		);
	}
}

HeaderInput.propTypes = {
	handleInput: PropTypes.func.isRequired,
	lastIP: PropTypes.string.isRequired,
};
