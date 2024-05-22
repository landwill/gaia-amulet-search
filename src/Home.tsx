import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import { Image, Text, Title } from '@mantine/core'
import { useReducer } from 'react'
import { ExternalLinkButton } from './components/ExternalLinkButton.tsx'
import { Notices } from './components/Notices.tsx'
import { INITIAL_HTML_DUMPS_STATE, pastedHtmlReducer } from './helpers/dispatchers.ts'
import { HtmlPasteList } from './page_segments/HtmlPasteList.tsx'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'

const NOTICES = [
  'Shareable (\'ghosting\') links, coming soon™️'
]

function Home() {
  const [pastedHtml, dispatchPastedHtmlAction] = useReducer(pastedHtmlReducer, INITIAL_HTML_DUMPS_STATE)

  return <>
    <Image h='4rem' w='4rem' mt={{ base: '0.5rem', md: '2rem' }} mb={{ base: '1.5rem', md: '3rem' }} src={legendaryDiamondAmulet}
           alt='Legendary diamond amulet icon' className='logo' style={{ display: 'inline' }} />
    <Title order={1} style={{ fontSize: '2.5rem', marginBottom: '3rem', lineHeight: 1 }} opacity='0.8'>Gaia Online Amulet Search</Title>
    <div style={{ marginBottom: 24, alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
      <HtmlPasteList pastedHtml={pastedHtml} dispatcher={dispatchPastedHtmlAction} />
      <Text my={24}>
        Insert the HTML of a Trade page into a text field above, and your amulets will be displayed below.
      </Text>
      <ExternalLinkButton href='https://github.com/landwill/gaia-amulet-search#readme' mb={12}>Click here for a guide</ExternalLinkButton>
      <Notices notices={NOTICES} />
    </div>
    <ResultsScreen inventoryHtml={pastedHtml} />
  </>
}

export default Home
