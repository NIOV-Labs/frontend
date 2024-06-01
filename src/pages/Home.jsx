import Hero from '../components/HomeComponents/Hero'
import HomeNavBar from '../components/HomeComponents/HomeNavBar'
import Card1 from '../components/HomeComponents/Card1'
import WhatAbts from '../assets/WhatAbts.svg'
import FDC from '../assets/FDC.svg'
import Chainlink from '../assets/Chainlink.svg'
import CardCarousel from '../components/HomeComponents/CardCarousel'

const Home = ({client, web3Handler, hasWeb3}) => {
  const cardInfo = [
    {
      title: 'What are ABTs',
      description: 'Asset Bound Tokens (ABTs) by NIOV Labs redefine digital ownership, merging innovation with flexibility. Powered by our Federation Cloud (FDC). ABTs infuse true dynamic utility aesthetics to a new level of engagement and asset personalization.',
      button1: 'Contact Sales',
      button2: 'Learn More',
      image: WhatAbts,
      imageBackground: 'from-[#f2fcfb] via-[#e8fcfa] to-[#f2fcfb]',
      tileDirection: 'lg:flex-row-reverse'
    },
    {
      title: 'Integration with Federation Cloud (FDC)',
      description: 'Seamlessly integrate with Federation Cloud (FDC) to unlock the full potential of you Asset Bound Tokens (ABTs). FDC`s powerful platform enhances your asset management capabilities, enabling real-time analytics, compliance, and effortless scalability. Transform how you interact with digital assets, making each experience more efficient, secure, and personalized.',
      button1: 'Contact Sales',
      button2: '',
      image: FDC,
      imageBackground: 'from-[#FFECF6] via-[#FFE0F0] to-[#FFECF6]',
      tileDirection: 'lg:flex-row'
    },
    {
      title: 'Integration with Chainlink Ecosystem',
      description: 'Seamlessly integrate with Federation Cloud (FDC) to unlock the full potential of you Asset Bound Tokens (ABTs). FDC`s powerful platform enhances your asset management capabilities, enabling real-time analytics, compliance, and effortless scalability. Transform how you interact with digital assets, making each experience more efficient, secure, and personalized.',
      button1: '',
      button2: 'Learn More',
      image: Chainlink,
      imageBackground: 'from-white via-white to-[#EAE3FD]',
      tileDirection: 'lg:flex-row-reverse'
    },
  ]
  return (
    <>
      <HomeNavBar client={client} hasWeb3={hasWeb3} web3Handler={web3Handler}/>
      <div className='mt-[4.5rem] xl:mt-[5rem] w-full mx-auto flex flex-col justify-center items-center lg:gap-10 overflow-hidden'>
        <Hero />
        {cardInfo.map((card, index) => {
          return (
            <Card1 key={index} title={card.title} description={card.description} button1={card.button1} button2={card.button2} image={card.image} gradient={card.imageBackground} direction={card.tileDirection} />
          )
        })}
        <CardCarousel />
      </div>
    </>
  )
}

export default Home