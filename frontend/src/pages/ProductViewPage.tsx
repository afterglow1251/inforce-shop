import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Button,
  List,
  Input,
  message,
  Typography,
  Divider,
  Space,
  Descriptions,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchProductById,
  updateProduct,
  addComment,
  deleteComment,
  clearProductState,
} from "../store/productSlice";
import { ProductModal } from "../components/modals/ProductModal";
import type { Product } from "../types/product";
import { ROUTES } from "../constants/routes";

const { TextArea } = Input;
const { Title } = Typography;

export const ProductViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { product, comments, status, commentsStatus, error } = useSelector(
    (state: RootState) => state.product
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }

    return () => {
      dispatch(clearProductState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error && status === "failed") {
      message.error(error);
      navigate(ROUTES.PRODUCTS);
    }
  }, [error, status, navigate]);

  const onEditConfirm = async (data: Omit<Product, "id" | "comments">) => {
    if (!product) return;
    try {
      await dispatch(updateProduct({ id: product.id, data })).unwrap();
      setEditModalVisible(false);
      message.success("Product updated");
    } catch {
      message.error("Failed to update product");
    }
  };

  const onAddComment = async () => {
    if (!product || !newComment.trim()) return;
    try {
      await dispatch(
        addComment({
          productId: product.id,
          description: newComment.trim(),
          date: new Date().toISOString(),
        })
      ).unwrap();
      setNewComment("");
      message.success("Comment added");
    } catch {
      message.error("Failed to add comment");
    }
  };

  const onDeleteComment = async (commentId: number) => {
    if (!product) return;
    try {
      await dispatch(
        deleteComment({
          productId: product.id,
          commentId,
        })
      ).unwrap();
      message.success("Comment deleted");
    } catch {
      message.error("Failed to delete comment");
    }
  };

  if (status === "loading" || !product) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      style={{ maxWidth: 800, margin: "auto" }}
      title={
        <Space
          style={{ width: "100%", justifyContent: "space-between" }}
          align="center"
        >
          <Title level={2} style={{ margin: 0 }}>
            {product.name}
          </Title>
          <Button type="primary" onClick={() => setEditModalVisible(true)}>
            Edit Product
          </Button>
        </Space>
      }
    >
      <div
        style={{
          width: "100%",
          height: 300,
          marginBottom: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>

      <Descriptions
        column={1}
        bordered
        size="small"
        style={{ marginBottom: 24 }}
        labelStyle={{ fontWeight: "bold", width: 100 }}
      >
        <Descriptions.Item label="Count">{product.count}</Descriptions.Item>
        <Descriptions.Item label="Weight">{product.weight}</Descriptions.Item>
        <Descriptions.Item label="Size">
          {product.size.width} x {product.size.height}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={4}>Comments</Title>

      <List
        bordered
        dataSource={comments}
        locale={{ emptyText: "No comments yet" }}
        style={{ marginBottom: 24 }}
        renderItem={(comment) => (
          <List.Item
            key={comment.id}
            actions={[
              <Button
                danger
                onClick={() => onDeleteComment(comment.id)}
                key="delete"
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={new Date(comment.date).toLocaleString()}
              description={comment.description}
            />
          </List.Item>
        )}
      />
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <TextArea
          rows={2}
          placeholder="Add new comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={500}
          showCount
          style={{ width: "100%" }}
        />
        <Button
          type="primary"
          onClick={onAddComment}
          loading={commentsStatus === "loading"}
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </Space>

      <ProductModal
        visible={editModalVisible}
        initialData={product}
        onCancel={() => setEditModalVisible(false)}
        onConfirm={onEditConfirm}
      />
    </Card>
  );
};
