import React, { useEffect, useState } from 'react';
const FeaturesReporter = () => {
    const [features, setFeatures] = useState([]);
    useEffect(() => {
        // Fetch features from tests.json files
        const fetchFeatures = async () => {
            try {
                const response = await fetch('/path/to/tests.json');
                const data = await response.json();
                setFeatures(data.features);
            }
            catch (error) {
                console.error('Error fetching features:', error);
            }
        };
        fetchFeatures();
    }, []);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Features Reporter"),
        React.createElement("ul", null, features.map((feature, index) => (React.createElement("li", { key: index },
            feature.name,
            " - ",
            feature.status))))));
};
export default FeaturesReporter;
