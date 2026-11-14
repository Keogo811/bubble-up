import { useState, useEffect } from 'react'
import { db, auth } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [username, setUsername] = useState('')
  const [games, setGames] = useState('')
  const [motivations, setMotivations] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const user = auth.currentUser
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setUsername(data.username || '')
          setGames(data.games || '')
          setMotivations(data.motivations || '')
        }
      } catch (error) {
        console.error("Erreur de chargement :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, navigate])

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await setDoc(doc(db, "users", user.uid), {
        username,
        games,
        motivations,
        email: user.email
      })
      setMessage('Profil sauvegardé avec succès ! ✨')
    } catch (error) {
      setMessage("Erreur lors de la sauvegarde : " + error.message)
    }
  }

  if (loading) return <main className="main-content"><p>Chargement du profil...</p></main>

  return (
    <main className="main-content">
      <div className="profile-card">
        <h2>Mon Profil</h2>
        <p className="profile-email">Connecté en tant que : {user?.email}</p>
        
        {message && <p className="profile-message">{message}</p>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Mon Pseudo</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Ex: Ludo_Sip"
              required 
            />
          </div>
          <div className="form-group">
            <label>Mes jeux préférés</label>
            <textarea 
              value={games} 
              onChange={(e) => setGames(e.target.value)} 
              placeholder="Ex: Mario Kart, Warhammer, Among Us..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Mes motivations (pourquoi je suis là ?)</label>
            <textarea 
              value={motivations} 
              onChange={(e) => setMotivations(e.target.value)} 
              placeholder="Ex: Rencontrer des gens, partager ma passion..."
              rows="3"
            />
          </div>
          <button type="submit" className="btn-primary">Sauvegarder mon profil</button>
        </form>
      </div>
    </main>
  )
}

export default Profile