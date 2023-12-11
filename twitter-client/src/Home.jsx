import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

const getGoogleAuthUrl = () => {
  const { VITE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env
  console.log({ VITE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI })
  const url = 'https://accounts.google.com/o/oauth2/v2/auth'
  const query = {
    client_id: '809076833472-mu8114n1drke7p28sbf0i7up36qkrq86.apps.googleusercontent.com',
    redirect_uri: 'http://localhost:4000/users/oauth/google',
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline'
  }
  const queryString = new URLSearchParams(query).toString()
  return `${url}?${queryString}`
}

const googleOAthUrl = getGoogleAuthUrl()

const Home = () => {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'))
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.reload()
  }

  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </span>
        <span>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </span>
      </div>
      <h2>Video Streaming</h2>
      <video controls width={500}>
        <source src='' type='video/mp4' />
      </video>
      <h2>Video HLS</h2>
      <MediaPlayer
        title='Demo Play HLS'
        src='http://localhost:4000/medias/video-hls/ee8fd068-d8fb-40d7-9a8e-dbc3db08b2a6/master.m3u8'
        aspect={window.innerWidth / window.innerHeight}
      >
        <MediaProvider />

        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
      <h1>GOOGLE OAUTH 2.0</h1>
      <p className='read-the-docs'>
        {isAuthenticated ? (
          <>
            <span>You are Login success</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to={googleOAthUrl}>Login with Google</Link>
        )}
      </p>
    </>
  )
}

export default Home
