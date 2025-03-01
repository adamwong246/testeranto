import { Table } from "react-bootstrap";
import React from "react";
import '@caldwell619/react-kanban/dist/styles.css';
import { Form as ZodForm } from '@zodform/core';
export const Crud = ({ collection, collectionName, schema }) => {
    return React.createElement("div", null,
        React.createElement("h3", null, collectionName),
        React.createElement(Table, { striped: true, bordered: true, hover: true },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "id"),
                    React.createElement("th", null))),
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", null, "add new record"),
                    React.createElement("td", null,
                        React.createElement(ZodForm, { schema: schema }))),
                collection.map((doc) => {
                    return React.createElement("tr", null,
                        React.createElement("td", null, doc._id),
                        React.createElement("td", null, JSON.stringify(doc, null, 2)));
                }))));
};
