import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchABTs } from "../utilities/Contract";
import Addresses from '../../utils/deploymentMap/31337.json'

const Marketplace = ({ abt, market, client }) => {
  const [tokenIds, setTokenIds] = useState([]);
  const [abts, setAbts] = useState([]);

  const loadMarketplaceItems = async () => {
    const tokens = await abt.numTokens();
    const numTokens = parseInt(tokens);
    if (numTokens > 0) {
      const ids = Array.from({ length: numTokens }, (_, index) => index + 1);
      //call to backend for metadata
      const abtMetadata = await fetchABTs(ids); 
      // console.log(abtMetadata)
      //call to smart contracts for listing info
      const abtListingInfo = await market.readListings(Addresses.AssetBoundToken, ids);
      // console.log(abtListingInfo)
      //below code is to combine both arrays for easier display into one single object for each abt isntead of two separate objects. 
      const combinedData = abtMetadata.map((metadata, index) => ({
        ...metadata,
        'seller': abtListingInfo[index].seller,
        usdPennyPrice: parseInt(abtListingInfo[index].usdPennyPrice) / 100,
        rawValueGas: parseInt(abtListingInfo[index].rawValueGas)  / (10**18),
        rawValueTkn: parseInt(abtListingInfo[index].rawValueTkn)
      }));
      setAbts(combinedData)
    }
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []); 
  return (
    <div>
      <PageHeader title={"Marketplace"} />
    </div>
  );
};

export default Marketplace;
