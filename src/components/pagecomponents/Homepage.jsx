import React, { useEffect, useState } from "react";
import Home from "@/components/homepage/Home";
import * as api from "@/api/apiRoutes";
import { setShop } from "@/redux/slices/shopSlice";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import Loader from "../loader/Loader";
import Layout from "../layout/Layout";
// import { resetSelectedCategories } from '@/redux/slices/productFilterSlice'
import { useRouter } from "next/router";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import HomeSkeleton from "../homepage/HomeSkeleton";


const Homepage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const setting = useSelector((state) => state.Setting.setting);
  const isRefetch = useSelector((state) => state.Shop.isRefetch);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const city = useSelector((state) => state.City.city);

  const defaultCity = setting?.default_city;
  const latitude = city?.latitude
    ? parseFloat(city.latitude)
    : defaultCity?.latitude
    ? parseFloat(defaultCity.latitude)
    : 23.242;
  const longitude = city?.longitude
    ? parseFloat(city.longitude)
    : defaultCity?.longitude
    ? parseFloat(defaultCity.longitude)
    : 69.6669;

  useEffect(() => {
    if (router?.pathname === "/") {
      dispatch(clearAllFilter());
    }
  }, []);

  const { isLoading, data, isFetching, refetch } = useQuery({
    queryKey: ["shopData", latitude, longitude, language?.id, isRefetch],
    queryFn: async () => {
      const response = await api.getShop({ latitude, longitude });
      dispatch(setShop({ data: response.data }));
      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (language?.id) {
      refetch();
    }
  }, [language?.id]);

  const showLoading = isLoading && !data;

  return (
    <div>
      <Layout>
        <Home shopData={data} isShopLoading={showLoading} />
      </Layout>
    </div>
  );
};

export default Homepage;
