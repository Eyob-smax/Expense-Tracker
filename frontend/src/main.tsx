import React, { StrictMode, Suspense } from "react";
import { createRoot, Root } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Wrapper from "./pages/Wrapper";
import LoadingScreen from "./pages/LoadingScreen";
import {
  formAction,
  editExpenseAction,
  addExpenseAction,
  addCategoryAction,
} from "./dataApi/actions/actions";
import expenseLoader, { categoryLoader } from "./dataApi/loaders/loader";
import DailyAnalytics from "./pages/DailyAnalytics";
import CategoriesDetail from "./pages/CategoriesDetail";
import PasswordRecovery from "./pages/PasswordRecovery";
import UpdatePassword from "./pages/UpdatePassword";

// lazy imports...
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
const ExpenseLists = React.lazy(() => import("./pages/ExpenseLists"));
const AnalyticsOverview = React.lazy(() => import("./pages/AnalyticsOverview"));
const Home = React.lazy(() => import("./pages/Home"));

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/void", element: <App /> },
  { path: "/login", element: <UserForm type="login" />, action: formAction },
  { path: "/signup", element: <UserForm type="signup" />, action: formAction },
  { path: "/settings", element: <Settings /> },
  {
    path: "/analytics",
    element: <AnalyticsOverview />,
    children: [
      { path: "daily", element: <DailyAnalytics />, index: true },
      { path: "weekly", element: <WeeklyAnalytics /> },
      { path: "monthly", element: <MonthlyAnalytics /> },
    ],
  },
  { path: "/overview", element: <ExpenseOverview />, loader: expenseLoader },
  { path: "/expenses", element: <ExpenseLists /> },
  {
    path: "/expenses/:id",
    element: <ExpenseDetail />,
    action: editExpenseAction,
  },
  { path: "/expenses/new", element: <AddExpense />, action: addExpenseAction },
  { path: "/categories", element: <Categories />, loader: categoryLoader },
  {
    path: "/categories/new",
    element: <AddCategories />,
    action: addCategoryAction,
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/categories/:id",
    element: <CategoriesDetail />,
    action: editExpenseAction,
  },
  { path: "/about", element: <About /> },
]);

const container = document.getElementById("root")!;

// 🔹 Keep the root across HMR reloads
let root: Root;
if (!("__reactRoot" in window)) {
  // @ts-ignore
  window.__reactRoot = createRoot(container);
}
// @ts-ignore
root = window.__reactRoot;

root.render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<LoadingScreen />}>
        <Wrapper>
          <RouterProvider router={router} />
        </Wrapper>
      </Suspense>
    </Provider>
  </StrictMode>
);
