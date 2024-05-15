import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import { useState } from 'react'

function App() {
  const [textAreaText, setTextAreaText] = useState<string>('')

  return (
    <>
      <div>
        <img src={legendaryDiamondAmulet} className='logo' alt='Legendary diamond amulet icon' height='60px' />
      </div>
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Amulet Search</h1>
        <textarea style={{ marginBottom: '1em', height: '100px', resize: 'none' }} value={textAreaText} onChange={e => {setTextAreaText(e.target.value)}} />
        <div>
          <button style={{ marginRight: '6px' }}>
            Clear
          </button>
          <button type='submit'>
            Submit
          </button>
        </div>
        <p>
          Insert the HTML of a Trade page into the above and press submit.
        </p>
        <p style={{ color: '#999', cursor: 'not-allowed' }}>Click here for a guide.</p>
      </form>
    </>
  )
}

export default App
