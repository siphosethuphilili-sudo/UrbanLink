import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">UrbanLink</h1>
        <p className="text-xl text-blue-100 mb-8">Municipal Services Management System</p>
        <Link
          to="/login"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
