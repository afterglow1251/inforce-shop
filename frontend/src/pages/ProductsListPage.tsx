import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchProducts,
  deleteProduct,
  addProduct,
  setSortBy,
} from "../store/productsSlice";
import { List, Button, Select, Modal, message, Avatar } from "antd";
import { Link } from "react-router";
import { ROUTES } from "../constants/routes";
import { ProductModal } from "../components/modals/ProductModal";
import type { Product } from "../types/product";

const { Option } = Select;

export const ProductsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, sortBy } = useSelector(
    (state: RootState) => state.products
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts(sortBy));
  }, [dispatch, sortBy]);

  const onAddConfirm = async (data: Omit<Product, "id" | "comments">) => {
    try {
      await dispatch(addProduct(data)).unwrap();
      message.success("Product added");
      setAddModalVisible(false);
      dispatch(fetchProducts(sortBy));
    } catch {
      message.error("Failed to add product");
    }
  };

  const onDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      message.success("Product deleted");
      setDeleteModalVisible(false);
      setProductToDelete(null);
      dispatch(fetchProducts(sortBy));
    } catch {
      message.error("Failed to delete product");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Select
          value={sortBy}
          onChange={(val) => dispatch(setSortBy(val))}
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
        loading={status === "loading"}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link to={ROUTES.PRODUCT_DETAILS(item.id)} key="view">
                <Button type="default">View</Button>
              </Link>,
              <Button
                danger
                onClick={() => {
                  setProductToDelete(item);
                  setDeleteModalVisible(true);
                }}
                key="delete"
              >
                Delete
              </Button>,
            ]}
            key={item.id}
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
