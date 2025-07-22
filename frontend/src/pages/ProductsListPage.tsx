import { useCallback, useEffect, useState } from "react";
import { List, Button, Modal, Select, message, Avatar } from "antd";
import { ProductModal } from "../components/modals/ProductModal";
import { Link } from "react-router";
import type { Product } from "../types/product";
import { productsApi } from "../api";
import { ROUTES } from "../constants/routes";

const { Option } = Select;

export const ProductsListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "count" | "default">("default");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [sortBy]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productsApi.getProducts(
        sortBy === "default" ? undefined : sortBy
      );
      setProducts(data);
    } catch (err) {
      message.error("Failed to load products");
    }
  }, [sortBy]);

  const onAddConfirm = async (data: Omit<Product, "id" | "comments">) => {
    try {
      await productsApi.createProduct(data);
      message.success("Product added");
      setAddModalVisible(false);
      loadProducts();
    } catch (err) {
      message.error("Failed to add product");
    }
  };

  const onDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productsApi.deleteProduct(productToDelete.id);
      message.success("Product deleted");
      setDeleteModalVisible(false);
      setProductToDelete(null);
      loadProducts();
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Select
          value={sortBy}
          onChange={(val) => setSortBy(val)}
          style={{ width: 150 }}
        >
          <Option value="default">Default sorting</Option>
          <Option value="name">Sort by Name</Option>
          <Option value="count">Sort by Count</Option>
        </Select>

        <Button type="primary" onClick={() => setAddModalVisible(true)}>
          Add Product
        </Button>
      </div>

      <List
        bordered
        dataSource={products}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link to={ROUTES.PRODUCT_DETAILS(item.id)}>
                <Button type="default">View</Button>
              </Link>,
              <Button
                danger
                onClick={() => {
                  setProductToDelete(item);
                  setDeleteModalVisible(true);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={60}
                  src={item.imageUrl}
                  alt={item.name}
                >
                  {item.name[0]}
                </Avatar>
              }
              title={item.name}
              description={`Count: ${item.count}, Weight: ${item.weight}`}
            />
          </List.Item>
        )}
      />

      <ProductModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onConfirm={onAddConfirm}
      />

      <Modal
        open={deleteModalVisible}
        title="Confirm Delete"
        onOk={onDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete "{productToDelete?.name}"?</p>
      </Modal>
    </>
  );
};
