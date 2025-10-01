import { useEffect, useState } from 'react'
import './App.css'
import { fetchMe, login, logout, getPresignedUpload, uploadToS3, transcodeVideo, listVideos } from './api'

function App() {
  const [auth, setAuth] = useState({ authenticated: false, user: null })
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [transcoding, setTranscoding] = useState(false)
  const [message, setMessage] = useState('')
  const [videoId, setVideoId] = useState('')
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [transcodedUrls, setTranscodedUrls] = useState({})

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(typeof url === 'string' ? url : url?.url)
      if (!response.ok) throw new Error('Failed to download file')
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setMessage(err.message || 'Download failed')
    }
  }

  useEffect(() => {
    fetchMe()
      .then((data) => {
        setAuth(data)
        if (data.authenticated) {
          // Load videos when user is authenticated
          loadVideos()
        }
      })
      .catch(() => {
        setAuth({ authenticated: false })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async () => {
    if (!file) return
    try {
      setUploading(true)
      setMessage('Requesting upload URL...')
      
      // Debug: Check authentication status before making request
      const authCheck = await fetchMe()
      console.log('Auth status before upload:', authCheck)
      
      const presigned = await getPresignedUpload(file.name)
      setMessage('Uploading to S3...')
      await uploadToS3(presigned, file)
      setMessage('Uploaded successfully! You can now transcode the video.')
      // Refresh video list after upload
      await loadVideos()
    } catch (e) {
      setMessage(e.message || 'Upload failed')
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleTranscode = async () => {
    if (!videoId) return
    try {
      setTranscoding(true)
      setMessage('Starting video transcoding...')
      const downloadUrl = await transcodeVideo(videoId)
      setMessage('Transcoding completed! Download URL ready.')
      // Store the transcoded URL
      setTranscodedUrls(prev => ({ ...prev, [videoId]: downloadUrl }))
      // Refresh video list after transcoding
      await loadVideos()
    } catch (e) {
      setMessage(e.message || 'Transcoding failed')
    } finally {
      setTranscoding(false)
    }
  }

  const loadVideos = async () => {
    try {
      setLoadingVideos(true)
      const videoList = await listVideos()
      setVideos(videoList)
    } catch (e) {
      setMessage(e.message || 'Failed to load videos')
    } finally {
      setLoadingVideos(false)
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

  if (!auth.authenticated) {
    return (
      <div>
        <h1>Video Portal</h1>
        <section className="card">
          <h2>Sign in</h2>
          <p>Please sign in to continue.</p>
          <button onClick={login}>Login with Cognito</button>
        </section>
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
            <h2>Transcode Video</h2>
            <input
              type="text"
              placeholder="Video ID to transcode"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
            />
            <button onClick={handleTranscode} disabled={!videoId || transcoding}>
              {transcoding ? 'Transcoding...' : 'Transcode Video'}
            </button>
          </section>

          <section className="card">
            <h2>My Videos</h2>
            <button onClick={loadVideos} disabled={loadingVideos}>
              {loadingVideos ? 'Loading...' : 'Refresh Video List'}
            </button>
            {videos.length > 0 ? (
              <div>
                <h3>Your Videos:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {videos.map((video, index) => (
                    <div key={index} style={{ 
                      border: '1px solid #ccc', 
                      padding: '10px', 
                      borderRadius: '5px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <div><strong>ID:</strong> {video.videoId}</div>
                      <div><strong>Filename:</strong> {video.filename}</div>
                      <div><strong>Status:</strong> {video.status || 'Uploaded'}</div>
                      <div style={{ marginTop: '5px' }}>
                        <button 
                          onClick={() => setVideoId(video.videoId)}
                          style={{ marginRight: '10px' }}
                        >
                          Use for Transcoding
                        </button>
                        {transcodedUrls[video.videoId] && (
                          <button
                            onClick={() => {
                              const url = transcodedUrls[video.videoId]
                              if (typeof url === 'string' || url?.url) {
                                downloadFile(url, `${video.videoId}.mp4`)
                              } else {
                                setMessage('Invalid download URL')
                              }
                            }}
                          >
                            Download Transcoded Video
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No videos found. Upload a video to get started!</p>
            )}
          </section>
        </>
      )}

      {message && <p className="read-the-docs">{message}</p>}
    </div>
  )
}

export default App
