import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Notes from "@/pages/Notes";
import { ThemeProvider } from "./hooks/useLocalStorage";

function Router() {
  return React.createElement(
    Switch,
    null,
    React.createElement(Route, { path: "/", component: Home }),
    React.createElement(Route, { path: "/notes", component: Notes }),
    React.createElement(Route, { path: "/notes/:notebookId", component: Notes }),
    React.createElement(Route, { path: "/tags/:tagId", component: Notes }),
    React.createElement(Route, { path: "/search", component: Notes }),
    React.createElement(Route, { component: NotFound })
  );
}

function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      ThemeProvider,
      null,
      React.createElement(Router),
      React.createElement(Toaster)
    )
  );
}

export default App;
