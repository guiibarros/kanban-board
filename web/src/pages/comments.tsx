import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3333')

interface TaskComments {
  id: string
  name: string
  text: string
}

export function Comments() {
  const { category, id } = useParams()

  const [comment, setComment] = useState('')
  const [commentList, setCommentList] = useState<TaskComments[]>([])

  useEffect(() => {
    async function fetchComments() {
      const response = await fetch(
        `http://localhost:3333/comments/${category}/${id}`,
      )
      const comments = await response.json()

      setCommentList(comments)
    }

    fetchComments()
  }, [category, id])

  useEffect(() => {
    socket.on('update-comments', (comments) => setCommentList(comments))
  }, [])

  function addComment(event: FormEvent) {
    event.preventDefault()

    socket.emit('add-comment', {
      comment,
      category,
      id,
      username: localStorage.getItem('username'),
    })

    setComment('')
  }

  return (
    <div className="comments__container">
      <form className="comment__form" onSubmit={addComment}>
        <label htmlFor="comment">Add a comment</label>
        <textarea
          placeholder="Type your comment"
          name="comment"
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          required
        />
        <button className="commentBtn">ADD COMMENT</button>
      </form>
      <div className="comments__section">
        <h2>Existing comments</h2>
        {commentList.map((comment) => (
          <div key={comment.id}>
            <p>
              <span style={{ fontWeight: 700 }}>{comment.text}</span> By{' '}
              {comment.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
