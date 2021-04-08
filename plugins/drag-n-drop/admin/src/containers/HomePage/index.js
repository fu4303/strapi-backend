/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Table } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import { request } from 'strapi-helper-plugin';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
`;

const Li = styled.li`
  list-style-type: none;
  margin: 10px;
  border: 1px dashed #292b2c;
  padding: 10px;
`

const HomePage = (props) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const response = await request('/whats-ons?_sort=position:DESC', { method: 'GET' })

      setData(response)
    }
    getData()
  }, [])

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData(items);
  }

  return (
    <div className="container-fluid" style={{ padding: '30px 18px' }}>
      <Header
        actions={[
          {
            label: 'Cancel',
            onClick: () => alert('Cancel button clicked'),
            color: 'cancel',
            type: 'button',
          },
          {
            label: 'Save',
            onClick: () => alert('Save button clicked'),
            color: 'success',
            type: 'submit',
          },
        ]}
        title={{
          label: 'Whats On Order',
        }}
      />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="dragItems">
          {(provided) => (
            <Ul {...provided.droppableProps} ref={provided.innerRef}>
              {data.map((item, index) => (
                <Draggable key={item.id} draggableId={`list-${item.id}`} index={index}>
                  {(provided) => (
                    <Li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {item.heading}
                    </Li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default memo(HomePage);