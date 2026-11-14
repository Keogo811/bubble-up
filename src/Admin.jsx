import { useState } from 'react'
import { db, auth } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

// ⚠️ REMPLACE CET EMAIL PAR CELUI AVEC LEQUEL TU T'ES INSCRIT
const ADMIN_EMAIL = "hkingkeoman@gmail.com" 

function Admin() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Vérification de sécurité
  if (auth.currentUser?.email !== ADMIN_EMAIL) {
    return (
      <main className="main-content" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Accès refusé 🔒</h2>
        <p>Tu n'as pas les droits d'administrateur pour accéder à cette page.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ maxWidth: '200px', margin: '1rem auto' }}>
          Retour à l'accueil
        </button>
      </main>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        location,
        description
      })
      setMessage('Événement créé avec succès ! 🎉')
      setTitle('')
      setDate('')
      setLocation('')
      setDescription('')
    } catch (error) {
      setMessage("Erreur : " + error.message)
    }
  }

  return (
    <main className="main-content">
      <div className="profile-card">
        <h2>Espace Admin - Créer un événement</h2>
        {message && <p className="profile-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre de l'événement</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Tournoi Mario Kart" required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Local Bubble Up" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Détails de l'événement..." rows="3" required />
          </div>
          <button type="submit" className="btn-primary">Créer l'événement</button>
        </form>
      </div>
    </main>
  )
}

export default Admin