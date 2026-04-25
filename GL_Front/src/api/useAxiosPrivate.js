import { useEffect } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

const useAxiosPrivate = () => {
  const { keycloak } = useKeycloak();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(async(config) => {
      if (!keycloak?.authenticated) return config;

      try {
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch (err) {
        console.error("Token refresh failed — logging out", err);
        keycloak.logout();
        return Promise.reject(err);
      }

      return config;
      }
    );

    return () => { axiosPrivate.interceptors.request.eject(requestIntercept); };
  }, [keycloak]);

  return axiosPrivate;
};


export default useAxiosPrivate;