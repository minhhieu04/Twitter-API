import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import { useState } from 'react'

const APICaller = ({ file }) => {
  const url = 'http://localhost:4000/medias/upload-video-hls'

  const call = async () => {
    const formData = new FormData()
    formData.append('video', file)

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    return result
  }

  return call()
}

const Video = () => {
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    const response = await APICaller({ file })
    setResponse(response)
  }
  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <h2>Video HLS</h2>
      {response !== null && (
        <MediaPlayer title='Demo Play HLS' src={response.result.url} aspect={window.innerWidth / window.innerHeight}>
          <MediaProvider />

          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      )}

      {/* {response && <div>Uploaded</div>} */}
    </div>
  )
}

export default Video
