import { Button, ButtonGroup, Container, Dropdown, DropdownButton, Form, Navbar, NavDropdown, Table, ToggleButton } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import '@caldwell619/react-kanban/dist/styles.css'
import { FormSchema, Form as ZodForm } from '@zodform/core';
import { z } from 'zod';

export const Crud = ({ collection, collectionName, schema }: { collection: any, collectionName: string, schema: FormSchema }) => {
  return <div>
    <h3>{collectionName}</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        <tr>

          <td>add new record</td>
          <td>
            <ZodForm schema={schema} />
          </td>

        </tr>
        {
          collection.map((doc) => {
            return <tr>
              <td>{doc._id}</td>
              <td>{JSON.stringify(doc, null, 2)}</td>
            </tr>
          })
        }


      </tbody>
    </Table>
  </div>
}