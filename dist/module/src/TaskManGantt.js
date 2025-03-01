import { Gantt } from "gantt-task-react";
import React from "react";
import { Row, Col } from "react-bootstrap";
export const GanttChart = ({ tasks, milestones, projects, adminMode }) => {
    if (!adminMode) {
        const ganttTasks = [
            ...tasks.map((t) => {
                return Object.assign(Object.assign({}, t), { id: t._id, type: 'task' });
            }),
            ...milestones.map((m) => {
                return Object.assign(Object.assign({}, m), { id: m._id, type: 'milestone', 
                    // start: m.date,
                    // end: m.date,
                    progress: 55 });
            }),
            ...projects.map((p) => {
                return Object.assign(Object.assign({}, p), { id: p._id, type: 'project', start: new Date(), end: new Date(), progress: 55 });
            }),
        ];
        return React.createElement(Row, null,
            React.createElement(Col, { sm: 12 },
                React.createElement(Gantt, { tasks: ganttTasks })));
    }
    // return <Crud2 schema={ganttSchema} collectionName="gantt" collection={gantt}></Crud2>
    return React.createElement("div", null);
};
