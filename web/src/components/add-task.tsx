import { FormEvent, useState } from 'react'
import { Socket } from 'socket.io-client'

interface AddTaskProps {
  socket: Socket
}

export function AddTask({ socket }: AddTaskProps) {
  const [task, setTask] = useState('')

  function handleAddTodo(event: FormEvent) {
    event.preventDefault()

    socket.emit('add-task', { task })
    setTask('')
  }

  return (
    <form className="form__input" onSubmit={handleAddTodo}>
      <label htmlFor="task">Add todo</label>
      <input
        type="text"
        name="task"
        id="task"
        required
        className="input"
        value={task}
        onChange={(event) => setTask(event.target.value)}
      />
      <button className="addTodoBtn">ADD TODO</button>
    </form>
  )
}
