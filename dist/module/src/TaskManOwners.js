import React from "react";
import { Row, Col, Nav, Tab } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";
export const TaskManOwners = ({ users, setModal, tasks, projects, milestones, }) => {
    const { id } = useParams();
    const user = users.find((u) => u._id === id);
    return (React.createElement(Row, null,
        React.createElement(Col, { sm: 2 },
            React.createElement(Nav, { variant: "pills", className: "flex-column" }, users.map((user, ndx) => (React.createElement(Nav.Item, null,
                React.createElement(NavLink, { to: `/owners/${user._id}`, className: "nav-link" }, user._id)))))),
        React.createElement(Col, { sm: 10 },
            React.createElement(Tab.Content, null, user && React.createElement(React.Fragment, null,
                React.createElement("a", { href: "#", onClick: () => setModal([`User`, user._id]) },
                    React.createElement("h1", null, user._id)),
                React.createElement("h2", null, "tasks"),
                React.createElement("ul", null, ...tasks
                    .filter((u) => u.owner === user._id)
                    .map((t) => {
                    return (React.createElement("li", null,
                        React.createElement("a", { href: `/features/tasks/${t._id}` },
                            t.name,
                            " (",
                            t.state,
                            ")")));
                })),
                React.createElement("h2", null, "projects"),
                React.createElement("ul", null, ...projects
                    .filter((u) => u.owner === user._id)
                    .map((t) => {
                    return (React.createElement("li", null,
                        React.createElement("a", { href: `/features/projects/${t._id}` }, t.name)));
                })),
                React.createElement("h2", null, "milestones"),
                React.createElement("ul", null, ...milestones
                    .filter((u) => u.owner === user._id)
                    .map((t) => {
                    return (React.createElement("li", null,
                        React.createElement("a", { href: `/features/milestones/${t._id}` }, t.name)));
                })))))));
};
