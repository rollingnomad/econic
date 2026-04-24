import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeSiteId, setActiveSiteId] = useState(
    localStorage.getItem("activeSiteId")
      ? Number(localStorage.getItem("activeSiteId"))
      : null,
  );
  const [activeCommunityId, setActiveCommunityId] = useState(
    localStorage.getItem("activeCommunityId")
      ? Number(localStorage.getItem("activeCommunityId"))
      : null,
  );

  const setSite = (id) => {
    setActiveSiteId(id);
    if (id) localStorage.setItem("activeCommunityId", id);
    else localStorage.removeItem("activeCommunityId");
  };

  const setCommunity = (id) => {
    setActiveCommunityId(id);
    if (id) localStorage.setItem("activeCommunityId", id);
    else localStorage.removeItem("activeCommunityId");
  };

  return (
    <AppContext.Provider
      value={{ activeSiteId, setSite, activeCommunityId, setCommunity }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
