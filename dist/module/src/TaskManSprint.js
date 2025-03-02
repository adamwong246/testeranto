import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { collectionEffect } from './collectionEffect';
import { octokit } from './DELETEME';
export const Sprint = ({ adminMode }) => {
    const [sprints, setSprints] = useState([]);
    collectionEffect(`Sprint`, setSprints);
    const { id } = useParams();
    const sprint = sprints.find((f) => f._id === id);
    const [gitDiff, setGitDiff] = useState({});
    useEffect(() => {
        (async () => {
            if (!sprint)
                return;
            const diff = await octokit.request(`GET /repos/adamwong246/kokomobay-taskman/compare/${sprint === null || sprint === void 0 ? void 0 : sprint.start}...${sprint === null || sprint === void 0 ? void 0 : sprint.end}`, {
                owner: 'adamwong246',
                repo: 'kokomobay-taskman',
                basehead: `${sprint === null || sprint === void 0 ? void 0 : sprint.start}...${sprint === null || sprint === void 0 ? void 0 : sprint.end}`,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            console.log("diff", diff);
            setGitDiff(diff);
        })();
    }, [sprint]);
    if (!adminMode)
        return React.createElement(Tab.Container, { id: "left-tabs-example5", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 2 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" }, (sprints).map((sprint, ndx) => React.createElement(Nav.Item, null,
                        React.createElement(NavLink, { to: `/sprint/${sprint._id}`, className: "nav-link" }, sprint._id))))),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Tab.Content, null, sprint && React.createElement(React.Fragment, null,
                        React.createElement("h1", null,
                            "Sprint/",
                            sprint._id),
                        React.createElement("pre", null, sprint.notes),
                        React.createElement("p", null,
                            "start ",
                            sprint.start),
                        React.createElement("p", null,
                            "end ",
                            sprint.end),
                        React.createElement("pre", null, JSON.stringify(gitDiff, null, 2)))))));
    return React.createElement("div", null);
};
