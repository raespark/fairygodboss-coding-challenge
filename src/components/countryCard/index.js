import './styles.scss';

function CountryCard({
    name,
    flagImage,
    subregion,
    capital,
    population,
    numberOfLanguages,
}) {
    return (
        <div className="country-card">
            <h2 className="country-name">{name}</h2>
            <div className="country-flag">
                <img
                    src={flagImage}
                    alt={`${name} flag`}
                    className="country-flag-image"
                />
            </div>
            <div className="country-info">
                <div className="country-detail">
                    <h3 className="country-detail-header">Capital</h3>
                    <div className="country-detail-body">{capital}</div>
                </div>
                <div className="country-detail">
                    <h3 className="country-detail-header">Subregion</h3>
                    <div className="country-detail-body">{subregion}</div>
                </div>
                <div className="country-detail">
                    <h3 className="country-detail-header">Languages</h3>
                    <div className="country-detail-body">
                        {numberOfLanguages}
                    </div>
                </div>
                <div className="country-detail">
                    <h3 className="country-detail-header">Population</h3>
                    <div className="country-detail-body">{population}</div>
                </div>
            </div>
        </div>
    );
}

export default CountryCard;
