import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useEffect, useState } from 'react';
import Accordian from '../components/Accordian';
import { fetchABT } from '../utilities/Contract';
import Loader from '../components/Loader';
import ImageCarousel from '../components/ImageCarousel';
import LoaderTwo from '../components/LoaderTwo';
import { ethers } from 'ethers';

const dataURL = 'http://localhost:3000/uploads/'

const ABTDetails = ({ client, market, abt }) => {
  const { id } = useParams();
  const [abtInfo, setAbtInfo] = useState({
    owner: ethers.ZeroAddress
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFunction, setLoadingFunction] = useState(false)
  const [price, setPrice] = useState('0.00');

  const fetchABTDetails = async () => {
    try {
        const response = await fetchABT(id);
        // console.log(response)

        //handling images
        const document1image = `${dataURL}${response.document1.replace('.pdf', '.jpg')}`
        const document1Link = `${dataURL}${response.document1}`
        const images = response.images.map((image) => `${dataURL}${image}`);
        // console.log(abt)
        // //checking to see owner of abt 
        const owner = await abt.ownerOf(id);  
        // console.log(owner)
        // //checking to see if abt is market approved
        const approvedAddress = await abt.getApproved(id) 
        // console.log(approvedAddress)
        const isApproved = approvedAddress === market.target

        //read abt listing info
        const listing = await market.readListing(abt.target, id)
        // console.log(listing)
        const signerIsSeller = listing.seller === client.signer.address
        const priceUsd = (parseInt(listing[1]) / 100).toFixed(2)
        const priceGas = (parseInt(listing[2]) / 10 ** 18).toFixed(18)

        const {name, document1, document2, externalURL, description} = response
        const data = {
            name,
            document1,
            document1image,
            document1Link,
            document2,
            externalURL,
            images,
            description,
            isOwner: owner.toLowerCase() === client.account.toLowerCase(),
            owner,
            isApproved,
            signerIsSeller,
            priceUsd, 
            priceGas
        }
        console.log(data)
        setAbtInfo(data)
        setIsLoading(false)
    } catch(err) {
        console.error('Error fetching abt details:', err);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchABTDetails()
    } 
  }
  useEffect(() => {
    fetchABTDetails();
  }, []);
  
  const handleApproval = async () => {
    try {
        setLoadingFunction(true)
        await abt.approve(market.target, id)
        const approvedAddress = await abt.getApproved(id)
        console.log(approvedAddress === market.target)

        // Update isApproved to true
        setAbtInfo(prevAbtInfo => ({
        ...prevAbtInfo,
        isApproved: true,
        }));
        setLoadingFunction(false)
    } catch(err) {
        console.error('Error approving:', err);
    } 
  }

  const handleSale = async (e) => {
    e.preventDefault();
    const pennyAmount = parseInt(parseFloat(price) * 100)
    try {
        setLoadingFunction(true)
        await market.createListing(abt.target, id, pennyAmount);
        const response = await market.readListing(abt.target, id);
        const {seller, usdPennyPrice, rawValueGas} = response;
        if (response) {
            setAbtInfo((prevAbtInfo) => ({
                ...prevAbtInfo,
                signerIsSeller: seller === client.signer.address,
                priceUsd: (parseInt(usdPennyPrice) / 100).toFixed(2),
                priceGas: (parseInt(rawValueGas) / 10 ** 18).toFixed(18),
            }));
        }
    } catch (err) {
        console.error('Error putting for sale:', err);
    } finally {
        setLoadingFunction(false);
    }
};


  const handlePriceInput = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setPrice(value);
    }
  };

  if (isLoading) {
    return (
        <>
            <PageHeader title={'ABT Details'} />
            <div className='w-full h-full grid place-content-center p-5'>
                <Loader />
            </div>
        </>
    )
  }


  return (
    <>
        <PageHeader title={'ABT Details'} />
        <div className='w-full p-5 lg:p-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 2xl:gap-x-16 justify-items-stretch'>
            <div className="w-full pb-2 lg:col-span-2">
                <h1 className="text-2xl xl:text-3xl font-semibold">{abtInfo.name}</h1>
            </div>
            <ImageCarousel imgs={abtInfo.images} />
            <div>
                <Accordian owner={abtInfo.owner.slice(0, 5) + '...' + abtInfo.owner.slice(38, 42)} description={abtInfo.description} details={abtInfo.details} link={abtInfo.document1Link} />
                {abtInfo.isOwner ? (
                    abtInfo.signerIsSeller ? (
                        <div className='w-full flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-4'>
                            <div className='flex flex-col gap-1 justify-center items-center p-4 lg:p-6 shadow-lg w-max rounded-lg'>
                                <p className='text-gray-700 text-md lg:text-lg font-bold'>{abtInfo.priceGas}</p>
                                <p className='text-gray-700 text-sm xl:text-md font-medium leading-3'>Gas</p>
                            </div>
                            <div className='flex flex-col gap-1 justify-center items-center p-4 lg:p-6 shadow-lg w-max rounded-lg'>
                                <p className='text-gray-700 text-md lg:text-lg font-bold'>$ {abtInfo.priceUsd}</p>
                                <p className='text-gray-700 text-sm xl:text-md font-medium leading-3'>Price</p>
                            </div>
                        </div>
                    ) : (
                    abtInfo.isApproved ? (
                        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 lg:p-8">
                        <form className="space-y-4" onSubmit={handleSale}>
                            <div>
                            <label htmlFor="price" className="text-sm xl:text-md font-semibold gap-1 text-gray-700 flex justify-start items-center">
                                <p>Price $</p>
                                <input
                                    value={price}
                                    onChange={handlePriceInput}
                                    className="flex-1 px-1 py-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    type="text"
                                    id="price"
                                    name="price"
                                    required
                                />
                            </label>
                            </div>
                            <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full bg-primary1 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded transition duration-300 ease-in-out"
                            >
                                {loadingFunction ? <LoaderTwo /> : 'Put for Sale'}
                            </button>
                            </div>
                        </form>
                        </div>
                    ) : (
                        <div
                        onClick={handleApproval}
                        className="w-full cursor-pointer bg-primary1 hover:bg-indigo-700 text-white font-semibold border-slate-400 border-[1px] p-3 lg:p-4 rounded flex justify-center items-center"
                        >
                        {loadingFunction ? <LoaderTwo /> : 'Approve for Market'}
                        </div>
                    )
                    )
                ) : abtInfo.priceUsd >= 0 ? (
                    <div className="w-full bg-white flex flex-col justify-between items-center gap-3">
                        <div className='w-full flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-4'>
                            <div className='flex flex-col gap-1 justify-center items-center p-4 lg:p-6 shadow-lg w-max rounded-lg'>
                                <p className='text-gray-700 text-md lg:text-lg font-bold'>{abtInfo.priceGas}</p>
                                <p className='text-gray-700 text-sm xl:text-md font-medium leading-3'>Gas</p>
                            </div>
                            <div className='flex flex-col gap-1 justify-center items-center p-4 lg:p-6 shadow-lg w-max rounded-lg'>
                                <p className='text-gray-700 text-md lg:text-lg font-bold'>$ {abtInfo.priceUsd}</p>
                                <p className='text-gray-700 text-sm xl:text-md font-medium leading-3'>Price</p>
                            </div>
                        </div>
                        <button
                            className="flex-1 w-full sm:max-w-96 lg:max-w-full bg-accent3 text-white font-semibold py-3 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Make Offer
                        </button>
                    </div>
                ) : (
                    <div className='w-full sm:max-w-96 lg:max-w-full text-white font-semibold bg-accent3  p-3 lg:p-4 rounded grid place-content-center'>
                        Not Currently Listed
                    </div>
                )}
            </div>
        </div>
        
    </>
  );
};

export default ABTDetails;


 // listing = await market.readListing(abt.target, id)
        // console.log(listing)
    // const approved = await abt.getApproved(id)
    // console.log(approved === market.target)
    // const holder = await abt.ownerOf(id)
    // console.log(holder===client.signer.address)
    // const listing = await market.readListing(abt.target, id)
    // console.log(listing)
    // const tx = await market.createListing(abt.target, id, pennyAmount)
    // console.log(tx)