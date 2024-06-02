import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchABTs } from "../utilities/Contract";
import PageLoader from "./PageLoader"
import ActiveSection from "../components/ActiveSection";
import { MdFilterList } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import DropDownMenu from "../components/DropDownMenu";
import GridOption from "../components/GridOption";
import MarketCard from "../components/MarketCard";
import { BACKEND_URL } from "../utilities/BackendURL";

const dataURL = `${BACKEND_URL}/api/uploads/`

const Marketplace = ({ abt, market, client, reader }) => {
  const [abts, setAbts] = useState([]);
  const [displayedAbts, setDisplayedAbts] = useState([])
  const [priceFilter, setPriceFilter] = useState(0)
  const [listedFilter, setListedFilter] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [gridView, setGridView] = useState(true)

  const loadMarketplaceItems = async () => {
    try {
      const tokens = await abt.numTokens();
      const numTokens = parseInt(tokens);
      if (numTokens > 0) {
        const ids = Array.from({ length: numTokens }, (_, index) => index + 1);
        //call to backend for metadata`
        const abtMetadata = await fetchABTs(ids, client.chainId); 
        // console.log({abtMetadata})
        
        const processedMetadata = abtMetadata.map(metadata => {
          // Prepend dataURL to each image
          const updatedImages = metadata.images.map(image => `${dataURL}${image}`);
          
          // Add document1image with .jpg extension
          const document1image = metadata.document1.replace('.pdf', '.jpg');

          return {
            ...metadata,
            images: updatedImages,
            document1image: `${dataURL}${document1image}`,
            document1Link: `${dataURL}${metadata.document1}`
          };
        });
        
        const Addresses = await import(`../../utils/deploymentMap/${client.chainId}.json`);

        //call to smart contracts for listing info
        const abtListingInfo = await reader.readListings(Addresses.AssetBoundToken, ids);
        // console.log({abtListingInfo})
        // console.log({abtListingInfo})

        //fetch owner info for each token
        const ownerPromises = ids.map(id => abt.ownerOf(id));
        const owners = await Promise.all(ownerPromises);

        //below code is to combine both arrays for easier display into one single object for each abt instead of two separate objects. 
        const combinedData = processedMetadata.map((metadata, index) => ({
          ...metadata,
          'seller': abtListingInfo[index].seller,
          priceUsd: parseInt(abtListingInfo[index].usdPennyPrice) / 100,
          priceGas: parseInt(abtListingInfo[index].rawValueGas)  / (10**18),
          tokenId: ids[index],
          owner: owners[index]
          // rawValueTkn: parseInt(abtListingInfo[index].rawValueTkn)
        }));
        // console.log({combinedData})
        // Sort combinedData by priceUsd from highest to lowest as default
        combinedData.sort((a, b) => b.priceUsd - a.priceUsd);
        // console.log(combinedData)
        setAbts(combinedData)
        setDisplayedAbts(combinedData)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading marketplace items:', error);
    }
  };

  const applyFilters = () => {
    let filteredAbts = [...abts];

    if (listedFilter === 1) {
      filteredAbts = filteredAbts.filter(abt => abt.priceUsd > 0); //listed
    } else if (listedFilter === 2) {
      filteredAbts = filteredAbts.filter(abt => abt.priceUsd === 0); //unlisted
    }

    if (priceFilter === 1) {
      filteredAbts.sort((a, b) => a.priceUsd - b.priceUsd); // Low to High
    } else {
      filteredAbts.sort((a, b) => b.priceUsd - a.priceUsd); // High to Low
    }

    setDisplayedAbts(filteredAbts);
  };

  const handleListedFilterChange = (index) => {
    setListedFilter(index);
  };

  const handlePriceFilterChange = (index) => {
    setPriceFilter(index);
  };

  useEffect(() => {
    loadMarketplaceItems();
    const interval = setInterval(loadMarketplaceItems, 45000); // Refresh every 45 seconds

    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    applyFilters();
    
  }, [abts, listedFilter, priceFilter]);

  if (loading) {
    return (
      <PageLoader />
    )
  }

  return (
    <>
      <PageHeader title={"Marketplace"} />
      <div className="w-full p-5 lg:p-10 flex flex-col justify-center items-start gap-2 lg:gap-3">
        <div className="w-full border-[1px] border-stone-200 p-3 rounded">
          <ActiveSection headers={['ABTs', 'Stacks']} active={activeSection} setActive={setActiveSection}  />
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-3">
            <DropDownMenu Icon={MdFilterList} flexDirection={'flex-row-reverse'} positioning={'left-0'} title={'Filter'} menuOptions={['All', 'Listed', 'Unlisted']} option={listedFilter}  updateFilter={handleListedFilterChange}  />
            <GridOption grid={gridView} setGrid={setGridView}  />
          </div>
          <DropDownMenu Icon={FiChevronDown} flexDirection={'flex-row'} positioning={'right-0'} title={'Price'} menuOptions={['High to Low', 'Low to High']} option={priceFilter} updateFilter={handlePriceFilterChange}  />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full">
          {displayedAbts.map((abt, index) => {
            return (
              <MarketCard key={index} abt={abt} />
            )
          })}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
