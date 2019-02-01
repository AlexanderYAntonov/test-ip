import React from 'react';
import PropTypes from 'prop-types';
import './Result.css';

export class Result extends React.Component {
	state = {
		searchIP: '',
		resObject: {},
		prevObjects: [
			{
				ip: '8.8.8.8',
				country_code: 'US',
				country: 'United states',
				country_rus: 'США',
				region: 'California',
				city: 'Mountain view',
				city_rus: 'Маунтин-Вью',
				latitude: '37.405992',
				longitude: '-122.078515',
				zip_code: '94043',
				time_zone: '-07:00',
			},
		],
		isLoading: false,
	};

	componentDidMount() {
		//get prevObjects from Local Storage
		const prevObjects = JSON.parse(localStorage.getItem('prevObjects'));

		if (prevObjects) this.setState({ prevObjects: prevObjects });
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.searchIP !== this.props.searchIP) {
			let { searchIP } = this.props;

			let object = {};
			//search IP in prevObjects
			if (this.state.prevObjects) {
				object = this.state.prevObjects.filter(item => item.ip === searchIP);

				//set state resObject
				if (object.length) {
					this.setState({ resObject: object[0] });
					return true;
				} else {
					object = {};
				}
			}

			//if not found get from API
			this.setState({ isLoading: true });
			const str = 'https://api.2ip.ua/geo.json?ip=' + searchIP;

			fetch(str)
				.then(response => {
					return response.json();
				})
				.then(
					data => {
						const newObjects = JSON.stringify([
							...this.state.prevObjects,
							data,
						]);
						const newPrevObjects = [...this.state.prevObjects, data];

						//put in Local Storage
						try {
							localStorage.setItem('prevObjects', newObjects);
						} catch (e) {
							if (e.name === 'QUOTA_EXCEEDED_ERR') {
								console.log('Превышен лимит LocalStorage');
							}
						}
						this.setState({
							resObject: data,
							isLoading: false,
							prevObjects: newPrevObjects,
						});
					},
					error => console.log('Loading error: ', error)
				);

			//set state resObject
			if (object) {
				this.setState({ resObject: object });
			}
		}
	}

	renderTemplate = () => {
		const { resObject } = this.state;
		let listTemplate = [];
		let counter = 0;
		if (resObject && Object.keys(resObject).length) {
			for (let key in resObject) {
				listTemplate.push(
					<span key={counter++} className="List__item-title">
						{key} :
					</span>
				);
				listTemplate.push(
					<span key={counter++} className="List__item-value">
						{resObject[key]}
					</span>
				);
			}
		}
		return listTemplate;
	};

	render() {
		const { isLoading } = this.state;
		return (
			<React.Fragment>
				{isLoading && <p>Загружаем данные...</p>}
				{!isLoading && <div className="List">{this.renderTemplate()}</div>}
			</React.Fragment>
		);
	}
}

Result.propTypes = {
	searchIP: PropTypes.string.isRequired,
};
