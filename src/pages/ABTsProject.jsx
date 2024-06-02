import { useEffect, useState } from "react";
import DropDownMenu from "../components/DropDownMenu";
import PageHeader from "../components/PageHeader"
import { FaPen } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown, MdFilterList } from "react-icons/md";
import MintABT from "./Minting/MintABT";
import { fetchABTs } from "../utilities/Contract";
import ActiveSection from "../components/ActiveSection";
import MarketCard from "../components/MarketCard";
import PageLoader from "./PageLoader";
import MyAbts from '../assets/MyAbts.png'

const dataURL = 'http://localhost:3000/uploads/'

const ABTsProject = ({client, market, abt, reader}) => {
  const [myABTs, setMyABTs] = useState([])
  const [displayedAbts, setDisplayedAbts] = useState([])
  const [abtFilter, setAbtFilter] = useState(0)
  const [openMint, setOpenMint] = useState(false)
  const [pdfFile, setPdfFile] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(true)

  const loadMyAbts = async () => {
    try { 
      const results = await reader.abtListingsOf(abt.target, client.signer.address)
      if (results.tokenIds.length > 0) {
        const tokenIds = results.tokenIds
        const tokenArray = Object.values(tokenIds).map(value => parseInt(value));
        const abtMetadata = await fetchABTs(tokenArray, client.chainId);

        const processedMetadata = abtMetadata.map(metadata => {
          const updatedImages = metadata.images.map(image => `${dataURL}${image}`);
          const document1image = metadata.document1.replace('.pdf', '.jpg');

          return {
            ...metadata,
            images: updatedImages,
            document1image: `${dataURL}${document1image}`,
            document1Link: `${dataURL}${metadata.document1}`
          };
        });
        
        const listingData = results.listingData 
        const combinedData = listingData.map((listing, index) => ({
          ...processedMetadata[index],
          tokenId: tokenArray[index],
          seller: listing.seller,
          priceUsd: parseInt(listing.usdPennyPrice) / 100,
          name: abtMetadata[index].name,
          owner: client.signer.address
        }));
        // console.log(combinedData);
  
        // Update the states
        setMyABTs(combinedData);
        setDisplayedAbts(combinedData);
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading my items:', error);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // await loadMyAbts()
    }
  }

  const updateFilter = () => {
    if (abtFilter === 2) {
      // Show ABTs with priceUsd equal to zero meaning not active
      setDisplayedAbts(myABTs.filter(abt => abt.priceUsd === 0));
    } else if (abtFilter === 1) {
      // show active abts
      setDisplayedAbts(myABTs.filter(abt => abt.priceUsd > 0));
    } else {
      // Default behavior: Show all ABTs
      setDisplayedAbts(myABTs);
    }
  };

  const handleListedFilterChange = (index) => {
    setAbtFilter(index);
  };

  useEffect(() => {
    updateFilter();
  }, [myABTs, abtFilter]);

  useEffect(() => {
    loadMyAbts();
    const interval = setInterval(loadMyAbts, 30000); // Refresh every 45 seconds

    return () => clearInterval(interval);
  }, []); 

  if (openMint) {
    return (
      <MintABT client={client} setOpenMint={setOpenMint} setPdfFile={setPdfFile} pdfFile={pdfFile} />
    )
  }

  if (loading) {
    return (
      <PageLoader />
    )
  }

  return (
    <>
      <PageHeader title={'My ABTs'} />
      <div className="w-full p-5 lg:px-10 lg:py-10 flex flex-col justify-center items-center gap-3 lg:gap-4">
        {
          myABTs.length > 0 ? (
            <>
              <div className="w-full border-[1px] border-stone-200 p-3 rounded flex justify-between items-center">
                <ActiveSection headers={['ABTs', 'Stacks']} active={activeSection} setActive={setActiveSection}  />
                <button onClick={() => setOpenMint(true)} className="w-full hidden sm:px-8 lg:px-10 sm:w-max py-2 gap-3 rounded-sm sm:flex justify-center items-center bg-primary1 text-white">
                  <div className='text-md lg:text-sm'>
                      <FaPen />
                  </div>
                  Create ABT
                </button>
              </div>
              <button onClick={() => setOpenMint(true)} className="w-full sm:hidden sm:px-5 py-2 gap-3 rounded-sm flex justify-center items-center bg-primary1 text-white">
                <div className='text-md lg:text-sm'>
                    <FaPen />
                </div>
                Create ABT
              </button>
              <div className={`min-[1500px]:border-0 w-full flex justify-between items-center ${myABTs.length > 0 ? 'pb-0' : 'pb-8'} min-[1500px]:pb-2 `}>
                <div className="flex justify-start items-center gap-2">
                  <p className="text-xl lg:text-2xl">
                    { abtFilter === 0 ? (
                        'All '
                    ) : abtFilter === 1 ? (
                        'Active '
                    ) : (
                        'Inactive '
                    )}
                    Listing&apos;s
                  </p>
                  <div className='text-xs lg:text-sm min-[1500px]:hidden'>
                      <MdOutlineKeyboardArrowDown />
                  </div>
                </div>
                <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} positioning={'right-0'} title={'Filter'} menuOptions={['All', 'Listed', 'Unlisted']} option={abtFilter}  updateFilter={handleListedFilterChange}  />
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full">
                {displayedAbts.map((abt, index) => {
                  return (
                    <MarketCard key={index} abt={abt} />
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center gap-6 flex-col border-[1px] rounded-sm border-slate-300 p-3 sm:p-12 md:p-18">
              <div className="w-full sm:w-80 md:w-96 flex justify-center items-center h-44 sm:h-52 md:h-64 bg-gradient-to-tr from-[#f0fdf5] via-[#e6faf9] to-[#f0fdf5] border-slate-400 border-[1px]">
                <img src={MyAbts} className="w-40 md:w-52 2xl:w-72" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-lg font-medium pb-[1px]">Get started with ABTs</h1>
                <p className="text-center text-base">Create a dynamic token in NIOVLABS</p>
                <p className="text-center text-base leading-5">Create a new ABT with multiple interchangeable layers</p>
              </div>
              <button onClick={() => setOpenMint(true)} className="w-full sm:w-max sm:px-5 py-2 gap-3 rounded-sm flex justify-center items-center bg-primary1 text-white">
                <div className='text-md lg:text-sm'>
                    <FaPen />
                </div>
                Create ABT
              </button>
            </div>
          )

        }
      </div>
    </>
  )
}

export default ABTsProject
