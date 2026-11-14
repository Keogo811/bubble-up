import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { db, auth } from './firebase'
import { collection, getDocs } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import EventDetails from './EventDetails'
import Auth from './Auth'
import Profile from './Profile'
import Admin from './Admin'
import Swipe from './Swipe'
import Chat from './Chat'
import './App.css'

const ADMIN_EMAIL = "hkingkeoman@gmail.com" // ⚠️ REMPLACE PAR TON EMAIL

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"))
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setEvents(eventsData)
      } catch (error) {
        console.error("Erreur lors de la récupération :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <main className="main-content">
      <section className="hero">
        <h2>Bienvenue sur Bubble Up 🌴🎮</h2>
        <p>L'association gaming et ludique du 13ème arrondissement.</p>
        <div className="stats-container">
          <div className="stat-card"><h3>150+</h3><p>Membres</p></div>
          <div className="stat-card"><h3>12</h3><p>Événements / mois</p></div>
          <div className="stat-card"><h3>3</h3><p>Niveaux d'abonnement</p></div>
        </div>
      </section>

      <section className="calendar-section">
        <h2>Prochains Événements</h2>
        {loading ? <p>Chargement des événements...</p> : (
          <div className="events-list">
            {events.map(event => (
              <Link to={`/event/${event.id}`} key={event.id} className="event-card-link">
                <div className="event-card">
                  <h3>{event.title}</h3>
                  <p className="event-date">📅 {event.date}</p>
                  <p>{event.description}</p>
                  <p className="event-location">📍 {event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  return (
    <div className="app-container">
      {/* --- ARRIÈRE-PLAN ANIMÉ --- */}
      <div className="bg-lights">
        <div className="orb orb-pink"></div>
        <div className="orb orb-blue"></div>
        <div className="orb orb-green"></div>
        <div className="orb orb-orange"></div>
      </div>
      <div className="bg-emojis">
        <span className="floating-emoji e1">🎮</span>
        <span className="floating-emoji e2">🌴</span>
        <span className="floating-emoji e3">🕹️</span>
        <span className="floating-emoji e4">🥤</span>
        <span className="floating-emoji e5">👾</span>
        <span className="floating-emoji e6">🎲</span>
        <span className="floating-emoji e7">🎧</span>
      </div>

      <header className="header">
        <Link to="/" className="logo" style={{textDecoration: 'none'}}>Bubble Up 🥤</Link>
        <nav>
          {user ? (
            <div className="user-info">
              <Link to="/swipe" className="profile-link">Jouer 🕹️</Link>
              <Link to="/profile" className="profile-link">Mon Profil</Link>
              {isAdmin && <Link to="/admin" className="profile-link admin-link">Admin</Link>}
              <button className="btn-login" onClick={handleLogout}>Déconnexion</button>
            </div>
          ) : (
            <Link to="/auth">
              <button className="btn-login">Connexion</button>
            </Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/swipe" element={<Swipe />} />
      </Routes>

      <Chat />
    </div>
  )
}

export default App