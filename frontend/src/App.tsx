import { Routes, Route, Navigate } from "react-router";
import { Header } from "./components/layout/Header";
import { ProductsListPage } from "./pages/ProductsListPage";
import { ProductViewPage } from "./pages/ProductViewPage";
import { Layout } from "antd";
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <Layout>
      <Header />
      <Layout.Content style={{ padding: 24 }}>
        <Routes>
          <Route path={ROUTES.HOME} element={<ProductsListPage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsListPage />} />
          <Route
            path={`${ROUTES.PRODUCTS}/:id`}
            element={<ProductViewPage />}
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}

export default App;
