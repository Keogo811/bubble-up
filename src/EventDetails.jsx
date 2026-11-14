import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() })
        } else {
          console.log("Aucun événement trouvé !")
        }
      } catch (error) {
        console.error("Erreur :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (loading) return <main className="main-content"><p>Chargement...</p></main>
  if (!event) return <main className="main-content"><p>Événement introuvable.</p></main>

  return (
    <main className="main-content">
      <Link to="/" className="back-link">← Retour à l'accueil</Link>
      <div className="event-details-card">
        <h1>{event.title}</h1>
        <p className="event-date">📅 {event.date}</p>
        <p className="event-location">📍 {event.location}</p>
        <div className="event-description">
          <h3>À propos de cet événement</h3>
          <p>{event.description}</p>
        </div>
      </div>
    </main>
  )
}

export default EventDetails