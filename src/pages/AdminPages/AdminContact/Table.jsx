import React, {useState} from "react";
import {Table, Button, Popconfirm, Form, Input} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {
    useDeleteServiceMutation,
    useGetAllServicesQuery,
    usePostServiceMutation,
    usePutServiceMutation,
} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import "./index.scss";

// Helper function to convert image URL to File object
const convertImageToFile = async (imgSrc, fileName) => {
    try {
        const res = await fetch(imgSrc);
        if (!res.ok) throw new Error("Failed to fetch image");
        const blob = await res.blob();
        return new File([blob], fileName, {type: blob.type});
    } catch (error) {
        throw new Error(`Image conversion failed: ${error.message}`);
    }
};

const ContactTable = () => {
    const {data: getAllServices, refetch: getAllServicesRefetch, isLoading} = useGetAllServicesQuery();
    const [deleteService] = useDeleteServiceMutation();
    const [putService] = usePutServiceMutation();
    const [form] = Form.useForm();
    const dataSource = [
        {
            title: "Service",
        },

        {
            title: "Service Name",
        }
    ];

    // State for editing
    const [editingKey, setEditingKey] = useState(null);

    // Check if a row is being edited
    const isEditing = (record) => record.id === editingKey;

    // Start editing a row
    const edit = (record) => {
        form.setFieldsValue({
            title: record.title,
            titleEng: record.titleEng,
            titleRu: record.titleRu,
            subTitle: record.subTitle,
            subTitleEng: record.subTitleEng,
            subTitleRu: record.subTitleRu,
            cardImage: record.cardImage,
        });
        setEditingKey(record.id);
    };

    // Cancel editing
    const cancel = () => {
        setEditingKey(null);
        form.resetFields();
    };

    // Save edited row
    const save = async (id) => {
        try {
            const row = await form.validateFields();
            const formData = new FormData();
            const textFields = ["title", "titleEng", "titleRu", "subTitle", "subTitleEng", "subTitleRu"];
            textFields.forEach((field) => {
                if (row[field]) formData.append(field, row[field]);
            });
            formData.append("id", id);

            // Handle image if changed (assuming cardImage is a URL or name)
            if (row.cardImage) {
                const imgObj = availableServiceCardImages.find((item) => item.name === row.cardImage);
                if (imgObj) {
                    const file = await convertImageToFile(imgObj.src, imgObj.name);
                    formData.append("cardImage", file);
                } else {
                    throw new Error("Selected image not found");
                }
            }

            await putService(formData).unwrap();
            showToast("Service updated successfully!", "success");
            setEditingKey(null);
            getAllServicesRefetch();
        } catch (error) {
            console.error("PUT Error:", error);
            showToast(error.message || error?.data?.message || "Error updating service!", "error");
        }
    };

    // Delete operation
    const handleDelete = async (record) => {
        try {
            await deleteService(record.id).unwrap();
            showToast("Service deleted successfully!", "success");
            getAllServicesRefetch();
        } catch (error) {
            console.error("Delete Error:", error);
            showToast(error?.data?.message || "Error deleting service!", "error");
        }
    };

    // Table columns
    const columns = [
        {
            title: "№",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Ad ",
            dataIndex: "title",
            key: "title",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="title" rules={[{required: true, message: "Başlıq daxil edin"}]}>
                            <Input/>
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Soyad ",
            dataIndex: "title",
            key: "title",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="title" rules={[{required: true, message: "Başlıq daxil edin"}]}>
                            <Input/>
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Email ",
            dataIndex: "title",
            key: "title",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="title" rules={[{required: true, message: "Başlıq daxil edin"}]}>
                            <Input/>
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Nömrə",
            dataIndex: "subTitle",
            key: "subTitle",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="subTitle">
                            <Input/>
                        </Form.Item>
                    );
                }
                return text;
            },
        },
        {
            title: "Qeyd",
            dataIndex: "subTitle",
            key: "subTitle",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Form.Item name="subTitle">
                            <Input/>
                        </Form.Item>
                    );
                }
                return text;
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
                        pageSize: 1,
                        className: "custom-pagination",
                    }}
                    className="custom-table"
                />
            </Form>
        </div>
    );
};

export default ContactTable;