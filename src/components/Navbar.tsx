import { RouteEnum } from "../enums/route.enum.ts";
import { RootState } from "../stores/index.store.ts";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import useDebounce from "../hooks/useDebounce.tsx";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { searchUserApi } from "../apis/core/search/search-user.api.ts";
import { getInitialProfileImageSrc } from "../helpers/initial-profile-image.ts";

const Navbar = () => {
  const authenticated = useSelector((state: RootState) => state.auth);
  const [cookies] = useCookies(["refreshToken"]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchValue, 500);
  const searchUserMutation = useMutation({
    mutationFn: searchUserApi,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (!debouncedValue) return;

    searchUserMutation.mutate([
      authenticated.token,
      { username: debouncedValue },
    ]);
  }, [debouncedValue]);

  const renderSearchBar = () => {
    if (searchValue && searchValue.length > 0) {
      return (
        <>
          {searchUserMutation.isPending ? (
            <ul
              tabIndex={0}
              className="dropdown-content dropdown-open menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              <li className="inline-flex w-full justify-center items-center">
                <span className="loading loading-spinner loading-xs"></span>
              </li>
            </ul>
          ) : searchUserMutation.isSuccess ? (
            <ul
              tabIndex={0}
              className="dropdown-content dropdown-open menu p-2 shadow bg-base-100 rounded-box w-full"
            >
              {searchUserMutation.data?.users.length === 0 ? (
                <span className="w-full cursor-default inline-flex justify-center items-center py-2">
                  No user found
                </span>
              ) : (
                searchUserMutation.data?.users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <a
                      href={`${RouteEnum.PROFILE}/${user.username}`}
                      className="w-full inline-flex flex-row items-center"
                    >
                      <div className="w-8 h-8">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            className="w-full h-full object-contain rounded-full"
                            alt="Profile picture"
                          />
                        ) : (
                          <div className="avatar placeholder w-full h-full">
                            <div className="bg-blue-600 text-white rounded-full">
                              <span className="text-xs">
                                {getInitialProfileImageSrc(
                                  user?.name ? user.name : ""
                                )?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="inline-flex flex-col">
                        <span className="font-bold">{user.name}</span>
                        <span className="text-xs">{user.username}</span>
                      </div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </>
      );
    }
    return null;
  };
  return (
    <nav className="navbar bg-primary text-primary-content h-20">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href={RouteEnum.INDEX}>
          Tanya!
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          {authenticated.user || cookies.refreshToken ? (
            <>
              <div className="dropdown text-base-content">
                <label className="input input-bordered flex items-center gap-2">
                  <PiMagnifyingGlassBold />
                  <input
                    type="search"
                    tabIndex={0}
                    className="grow"
                    placeholder="Find user..."
                    onChange={handleSearch}
                  />
                </label>
                {renderSearchBar()}
              </div>
            </>
          ) : (
            <>
              <li>
                <a
                  className="btn text-primary rounded-full"
                  href={RouteEnum.LOGIN}
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  className="btn btn-primary border-white rounded-full hover:border-gray-300"
                  href={RouteEnum.REGISTER}
                >
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
