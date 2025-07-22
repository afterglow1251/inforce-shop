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
import { productsApi } from "../api";
import type { Product } from "../types/product";
import type { Comment } from "../types/comment";
import { ProductModal } from "../components/modals/ProductModal";

const { TextArea } = Input;
const { Title } = Typography;

export const ProductViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await productsApi.getProductById(+id);
      setProduct(data);
      setComments(data.comments);
    } catch (e) {
      message.error("Failed to load product");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const onEditConfirm = async (data: Omit<Product, "id" | "comments">) => {
    if (!product) return;
    try {
      const updated = await productsApi.updateProduct(product.id, data);
      setProduct(updated);
      setEditModalVisible(false);
      message.success("Product updated");
    } catch {
      message.error("Failed to update product");
    }
  };

  const onAddComment = async () => {
    if (!product || !newComment.trim()) return;
    setAddingComment(true);
    try {
      const comment = await productsApi.addComment(product.id, {
        description: newComment.trim(),
        date: new Date().toISOString(),
      });
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      message.success("Comment added");
    } catch {
      message.error("Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const onDeleteComment = async (commentId: number) => {
    if (!product) return;
    try {
      await productsApi.deleteComment(product.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      message.success("Comment deleted");
    } catch {
      message.error("Failed to delete comment");
    }
  };

  if (loading || !product) {
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
          loading={addingComment}
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
