import { useEffect, useState } from 'react';
import request from 'superagent';

import CountryCard from './components/countryCard';

import './App.scss';

function App() {
    const [countryList, setCountryList] = useState([]);
    const [fullCountryList, setFullCountryList] = useState([]);

    const [subregions, setSubregions] = useState(new Set());
    const [languageAmounts, setLanguageAmounts] = useState(new Set());

    const [regionFilter, setRegionFilter] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');
    const [currentSort, setCurrentSort] = useState('name');

    const sortOptions = [
        { label: 'Alphabetical (A to Z)', value: 'name' },
        { label: 'Population (High to Low)', value: 'population' },
    ];

    const filterSubregion = (value, list) => {
        if (value === '') {
            return list;
        }

        const filtered = list.filter((country) => country.subregion === value);
        return filtered;
    };

    const filterLanguage = (value, list) => {
        if (value === '') {
            return list;
        }
        const filtered = list.filter((country) => {
            return country.languages.length === parseInt(value);
        });

        return filtered;
    };

    const sortCountries = (sortValue, list, inverse) => {
        const sorted = list.sort((a, b) => {
            if (inverse) {
                if (a[sortValue] > b[sortValue]) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (a[sortValue] < b[sortValue]) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
        return sorted;
    };

    const handleFilterAndSort = (
        region = regionFilter,
        language = languageFilter,
        sort = currentSort
    ) => {
        let filteredAndSorted = fullCountryList;

        filteredAndSorted = filterSubregion(region, filteredAndSorted);
        filteredAndSorted = filterLanguage(language, filteredAndSorted);
        if (sort === 'population') {
            filteredAndSorted = sortCountries(sort, filteredAndSorted, true);
        } else {
            filteredAndSorted = sortCountries(sort, filteredAndSorted);
        }

        setCountryList(filteredAndSorted);
    };

    // Fetch all the countries on initial render
    useEffect(() => {
        request
            .get('https://restcountries.eu/rest/v2/region/europe')
            .end((err, res) => {
                if (!err) {
                    //default sort by name
                    const initalList = res.body.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
                    setCountryList(initalList);
                    setFullCountryList(initalList);

                    const regionsSet = new Set();
                    const languageSet = new Set();

                    res.body.forEach((country) => {
                        regionsSet.add(country.subregion);
                        languageSet.add(country.languages.length);
                    });

                    setSubregions(regionsSet);
                    setLanguageAmounts(languageSet);
                } else {
                    console.error('Error fetching country list');
                    console.error(err);
                }
            });
    }, []);

    return (
        <div className="App">
            <div className="countries-list-container">
                <div className="filters-and-sorting">
                    <div className="filters">
                        <h3 className="filter-title filter-sorting-title">
                            Filters:
                        </h3>
                        <select
                            className="subregion-filter filter"
                            name="subregion"
                            onChange={(event) => {
                                setRegionFilter(event.target.value);
                                handleFilterAndSort(
                                    event.target.value,
                                    languageFilter,
                                    currentSort
                                );
                            }}
                        >
                            <option value="">Select a Subregion</option>
                            {Array.from(subregions).map((subregion, index) => (
                                <option key={index} value={subregion}>
                                    {subregion}
                                </option>
                            ))}
                        </select>
                        <select
                            className="language-filter filter"
                            name="language"
                            onChange={(event) => {
                                setLanguageFilter(event.target.value);
                                handleFilterAndSort(
                                    regionFilter,
                                    event.target.value,
                                    currentSort
                                );
                            }}
                        >
                            <option value="">Select Language Count</option>
                            {Array.from(languageAmounts).map(
                                (languageAmounts, index) => (
                                    <option value={languageAmounts} key={index}>
                                        {languageAmounts}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                    <div className="sorting-container">
                        <h3 className="sorting-title filter-sorting-title">
                            Sort:
                        </h3>
                        <select
                            className="sorting"
                            name="sort"
                            onChange={(event) => {
                                setCurrentSort(event.target.value);
                                handleFilterAndSort(
                                    regionFilter,
                                    languageFilter,
                                    event.target.value
                                );
                            }}
                        >
                            {sortOptions.map((sortOption, index) => (
                                <option value={sortOption.value} key={index}>
                                    {sortOption.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="countries">
                    {countryList.length > 0 ? (
                        countryList.map((country, index) => (
                            <CountryCard
                                key={index}
                                name={country.name}
                                flagImage={country.flag}
                                subregion={country.subregion}
                                capital={country.capital}
                                population={country.population}
                                numberOfLanguages={country.languages.length}
                            />
                        ))
                    ) : (
                        <h1 className="empty-countries">
                            No country matches that criteria
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
