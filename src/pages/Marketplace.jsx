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
      const abtMetadata = await fetchABTs(ids); 
      const abtListingInfo = await market.readListings(Addresses.AssetBoundToken, ids);
      //below code is to combine both arrays for easier display. 
      // console.log(abtListingInfo[0].seller)
      // console.log(abtListingInfo[0].usdPennyPrice)
      // console.log(abtListingInfo[0].rawValueGas)
      // console.log(abtListingInfo[0].rawValueTkn)
      // const combinedData = abtMetadata.map((metadata, index) => ({
      //   ...metadata,
      //   'seller': abtListingInfo[index].seller,
      //   'usdPennyPrice': abtListingInfo[index].usdPennyPrice,
      //   'rawValueGas': abtListingInfo[index].rawValueGas,
      //   'rawValueTkn': abtListingInfo[index].rawValueTkn
      // }));
      // console.log(combinedData)
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
