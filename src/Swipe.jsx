import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const fakeProfiles = [
  { id: 1, name: 'Ludo_Sip', games: ['Mario Kart', 'Among Us'], color: '#FF9A8B' },
  { id: 2, name: 'Jeanne', games: ['Warhammer', 'LOL'], color: '#8EE4AF' },
  { id: 3, name: 'Marc', games: ['Zelda', 'SSBU'], color: '#74b9ff' },
  { id: 4, name: 'Sarah', games: ['Mario Kart', 'Animal Crossing'], color: '#a29bfe' }
]

function Swipe() {
  const [profiles, setProfiles] = useState(fakeProfiles)
  const navigate = useNavigate()

  const handleSwipe = () => {
    setProfiles(prev => prev.slice(1))
  }

  if (profiles.length === 0) {
    return (
      <main className="main-content" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Plus de profils pour le moment !</h2>
        <p>Reviens plus tard pour rencontrer d'autres joueurs.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ maxWidth: '200px', margin: '1rem auto' }}>
          Retour à l'accueil
        </button>
      </main>
    )
  }

  const current = profiles[0]

  return (
    <main className="main-content" style={{ textAlign: 'center' }}>
      <h2>Trouve ton binôme de jeu 🎮</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
        Swipe à droite si tu veux matcher, à gauche sinon.
      </p>

      <div className="swipe-card" style={{ borderColor: current.color }}>
        <div className="swipe-avatar" style={{ backgroundColor: current.color }}>
          {current.name[0]}
        </div>
        <h3>{current.name}</h3>
        <p>Joue à : {current.games.join(', ')}</p>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button className="btn-swipe btn-pass" onClick={handleSwipe}>Passer</button>
        <button className="btn-swipe btn-match" onClick={handleSwipe}>Matcher</button>
      </div>
    </main>
  )
}

export default Swipe