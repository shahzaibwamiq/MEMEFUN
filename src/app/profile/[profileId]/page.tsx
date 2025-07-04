"use client";

import Breadcrum from "@/components/ui/breadcrum/Breadcrum";
import Coindetailfilter from "@/components/ui/Filters/coindetailfilter";
import Reportbutton from "@/components/ui/modals/ReportModal";
import Myprofiletabs from "@/components/ui/Tabs/Myprofiletabs";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import Loader from "@/components/ui/common/Loader";
import { usePopup } from "@/providers/PopupProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { useParams, notFound } from "next/navigation";
import { shortenAddress } from "@/utils/AddressShortner";
import FollowersTabs, { Pagination, User } from "@/components/ui/Tabs/FollowersTabs";
import UpdateProfileModal from "@/components/ui/modals/UpdateProfileModal";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import { Coin } from "@/components/ui/Tabs/Myprofiletabs";

export default function Profile() {
  const paginationLimit = "10";
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const Address = useSelector((state: RootState) => state.auth.Wallet);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [profile, setprofile] = useState({
    id: 0,
    email: "",
    name: "",
    description: "",
    address: "",
    short_description: "",
    website: "",
    twitter: "",
    telegram: "",
    profile_pic: "",
    emailVerified: false,
  });
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followerPagination, setFollowerPagination] = useState<Pagination>({
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0
  });
  const [followingPagination, setFollowingPagination] = useState<Pagination>({
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0
  });
  const [likeCount, setLikeCount] = useState('0');
  const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileFound, setProfileFound] = useState(true);
  const [coinCreated, setCoinCreated] = useState<Coin[]>([]);
  const { showPopup } = usePopup();
  const params = useParams<{ profileId: string }>();
  const profileId = params.profileId;



  const handleFavoriteClick = async (likedItemId: number, likedItemType: string) => {
    setIsFavorited(true);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset animation
    try {
      const response = await axios.post(`${ApiUrl}/likes/profile-like`, {
        likedItemId,
        likedItemType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response?.data.success) {
        const likedStatus = response.data.liked; // 'liked' or 'unliked'
        setIsFavorited(likedStatus === "liked" ? true : false);
        setLikeCount(response.data.likeCount);
      } else {
        console.warn(response?.data.message || "Failed to like/unlike.");
      }

    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Like/unlike failed:", e.message);
      } else {
        console.error("Like/unlike failed:", e);
      }
    }


  };
  const handleCopyAddress = async (address: string | undefined) => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  const fetchProfile = useCallback(async () => {

    try {
      setLoading(true);
      const response = await axios.get(`${ApiUrl}/user/user-profile/${profileId}/${Address?.address}`);
      if (response.status === 200) {
        setprofile(response.data.data);
        setProfileFound(true);
        if (response.data.isFavorited) {
          setIsFavorited(true);
        }
        if (response.data.isFollow) {
          setIsFollowed(true);
        }
        if (response.data.data.launchpad) {
          setCoinCreated(response.data.data.launchpad);
        }
        setLikeCount(response.data.likesCounts);
      }

    } catch (error) {
      let errorMsg = "Something went wrong";

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message;
        if (error.response?.status === 404) {
          setProfileFound(false);
          return;
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showPopup(errorMsg, 'error')
      setprofile({
        id: 0,
        email: "",
        name: "Unknown Profile",
        description: "",
        address: "",
        short_description: "",
        website: "",
        twitter: "",
        telegram: "",
        profile_pic: "",
        emailVerified: false,
      });
      setProfileFound(false);
    }
  }, [ApiUrl, profileId, Address?.address]);

  const fetchFollowers = useCallback(async (page: string, limit: string) => {
    try {
      const response = await axios.get(`${ApiUrl}/user/user-followers/${profileId}/?page=${page}&limit=${limit}&address=${Address?.address}`);

      if (response.status === 200) {
        setFollowers(response.data.data);
        setFollowerPagination(response.data.pagination);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setFollowers([]);
          setFollowerPagination({
            page: 0,
            limit: 0,
            total: 0,
            totalPages: 0
          });
        }
      } else {
        console.error("Error fetching followers:", error);
      }
    }
  }, [ApiUrl, profileId, Address?.address]);

  const fetchFollowing = useCallback(async (page: string, limit: string) => {
    try {
      const response = await axios.get(`${ApiUrl}/user/user-followings/${profileId}/?page=${page}&limit=${limit}&address=${Address?.address}`);
      if (response.status === 200) {
        setFollowing(response.data.data);
        setFollowingPagination(response.data.pagination);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setFollowing([]);
          setFollowingPagination({
            page: 0,
            limit: 0,
            total: 0,
            totalPages: 0
          });
        }
      } else {
        console.error("Error fetching following:", error);
      }
    }
  }, [ApiUrl, profileId, Address?.address]);

  const handleFollow = async (followingId: number) => {
    try {
      const response = await axios.post(`${ApiUrl}/follower/follow-user`, {
        followingId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.status === 200) {
        setIsFollowed(true);
        fetchFollowers(String(followerPagination.page), String(followerPagination.limit));
        fetchFollowing(String(followingPagination.page), String(followingPagination.limit));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnFollow = async (followingId: number) => {
    try {
      const response = await axios.post(`${ApiUrl}/follower/unfollow-user`, {
        followingId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.status === 200) {
        setIsFollowed(false);
        fetchFollowers(String(followerPagination.page), String(followerPagination.limit));
        fetchFollowing(String(followingPagination.page), String(followingPagination.limit));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    document.body.classList.add("dashboard");

    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchFollowers("1", paginationLimit),
          fetchFollowing("1", paginationLimit)
        ]);
      } catch (error) {
        console.error("Error loading profile page data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      document.body.classList.remove("dashboard");
    };
  }, [profileId, fetchProfile, fetchFollowers, fetchFollowing, paginationLimit]);

  if (!loading && !profileFound) {
    return notFound();
  }

  const imageSrc = profile?.profile_pic?.startsWith("http")
    ? profile?.profile_pic
    : `https://${profile?.profile_pic || "memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu"}`;

  return (
    <>
      {loading && <Loader name={'Loading Profile...'} fixed={true} />}
      <Breadcrum title="Profile" />
      <section className="my_prof_sec">
        <div className="container">
          <Coindetailfilter />
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 prof_det">
              <div className="border_box">
                <div className="prof_banner">
                  <Image
                    src={"/assets/img/prof_banner.png"}
                    alt="w"
                    width={1064}
                    height={281}
                    className="banner"
                  />

                  <div className="prof_details">
                    <div className="prof_img">
                      <div className="prof_upd">
                        {profile?.profile_pic ? (
                          <Image
                            loader={ipfsLoader}
                            src={imageSrc}
                            alt={profile?.name}
                            width={53}
                            height={53}
                          />
                        ) : (
                          <Image
                            src={"/assets/img/prof_img.png"}
                            alt=""
                            width={226}
                            height={226}
                          />
                        )}
                        {isAuthenticated && Address?.address === profile?.address && (
                          <UpdateProfileModal profileData={profile} ApiUrl={ApiUrl} token={token} onProfileUpdated={fetchProfile} />
                        )}

                      </div>
                      <div className="coin_social d-flex">
                        {isAuthenticated && Address?.address != profile?.address && (
                          <>
                            {isFollowed ? (
                              <button className={'follow_btn'} onClick={() => handleUnFollow(profile.id)}>Unfollow</button>
                            ) : (
                              <button className={'follow_btn'} onClick={() => handleFollow(profile.id)}>Follow</button>
                            )}
                            <button className={`heart_icon ${isClicked ? 'clicked' : ''}`} onClick={() => handleFavoriteClick(profile?.id, 'profile')}>
                              <FontAwesomeIcon icon={isFavorited ? solidStar : regularStar} />
                            </button>
                          </>
                        )}
                        <a href={profile?.website} target={'_blank'} rel="noopener noreferrer">
                          <i className="fa-regular fa-globe"></i>
                        </a>
                        <a href={profile?.telegram} target={'_blank'} rel="noopener noreferrer">
                          <i className="fa-brands fa-telegram"></i>
                        </a>
                        <a href={profile?.twitter} target={'_blank'} rel="noopener noreferrer">
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </div>
                    </div>
                    <div className="prof_title d-flex">
                      <h3>{profile?.name}</h3>
                      {isAuthenticated && Address?.address != profile?.address && (
                        <Reportbutton />
                      )}
                    </div>
                    <div className="prof_link">
                      {shortenAddress(profile?.address || profileId)}
                      <button
                        className="ml-2 cursor-pointer bg-transparent border-none outline-none"
                        onClick={() => handleCopyAddress(profile?.address || profileId)}
                      >
                        <span>
                          {(profile?.address || profileId) && !copied ? <FaRegCopy /> : <FaCheck />}
                        </span>
                      </button>
                    </div>
                    <p>
                      {profile?.short_description || "No Short Description Found!"}
                    </p>
                    <div className="prof_btns">
                      <button>
                        <span>0</span>Coin Held
                      </button>
                      <button>
                        <span>{coinCreated ? coinCreated.length : 0}</span> {coinCreated?.length === 1 ? 'Coin Created' : 'Coins Created'}
                      </button>
                      <button>
                        <span>{followerPagination.total}</span>Followers
                      </button>
                      <button>
                        <span>{followingPagination.total}</span>Following
                      </button>
                      <button>
                        <span>{likeCount}</span>Likes Received
                      </button>
                    </div>
                    <div className="prof_tabs">
                      <Myprofiletabs AboutData={profile?.description || ''} coinCreated={coinCreated} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 prof_follower">
              <div className="border_box">
                <FollowersTabs
                  followers={followers}
                  following={following}
                  followerPagination={followerPagination}
                  followingPagination={followingPagination}
                  fetchFollowers={fetchFollowers}
                  fetchFollowings={fetchFollowing}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

