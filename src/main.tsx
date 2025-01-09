import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux";
import store from "./stores/index.store.ts";
import {ToastContainer} from "react-toastify";
import {CookiesProvider} from "react-cookie";

const queryClient = new QueryClient();
const strictMode: boolean = true;
const components = (
  <CookiesProvider
    defaultSetOptions={{
      path: "/",
    }}
  >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer position="bottom-right" />
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </Provider>
  </CookiesProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  strictMode ? (
    <React.StrictMode>{components}</React.StrictMode>
  ) : (
    <>{components}</>
  )
);
