import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const fakeProfiles = [
  { id: 1, name: 'Ludo_Sip', games: ['Mario Kart', 'Among Us'], color: '#FF8A8A' },
  { id: 2, name: 'Jeanne', games: ['Warhammer', 'LOL'], color: '#6EE7B7' },
  { id: 3, name: 'Marc', games: ['Zelda', 'SSBU'], color: '#63B3ED' },
  { id: 4, name: 'Sarah', games: ['Mario Kart', 'Animal Crossing'], color: '#F6E05E' }
]

function Swipe() {
  const [profiles, setProfiles] = useState(fakeProfiles)
  const navigate = useNavigate()

  const handleSwipe = () => {
    setProfiles(prev => prev.slice(1))
  }

  if (profiles.length === 0) {
    return (
      <main className="main-content">
        <div className="game-neon-wrapper" style={{ textAlign: 'center' }}>
          <h2>Plus de profils pour le moment !</h2>
          <p style={{ color: '#a0a0b0', marginBottom: '2rem' }}>Reviens plus tard pour rencontrer d'autres joueurs.</p>
          <button className="btn-swipe btn-match" onClick={() => navigate('/')}>
            Retour à l'accueil
          </button>
        </div>
      </main>
    )
  }

  const current = profiles[0]

  return (
    <main className="main-content">
      <div className="game-neon-wrapper">
        <h2>Trouve ton binôme de jeu 🎮</h2>
        <p style={{ color: '#a0a0b0', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
          Swipe à droite si tu veux matcher, à gauche sinon.
        </p>

        <div className="swipe-card">
          <div className="swipe-avatar" style={{ backgroundColor: current.color, color: '#121220' }}>
            {current.name[0]}
          </div>
          <h3>{current.name}</h3>
          <p style={{ color: '#a0a0b0', marginTop: '0.5rem' }}>Joue à : {current.games.join(', ')}</p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn-swipe btn-pass" onClick={handleSwipe}>Passer</button>
          <button className="btn-swipe btn-match" onClick={handleSwipe}>Matcher</button>
        </div>
      </div>
    </main>
  )
}

export default Swipe