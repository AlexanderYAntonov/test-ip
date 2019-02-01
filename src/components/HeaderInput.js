import React from 'react';
import PropTypes from 'prop-types';
import './HeaderInput.css';

export class HeaderInput extends React.Component {
	state = {
		valid: false,
		ip: '',
	};

	componentDidMount() {
		const lastIP = localStorage.getItem('lastIP');

		if (lastIP) this.setState({ ip: lastIP });
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
			this.props.handleInput(this.state.ip);
		}
	};

	//handle Enter key press
	handleKeyPress = event => {
		if (event.key === 'Enter' && this.validate()) {
			this.props.handleInput(this.state.ip);
		}
	};

	handleChange = event => {
		const { value } = event.currentTarget;
		this.setState({ ip: value });
	};

	componentDidUpdate(prevProps, prevState) {
		const { ip } = this.state;
		//check if search request changed
		if (prevState.ip !== ip) {
			//add IP to lastIP in LocalStorage
			try {
				localStorage.setItem('lastIP', ip);
			} catch (e) {
				if (e.name === 'QUOTA_EXCEEDED_ERR') {
					console.log('Превышен лимит LocalStorage');
				}
			}
		}
	}

	render() {
		const { valid, ip } = this.state;

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
							onKeyPress={this.handleKeyPress}
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
};
