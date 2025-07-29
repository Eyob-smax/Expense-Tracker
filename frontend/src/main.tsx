import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import DailyAnalytics from "./pages/DailyAnalytics";
const App = React.lazy(() => import("./App"));
const UserForm = React.lazy(() => import("./pages/UserForm"));
const Settings = React.lazy(() => import("./pages/Settings"));
const WeeklyAnalytics = React.lazy(() => import("./pages/WeeklyAnalytics"));
const MonthlyAnalytics = React.lazy(() => import("./pages/MonthlyAnalytics"));
const ExpenseOverview = React.lazy(() => import("./pages/ExpenseOverview"));
const AddExpense = React.lazy(() => import("./pages/AddExpense"));
const ExpenseDetail = React.lazy(() => import("./pages/ExpenseDetail"));
const Categories = React.lazy(() => import("./pages/Categories"));
const AddCategories = React.lazy(() => import("./pages/AddCategories"));
const About = React.lazy(() => import("./pages/About"));
const LoadingScreen = React.lazy(() => import("./pages/LoadingScreen"));
const ExpenseLists = React.lazy(() => import("./pages/ExpenseLists"));
const AnalyticsOverview = React.lazy(() => import("./pages/AnalyticsOverview"));

const Home = React.lazy(() => import("./pages/Home"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/void",
    element: <App />,
  },
  {
    path: "/login",
    element: <UserForm type="login" />,
  },
  {
    path: "/signup",
    element: <UserForm type="signup" />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/analytics",
    element: <AnalyticsOverview />,
    children: [
      {
        path: "daily",
        element: <DailyAnalytics />,
      },
      {
        path: "weekly",
        element: <WeeklyAnalytics />,
      },
      {
        path: "monthly",
        element: <MonthlyAnalytics />,
      },
    ],
  },
  {
    path: "/overview",
    element: <ExpenseOverview />,
  },
  {
    path: "/expenses",
    element: <ExpenseLists />,
  },
  {
    path: "/expenses/:id",
    element: <ExpenseDetail />,
  },
  {
    path: "/expenses/new",
    element: <AddExpense />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/categories/new",
    element: <AddCategories />,
  },
  {
    path: "/categories/:id",
    element: <Categories />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
