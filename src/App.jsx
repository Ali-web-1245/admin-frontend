import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Products from "./pages/products/Products.jsx";
import Orders from "./pages/orders/Orders.jsx";
import Data from "./pages/data/Data.jsx";
import Users from "./pages/users/Users.jsx";
import Customers from "./pages/customers/Customers.jsx";
import Crm from "./pages/crm/Crm.jsx";
import Blog from "./pages/blog/Blog.jsx";
import Invoice from "./pages/invoice/Invoice.jsx";
import Charts from "./pages/charts/Charts.jsx";
import Statistics from "./pages/statistics/Statistics.jsx";
import Login from "./pages/login/Login.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Login — Layout ke bahar, Sidebar/Navbar nahi dikhega */}
      <Route path="/login" element={<Login />} />

      {/* Sab protected routes Layout ke andar */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/data" element={<Data />} />
        <Route path="/users" element={<Users />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/crm" element={<Crm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Not Found"
              note="Yeh route exist nahi karta."
            />
          }
        />
      </Route>
    </Routes>
  );
}
