import { io } from 'socket.io-client'

import { AddTask } from '../components/add-task'
import { Nav } from '../components/nav'
import { TasksContainer } from '../components/tasks-container'

const socket = io('http://localhost:3333')

export function Tasks() {
  return (
    <>
      <Nav />
      <AddTask socket={socket} />
      <TasksContainer socket={socket} />
    </>
  )
}
