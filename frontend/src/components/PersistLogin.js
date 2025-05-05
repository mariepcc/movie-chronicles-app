import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/usePrivate";
import useRefreshToken from "../hooks/useRefreshToken";

export default function PersistLogin() {
  const refresh = useRefreshToken();
  const { accessToken, isLoggedIn, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function verifyUser() {
      if (!isLoggedIn) {
        navigate("/auth/login");
        isMounted && setLoading(false);
        return;
      }

      try {
        await refresh();
        const { data } = await axiosPrivate.get("auth/user");
        setUser(data);
      } catch (error) {
        console.log(error?.response);
      } finally {
        isMounted && setLoading(false);
      }
    }

    !accessToken ? verifyUser() : setLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return loading ? "Loading" : <Outlet />;
}
