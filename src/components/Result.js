import React from 'react';
import PropTypes from 'prop-types';
import './Result.css';

export class Result extends React.Component {
	renderTemplate = () => {
		const { resObject } = this.props;
		let listTemplate = [];
		let counter = 0;
		if (resObject) {
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
		} else {
			listTemplate = <p>Нет данных для отображения</p>;
		}
		return listTemplate;
	};

	render() {
		return <div className="List">{this.renderTemplate()}</div>;
	}
}

Result.propTypes = {
	resObject: PropTypes.object,
};
