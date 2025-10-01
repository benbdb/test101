import { useEffect, useState } from 'react'
import './App.css'
import { fetchMe, login, logout, getPresignedUpload, uploadToS3, getDownloadUrl } from './api'

function App() {
  const [auth, setAuth] = useState({ authenticated: false, user: null })
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [videoId, setVideoId] = useState('')

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setAuth(data)
        if (!data.authenticated) {
          login()
        }
      })
      .catch(() => {
        setAuth({ authenticated: false })
        login()
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async () => {
    if (!file) return
    try {
      setUploading(true)
      setMessage('Requesting upload URL...')
      const presigned = await getPresignedUpload()
      setMessage('Uploading to S3...')
      await uploadToS3(presigned, file)
      setMessage('Uploaded successfully')
    } catch (e) {
      setMessage(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const url = await getDownloadUrl(videoId)
      if (typeof url === 'string') {
        window.open(url, '_blank')
      } else if (url?.url) {
        window.open(url.url, '_blank')
      } else {
        setMessage('No URL returned')
      }
    } catch (e) {
      setMessage(e.message || 'Failed to get download URL')
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Video Portal</h1>
        <p className="read-the-docs">Checking session…</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Video Portal</h1>

      <section className="card">
        <h2>Authentication</h2>
        {auth.authenticated ? (
          <div>
            <p>Signed in as {auth.user?.email || auth.user?.username}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Login with Cognito</button>
        )}
      </section>

      {auth.authenticated && (
        <>
          <section className="card">
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </section>

          <section className="card">
            <h2>Download Video</h2>
            <input
              type="text"
              placeholder="Transcoded video ID"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
            />
            <button onClick={handleDownload} disabled={!videoId}>Get Download URL</button>
          </section>
        </>
      )}

      {message && <p className="read-the-docs">{message}</p>}
    </div>
  )
}

export default App
