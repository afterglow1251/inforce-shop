import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Space } from "antd";
import type { Product } from "../../types/product";

interface ProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: Omit<Product, "id" | "comments">) => void;
  initialData?: Omit<Product, "id" | "comments">;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialData) {
        form.setFieldsValue(initialData);
      }
    }
  }, [visible, initialData]);

  const onFinish = (values: any) => {
    onConfirm(values);
  };

  return (
    <Modal
      open={visible}
      title={initialData ? "Edit Product" : "Add Product"}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="count"
          label="Count"
          rules={[{ required: true, message: "Please input product count" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ required: true, message: "Please input image URL" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Weight"
          rules={[{ required: true, message: "Please input product weight" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Size" required>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name={["size", "width"]}
              rules={[{ required: true, message: "Width required" }]}
              noStyle
            >
              <InputNumber
                min={0}
                placeholder="Width"
                style={{ width: "50%" }}
              />
            </Form.Item>
            <Form.Item
              name={["size", "height"]}
              rules={[{ required: true, message: "Height required" }]}
              noStyle
            >
              <InputNumber
                min={0}
                placeholder="Height"
                style={{ width: "50%" }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Form>
    </Modal>
  );
};
