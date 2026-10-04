import { createSlice } from "@reduxjs/toolkit";

const defaultCityFallback = {
    id: 1,
    name: "Bhuj",
    state: "Gujarat",
    formatted_address: "Bhuj, Gujarat, India",
    latitude: "23.2420",
    longitude: "69.6669"
};

const initialState = {
    status: "fulfill",
    city: defaultCityFallback,
};

export const locationReducer = createSlice({
    name: "city",
    initialState,
    reducers: {
        setCity: (state, action) => {
            state.status = "fulfill";
            state.city = action.payload.data || defaultCityFallback;
        }
    }
});

export const { setCity } = locationReducer.actions;
export default locationReducer.reducer;