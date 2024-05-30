import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchABTs } from "../utilities/Contract";
import Addresses from '../../utils/deploymentMap/31337.json'
import Loader from "../components/Loader";
import PageLoader from "./PageLoader"

const Marketplace = ({ abt, market, client }) => {
  const [abts, setAbts] = useState([]);
  const [displayedAbts, setDisplayedAbts] = useState([])
  const [priceFilter, setPriceFilter] = useState(0)
  const [listedFilter, setListedFilter] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadMarketplaceItems = async () => {
    try {
      const tokens = await abt.numTokens();
      const numTokens = parseInt(tokens);
      if (numTokens > 0) {
        const ids = Array.from({ length: numTokens }, (_, index) => index + 1);
        //call to backend for metadata
        const abtMetadata = await fetchABTs(ids); 
        //call to smart contracts for listing info
        const abtListingInfo = await market.readListings(Addresses.AssetBoundToken, ids);
        //below code is to combine both arrays for easier display into one single object for each abt instead of two separate objects. 
        const combinedData = abtMetadata.map((metadata, index) => ({
          ...metadata,
          'seller': abtListingInfo[index].seller,
          priceUsd: parseInt(abtListingInfo[index].usdPennyPrice) / 100,
          priceGas: parseInt(abtListingInfo[index].rawValueGas)  / (10**18),
          // rawValueTkn: parseInt(abtListingInfo[index].rawValueTkn)
        }));
        // Sort combinedData by priceUsd from highest to lowest to begin with
        combinedData.sort((a, b) => b.priceUsd - a.priceUsd);
        setAbts(combinedData)
        setDisplayedAbts(combinedData)
      }
    } catch (error) {
      console.error('Error loading marketplace items:', error);
    } finally {
      setLoading(false)
    }
  };

  const applyFilters = (allAbts) => {
    let filteredAbts = allAbts;

    if (listedFilter === 1) {
      filteredAbts = filteredAbts.filter(abt => abt.priceUsd > 0);
    } else if (listedFilter === 2) {
      filteredAbts = filteredAbts.filter(abt => abt.priceUsd === 0);
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
    applyFilters(abts);
  };

  const handlePriceFilterChange = (index) => {
    setPriceFilter(index);
    applyFilters(abts);
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []); 

  useEffect(() => {
    applyFilters(abts);
  }, [listedFilter, priceFilter]);

  if (loading) {
    return (
      <PageLoader />
    )
  }

  return (
    <div>
      <PageHeader title={"Marketplace"} />
    </div>
  );
};

export default Marketplace;
