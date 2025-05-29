import React, { useState } from "react";
import { Table, Form, Input, Modal } from "antd";
import {
    useGetAllContactQuery,
} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import "./index.scss";

const ContactTable = () => {
    const { data: getAllContact, refetch: getAllContactRefetch, isLoading } = useGetAllContactQuery();
    const [form] = Form.useForm();
    const dataSource = getAllContact?.data;

    // State for editing
    const [editingKey, setEditingKey] = useState(null);

    // State for modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    // Check if a row is being edited
    const isEditing = (record) => record.id === editingKey;

    // Start editing a row
    const edit = (record) => {
        form.setFieldsValue({
            name: record.name,
            surname: record.surname,
            email: record.email,
            phoneNumber: record.phoneNumber,
            description: record.description,
        });
        setEditingKey(record.id);
    };

    // Cancel editing
    const cancel = () => {
        setEditingKey(null);
        form.resetFields();
    };

    // Handle showing modal with full description
    const showDescriptionModal = (description) => {
        setModalContent(description || "No description available");
        setIsModalVisible(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalVisible(false);
        setModalContent("");
    };

    // Table columns
    const columns = [
        {
            title: "№",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Ad",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Ad daxil edin" }]}
                        >
                            <Input />
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Soyad",
            dataIndex: "surname",
            key: "surname",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item
                            name="surname"
                            rules={[{ required: true, message: "Soyad daxil edin" }]}
                        >
                            <Input />
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Email daxil edin" },
                                { type: "email", message: "Düzgün email formatı daxil edin" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Nömrə",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: "Nömrə daxil edin" }]}
                        >
                            <Input />
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Qeyd",
            dataIndex: "description",
            key: "description",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="description">
                            <Input.TextArea />
                        </Form.Item>
                    );
                }
                const truncatedText = text && text.length > 20 ? `${text.slice(0, 20)}...` : text || "";
                return (
                    <span
                        style={{ cursor: text ? "pointer" : "default", color: text ? "#1890ff" : "inherit" }}
                        onClick={() => text && showDescriptionModal(text)}
                    >
                        {truncatedText}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="services-table-container-contact">
            <Form form={form} component={false}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={dataSource}
                    loading={isLoading}
                    pagination={{
                        pageSize: 9,
                        className: "custom-pagination",
                    }}
                    className="custom-table"
                />
            </Form>
            <Modal
                title="Tam Qeyd"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <button
                        key="close"
                        className="ant-btn ant-btn-default"
                        onClick={handleModalClose}
                        style={{
                            backgroundColor:"green",
                            padding:"4px 8px",
                            color:"white",
                            border:"none",
                            borderRadius:"5px",
                            cursor:"pointer",
                        }}
                    >
                        Bağla
                    </button>,
                ]}
            >
                <p>{modalContent}</p>
            </Modal>
        </div>
    );
};

export default ContactTable;