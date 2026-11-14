import { useState, useEffect, useRef } from 'react'
import { db, auth } from './firebase'
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const user = auth.currentUser

  useEffect(() => {
    if (!isOpen || !user) return

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      limit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [isOpen, user])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp()
      })
      setNewMessage('')
    } catch (error) {
      console.error("Erreur d'envoi :", error)
    }
  }

  if (!user) return null // Le chat n'apparaît que si on est connecté

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>💬 Chat Global</h3>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p className="chat-empty">Aucun message. Sois le premier !</p>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-message ${msg.userId === user.uid ? 'my-message' : 'other-message'}`}
                >
                  <span className="chat-author">{msg.userEmail.split('@')[0]}</span>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-form">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écris un message..."
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  )
}

export default Chat