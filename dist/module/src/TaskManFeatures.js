import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
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
    const { collection, id } = useParams();
    const feature = features.find((f) => f.filename === `${collection}/${id}`);
    // console.log(collection, id);
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 2 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, (features).map((feature, ndx) => React.createElement(Nav.Item, null,
                        React.createElement(NavLink, { to: `/features/${feature.filename}`, className: "nav-link" },
                            feature.filename,
                            " - ",
                            feature.name))))),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Tab.Content, null, feature && React.createElement(React.Fragment, null,
                        React.createElement("h1", null, feature.filename),
                        React.createElement("h2", null, feature.title),
                        React.createElement("h3", null,
                            "owner: ",
                            feature.owner),
                        collection === "Task" && React.createElement(React.Fragment, null,
                            React.createElement("h4", null,
                                "state: ",
                                feature.state),
                            React.createElement("h4", null,
                                "start: ",
                                feature.start),
                            React.createElement("h4", null,
                                "end: ",
                                feature.end)),
                        collection === "Milestone" && React.createElement(React.Fragment, null,
                            React.createElement("h4", null,
                                "date: ",
                                feature.date)),
                        React.createElement("pre", null, feature.body))))));
    return React.createElement("div", null);
};
