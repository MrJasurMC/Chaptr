import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import categoriesReducer from "./categoriesSlice";
import pagesReducer from "./pagesSlice";
import reviewsReducer from "./reviewsSlice";
import favoritesReducer from "./favoritesSlice";
import recentlyViewedReducer from "./recentlyViewedSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    categories: categoriesReducer,
    pages: pagesReducer,
    reviews: reviewsReducer,
    favorites: favoritesReducer,
    recentlyViewed: recentlyViewedReducer
  }
});
