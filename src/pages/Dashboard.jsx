import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">UrbanLink Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-4">Welcome, {user?.email}</h2>
        <p className="text-gray-600">Dashboard ready for features!</p>
      </div>
    </div>
  )
}
