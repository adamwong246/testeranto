import { Gantt, Task } from "gantt-task-react";
import React from "react";
import { Row, Col } from "react-bootstrap";

import { IMilestone, IProject, ITask } from "./TaskManTypes";

export const GanttChart = ({
  tasks,
  milestones,
  projects,
  adminMode
}: {
  tasks: ITask[],
  milestones: IMilestone[],
  projects: IProject[],
  tests: any,
  adminMode: boolean

}) => {
  if (!adminMode) {

    const ganttTasks: any[] = [
      ...tasks.map((t) => {
        return {
          ...t,
          id: t._id,
          type: 'task' as any

        }
      }),
      ...milestones.map((m) => {
        return {
          ...m,
          id: m._id,
          type: 'milestone' as any,
          // start: m.date,
          // end: m.date,
          progress: 55

        }
      }),
      ...projects.map((p) => {
        return {
          ...p,
          id: p._id,
          type: 'project' as any,
          start: new Date(),
          end: new Date(),
          progress: 55

        }
      }),
    ];

    return <Row>
      <Col sm={12}>
        <Gantt tasks={ganttTasks} />
      </Col>
    </Row>

  }

  // return <Crud2 schema={ganttSchema} collectionName="gantt" collection={gantt}></Crud2>
  return <div></div>

};