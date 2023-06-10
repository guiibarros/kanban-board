import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import cors from 'cors'

type TaskDraggedProps = 'source' | 'destination'
type Categories = 'pending' | 'ongoing' | 'completed'

interface TaskDraggedData {
  index: number
  droppableId: Categories
}

interface CommentAddedData {
  comment: string
  id: string
  category: Categories
  username: string
}

interface Params {
  id: string
  category: Categories
}

const PORT = 3333

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

app.use(cors())
app.use(express.json())

const tasks = {
  pending: {
    title: 'pending',
    items: [
      {
        id: randomUUID(),
        title: 'Send the figma file to Dima',
        comments: [],
      },
    ],
  },
  ongoing: {
    title: 'ongoing',
    items: [
      {
        id: randomUUID(),
        title: 'Review Github issues',
        comments: [
          {
            id: randomUUID(),
            name: 'David',
            text: 'Ensure you review before merging.',
          },
        ],
      },
    ],
  },
  completed: {
    title: 'completed',
    items: [
      {
        id: randomUUID(),
        title: 'Create technical contents',
        comments: [
          {
            id: randomUUID(),
            name: 'Dima',
            text: 'Make sure you check the requirements.',
          },
        ],
      },
    ],
  },
}

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected.`)

  socket.on('taskDragged', (data) => {
    const { source, destination } = data as Record<
      TaskDraggedProps,
      TaskDraggedData
    >

    const itemMoved = structuredClone(
      tasks[source.droppableId].items[source.index],
    )

    console.log('Dragged item =>', itemMoved)

    tasks[source.droppableId].items.splice(source.index, 1)
    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved)

    socket.emit('update-tasks', tasks)
  })

  socket.on('add-task', (data) => {
    const { task } = data

    tasks.pending.items.push({
      id: randomUUID(),
      title: task,
      comments: [],
    })

    socket.emit('update-tasks', tasks)
  })

  socket.on('add-comment', (data) => {
    const { comment, category, id, username } = data as CommentAddedData

    const task = tasks[category].items.find((task) => task.id === id)

    task?.comments.push({
      id: randomUUID(),
      name: username,
      text: comment,
    })

    socket.emit('update-comments', task?.comments)
  })

  socket.on('disconnect', () => {
    socket.disconnect()
    console.log(`🔥: ${socket.id} user has disconnected.`)
  })
})

app.get('/tasks', (request, response) => {
  return response.json(tasks)
})

app.get('/comments/:category/:id', (request, response) => {
  const { category, id } = request.params as Params

  const taskComments =
    tasks[category].items.find((task) => task.id === id)?.comments ?? []

  return response.json(taskComments)
})

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
