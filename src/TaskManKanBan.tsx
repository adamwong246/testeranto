import React, { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { UncontrolledBoard, KanbanBoard } from '@caldwell619/react-kanban'
import '@caldwell619/react-kanban/dist/styles.css'
import "gantt-task-react/dist/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@xyflow/react/dist/style.css';


import { Crud } from './Crud';
import { IKanban, ITask, kanbanZodSchema } from "./TaskManTypes";

export const Kanban = ({
  tasks, tests, kanban, openNewColumnModal, adminMode
}: {
  tasks: ITask[],
  tests: any,
  kanban: (IKanban & { _id: string })[],
  openNewColumnModal: any,
  adminMode: boolean,
}) => {
  const board: KanbanBoard<any> = {
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
            }
          }),
          rank: kb.rank
        }
      }).sort((a, b) => a.rank - b.rank),

      {
        id: 0,
        title: 'ARCHIVE',
        cards: tasks.filter((f) => f.state === "ARCHIVED")
      },

    ]
  }

  if (!adminMode) {
    return <Tab.Container id="left-tabs-example8" defaultActiveKey="feature-0">
      <Row>
        <Col sm={12}>
          {/* <button onClick={() => {
            openNewColumnModal()
          }}>new column</button> */}
          <UncontrolledBoard initialBoard={board} />
        </Col>
      </Row>
    </Tab.Container>
  }

  return <Crud schema={kanbanZodSchema} collectionName="kanban" collection={kanban}></Crud>

};