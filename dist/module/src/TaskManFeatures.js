import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
export const Features = ({ 
// tasks,
tests, adminMode }) => {
    const [features, setFeatures] = useState([]);
    const importFeatures = async () => {
        fetch('http://localhost:8080/features.json')
            .then(response => response.json())
            .then((allFeatures) => {
            setFeatures(allFeatures);
        });
    };
    //     .catch (error => console.error(error));
    // };
    useEffect(() => { importFeatures(); }, []);
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 4 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, (features).map((feature, ndx) => React.createElement(Nav.Item, { key: ndx },
                        React.createElement(Nav.Link, { eventKey: `feature/${feature.filename}` },
                            feature.filename,
                            " - ",
                            feature.name))))),
                React.createElement(Col, { sm: 8 },
                    React.createElement(Tab.Content, null, (features).map((feature, ndx) => {
                        // const feature = features[featureKey];
                        return (React.createElement(Tab.Pane, { eventKey: `feature/${feature.filename}`, key: ndx },
                            React.createElement("pre", null, JSON.stringify(feature, null, 2))));
                    })))));
    // return <Crud schema={featuresSchema} collectionName="features" collection={features}></Crud2>
    return React.createElement("div", null);
};
