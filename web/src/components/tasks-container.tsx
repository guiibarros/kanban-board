import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
import { Socket } from 'socket.io-client'

interface TasksContainerProps {
  socket: Socket
}

interface Comment {
  id: string
  name: string
  text: string
}

interface Task {
  id: string
  title: string
  comments: Array<Comment>
}

interface TaskCategory {
  title: string
  items: Array<Task>
}

type TasksCategories = 'pending' | 'ongoing' | 'completed'
type Tasks = Record<TasksCategories, TaskCategory>

export function TasksContainer({ socket }: TasksContainerProps) {
  const [tasks, setTasks] = useState<Tasks>({} as Tasks)

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('http://localhost:3333/tasks')
      const data = await response.json()

      console.log(data)
      setTasks(data)
    }

    fetchTasks()
  }, [])

  useEffect(() => {
    socket.on('update-tasks', (tasks) => {
      setTasks(tasks)
    })
  }, [socket])

  function handleDragEnd({ destination, source }: DropResult) {
    if (!destination) {
      return false
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return false
    }

    socket.emit('taskDragged', {
      source,
      destination,
    })
  }

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map(([, task]) => (
          <div
            className={`${task.title.toLowerCase()}__wrapper`}
            key={task.title}
          >
            <h3>{task.title} Tasks</h3>
            <div className={`${task.title.toLowerCase()}__container`}>
              <Droppable droppableId={task.title}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task.items.map((taskItem, index) => (
                      <Draggable
                        key={taskItem.id}
                        draggableId={taskItem.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${task.title.toLowerCase()}__items`}
                          >
                            <p>{taskItem.title}</p>
                            <p className="comment">
                              <Link
                                to={`/comments/${task.title}/${taskItem.id}`}
                              >
                                {taskItem.comments.length > 0
                                  ? 'View comments'
                                  : 'Add comment'}
                              </Link>
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  )
}
