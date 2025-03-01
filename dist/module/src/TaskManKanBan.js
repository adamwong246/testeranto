import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { UncontrolledBoard } from '@caldwell619/react-kanban';
import '@caldwell619/react-kanban/dist/styles.css';
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';
import { Crud } from './Crud';
import { kanbanZodSchema } from "./TaskManTypes";
export const Kanban = ({ tasks, tests, kanban, openNewColumnModal, adminMode }) => {
    const board = {
        columns: [
            {
                id: -1,
                title: 'BACKLOG',
                cards: tasks.filter((f) => f.state === undefined)
            },
            ...kanban.map((kb) => {
                return {
                    id: kb._id,
                    title: kb._id,
                    cards: tasks.filter((f) => f.state === kb._id).map((f) => {
                        return {
                            id: f._id,
                            title: f._id,
                            description: f.body,
                        };
                    }),
                    rank: kb.rank
                };
            }).sort((a, b) => a.rank - b.rank),
            {
                id: 0,
                title: 'ARCHIVE',
                cards: tasks.filter((f) => f.state === "ARCHIVED")
            },
        ]
    };
    if (!adminMode) {
        return React.createElement(Tab.Container, { id: "left-tabs-example8", defaultActiveKey: "feature-0" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 12 },
                    React.createElement(UncontrolledBoard, { initialBoard: board }))));
    }
    return React.createElement(Crud, { schema: kanbanZodSchema, collectionName: "kanban", collection: kanban });
};
