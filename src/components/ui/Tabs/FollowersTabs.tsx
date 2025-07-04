"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import Image from "next/image";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";

export interface User {
  id: number;
  name: string;
  profile_photo_path: string;
  isFollowed: boolean;
  isCurrentUser: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FollowersTabsProps {
  followers: User[];
  following: User[];
  followerPagination: Pagination;
  followingPagination: Pagination;
  fetchFollowers: (page: string, limit: string) => Promise<void>;
  fetchFollowings: (page: string, limit: string) => Promise<void>;
}

export default function FollowersTabs({ followers, following, followerPagination, followingPagination, fetchFollowers, fetchFollowings }: FollowersTabsProps) {
  const [activeTab, setActiveTab] = useState("tab1");
  const token = useSelector((state: RootState) => state.auth.token);
  const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  const renderFollowerPageNumbers = () => {
    return Array.from({ length: followerPagination.totalPages }, (_, i) => {
      const pageNum = i + 1;
      const isEdge = pageNum === 1 || pageNum === followerPagination.totalPages;
      const isNear = Math.abs(followerPagination.page - pageNum) <= 1;

      if (followerPagination.totalPages > 5 && !isEdge && !isNear) {
        if (pageNum === followerPagination.page - 2 || pageNum === followerPagination.page + 2) {
          return <li key={`dots-follower-${pageNum}`}><a>...</a></li>;
        }
        return null;
      }

      return (
        <li key={`followers-${pageNum}`} className={followerPagination.page === pageNum ? "active" : ""}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              fetchFollowers(String(pageNum), String(followerPagination.limit));
            }}
          >
            {pageNum}
          </a>
        </li>
      );
    });
  };
  const renderFollowingPageNumbers = () => {
    return Array.from({ length: followingPagination.totalPages }, (_, i) => {
      const pageNum = i + 1;
      const isEdge = pageNum === 1 || pageNum === followingPagination.totalPages;
      const isNear = Math.abs(followingPagination.page - pageNum) <= 1;

      if (followingPagination.totalPages > 5 && !isEdge && !isNear) {
        if (pageNum === followingPagination.page - 2 || pageNum === followingPagination.page + 2) {
          return <li key={`dots-following-${pageNum}`}><a>...</a></li>;
        }
        return null;
      }

      return (
        <li key={`followings-${pageNum}`} className={followingPagination.page === pageNum ? "active" : ""}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              fetchFollowings(String(pageNum), String(followingPagination.limit));
            }}
          >
            {pageNum}
          </a>
        </li>
      );
    });
  };

  const handleFollow = async (followingId: number) => {
    try {
      const response = await axios.post(`${ApiUrl}/follower/follow-user`, {
        followingId: followingId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.status === 200) {
        fetchFollowers(String(followerPagination.page), String(followerPagination.limit));
        fetchFollowings(String(followingPagination.page), String(followingPagination.limit));
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
        if (followerPagination.limit - 1 <= 0) {
          fetchFollowers(String(followerPagination.page - 1), String(followerPagination.limit));
        } else {
          fetchFollowers(String(followerPagination.page), String(followerPagination.limit));
        }
        if (followingPagination.limit - 1 <= 0) {
          fetchFollowings(String(followingPagination.page - 1), String(followingPagination.limit));
        } else {
          fetchFollowings(String(followingPagination.page), String(followingPagination.limit));
        }
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto prof_tabs">
      {/* Tabs Navigation */}
      <div className="flex border-b tabs_head">
        {["Followers", "Following"].map(
          (label, index) => {
            const tabKey = `tab${index + 1}`;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={` nav_btn ${activeTab === tabKey ? "active_tab" : "not_active"
                  }`}
              >
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* Tabs Content */}
      <div className="prof_tab_Cont ">
        {activeTab === "tab1" && (
          <div className="cont">
            <div className="holder_box">
              <ul className="follower_lst">
                {followers.length > 0 ? (
                  followers.map((user) => (
                    <li key={`follower-${user.id}`}>
                      <div>
                        <Image
                            loader={ipfsLoader}
                            alt={user.name}
                            width={47}
                            height={47}
                            src={
                              user.profile_photo_path?.startsWith("http")
                                  ? user.profile_photo_path
                                  : `https://${user.profile_photo_path || "memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu"}`
                            }
                        />
                        <span>{user.name}</span>
                      </div>
                        {!user.isCurrentUser && token && (
                        user.isFollowed ? (
                          <button className="unfollow_btn" onClick={() => handleUnFollow(user.id)}>Unfollow</button>
                        ) : (
                          <button className="follow_btn" onClick={() => handleFollow(user.id)}>Follow</button>
                        )
                      )}
                    </li>
                  ))
                ) : (
                  <p>No followers found.</p>
                )}
              </ul>
              <nav>
                <ul className="pagination justify-content-center">
                  {/* Previous */}
                  {followerPagination.page > 1 && (
                    <li className="page-item">
                      <a href="#" className="back page-link" onClick={(e) => {
                        e.preventDefault();
                        fetchFollowers(String(followerPagination.page - 1), String(followerPagination.limit));
                      }}>
                        <i className="fa-solid fa-angles-left"></i>
                      </a>
                    </li>
                  )}

                  {/* Page Numbers */}
                  {renderFollowerPageNumbers()}

                  {/* Next */}
                  {followerPagination.page < followerPagination.totalPages && (
                    <li className="page-item">
                      <a href="#" className="next page-link" onClick={(e) => {
                        e.preventDefault();
                        fetchFollowers(String(followerPagination.page + 1), String(followerPagination.limit));
                      }}>
                        <i className="fa-solid fa-angles-right"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="cont">
            <div className="holder_box">
              <ul className="follower_lst">
                {following.length > 0 ? (
                  following.map((user) => (
                    <li key={`following-${user.id}`}>
                      <Image
                        loader={ipfsLoader}
                        alt={user.name}
                        width={47}
                        height={47}
                        src={
                          user.profile_photo_path?.startsWith("http")
                            ? user.profile_photo_path
                            : `https://${user.profile_photo_path || "memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu"}`
                        }
                      />
                      <span>{user.name}</span>
                      {!user.isCurrentUser && token && (
                        user.isFollowed ? (
                          <button className="unfollow_btn" onClick={() => handleUnFollow(user.id)}>Unfollow</button>
                        ) : (
                          <button className="follow_btn" onClick={() => handleFollow(user.id)}>Follow</button>
                        )
                      )}
                    </li>
                  ))
                ) : (
                  followingPagination.page > 0 ? null : <p>Not following anyone.</p>
                )}
              </ul>
              <nav>
                <ul className="pagination justify-content-center">
                  {/* Previous */}
                  {followingPagination.page > 1 && (
                    <li className="page-item">
                      <a href="#" className="back page-link" onClick={(e) => {
                        e.preventDefault();
                        fetchFollowings(String(followingPagination.page - 1), String(followingPagination.limit));
                      }}>
                        <i className="fa-solid fa-angles-left"></i>
                      </a>
                    </li>
                  )}

                  {/* Page Numbers */}
                  {renderFollowingPageNumbers()}

                  {/* Next */}
                  {followingPagination.page < followingPagination.totalPages && (
                    <li className="page-item">
                      <a href="#" className="next page-link" onClick={(e) => {
                        e.preventDefault();
                        fetchFollowings(String(followingPagination.page + 1), String(followingPagination.limit));
                      }}>
                        <i className="fa-solid fa-angles-right"></i>
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
