"use client"

import Abouttograduate from "@/components/proflielist/abouttograduate";
import Featured from "@/components/proflielist/featured";
import Newlycreated from "@/components/proflielist/newlycreated"
import Watchlist from "@/components/proflielist/watchlist";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum"
import Image from "next/image";
import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {CoinAttributes, UserWishlistAttributes} from "@/utils/Interfaces/CoinInterfaces";
import axios from "axios";


export default function Advanced() {
    const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
    const AuthToken:string | null = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const [wishlistData, setWishlistData] = useState<UserWishlistAttributes[]>([])
    const [NewlyCreatedData, setNewlyCreatedData] = useState<CoinAttributes[]>([])

    const [error, setError] = useState<Error | null>(null);
    const [Loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('0.01');


   useEffect(() => {
       if (!isAuthenticated || !ApiUrl || !AuthToken) return;
       const GetWishlist = async ()=>{
            setLoading(true);
            try {
                const response = await axios.get(`${ApiUrl}/wishlist/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${AuthToken}`
                    }
                });
                setWishlistData(response.data.data);
            }catch (err) {
                setError(err as Error);
                setWishlistData([]);
            }finally {
                setLoading(false);
            }
        }

       GetWishlist();
   },[ApiUrl, isAuthenticated, AuthToken]);

    useEffect(() => {
        if (!ApiUrl) return;

        const GetNewlyCreated = async ()=>{
            setLoading(true);
            try {
                const response = await axios.get(`${ApiUrl}/advancecoin/newly-created-coins`);
                setNewlyCreatedData(response.data.data);
            }catch (err) {
                setError(err as Error);
                setNewlyCreatedData([]);
            }finally {
                setLoading(false);
            }
        }

        GetNewlyCreated();
    }, [ApiUrl, error]);


  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrum title="Advanced" />

      {/* Section for Advanced content */}
      <section className="advance_sec">
        <div className="container">
          <div className="row quick_buy">
            <div className="border_box d-flex">
            <span>
              Quick Buy
            </span>
            <Image src={"/assets/img/zig.png"} alt="" width={50} height={50} />
            <input 
            name="quick_buy_input"
             type="number"   
             value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              {/* Displaying the Newlycreated component */}
              <Newlycreated isAuthenticated={isAuthenticated} AuthToken={AuthToken || undefined} ApiUrl={ApiUrl} newlyCreatedData={NewlyCreatedData} inputValue={inputValue}  />
            </div>
            <div className="col-md-3">
              {/* Displaying the Newlycreated component */}
              <Abouttograduate  inputValue={inputValue} />
            </div>
            <div className="col-md-3">
              {/* Displaying the Newlycreated component */}
              <Featured  inputValue={inputValue} />
            </div>
            <div className="col-md-3">
              {/* Displaying the Newlycreated component */}
              <Watchlist isLoading={Loading} wishlistData={wishlistData}  inputValue={inputValue} ApiUrl={ApiUrl} AuthToken={AuthToken || undefined} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
