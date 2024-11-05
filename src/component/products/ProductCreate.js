import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';
import Select from "react-select";
import Button from "react-bootstrap/Button";
import getAllCategories from '../../service/CategoriesService';
import * as productService from "../../service/ProductService";
import * as Yup from "yup";


const ProductCreate = ({ showModal, handleClose, onProductAdded }) => {
    const [categories, setCategories] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const MIN_2 = 2;
    const MIN_1 = 1;

    const fetchData = async () => {
        let categoriesData = await getAllCategories();
        setCategories(categoriesData.map(category => ({ value: category.id, label: category.name })));
    };

    useEffect(() => {
        const getCurrentDate = () => {
            const now = new Date();  // Lấy ngày giờ hiện tại
            const year = now.getFullYear();  // Lấy năm hiện tại (dạng 4 chữ số)
            const month = ('0' + (now.getMonth() + 1)).slice(-2);  // Lấy tháng hiện tại (tháng bắt đầu từ 0 nên cần +1)
            const day = ('0' + now.getDate()).slice(-2);  // Lấy ngày hiện tại và thêm số 0 ở đầu nếu cần, đảm bảo có 2 chữ số.
            return `${year}-${month}-${day}`;  // Trả về chuỗi ngày ở định dạng 'YYYY-MM-DD'
        };
        setCurrentDateTime(getCurrentDate());  // Cập nhật giá trị của `currentDateTime` với ngày hiện tại
        fetchData();
    }, []);



    const authenticate = {
        code: Yup.string().required("Mã đơn hàng không được để trống")
            .matches(/^PROD-\d{4}$/, "Mã đơn hàng phải có định dạng PROD-XXXX, trong đó XXXX là 4 chữ số"),
        name: Yup.string()
            .required("Tên sản phẩm không được để trống")
            .min(MIN_2, "Tên sản phẩm không được ngắn hơn 2 ký tự"),
        dateOfPurchase: Yup.date().required("Ngày mua không được để trống"),
        price: Yup.number()
            .required("Giá sản phẩm không được để trống")
            .min(MIN_1, "Giá sản phẩm phải lớn hơn 0"),
        quantity: Yup.number()
            .required("Số lượng không được để trống")
            .min(MIN_1, "Số lượng phải lớn hơn 0"),
        categories: Yup.object().nullable().required("Danh mục không được để trống")

    };

    const saveProduct = async (product) => {
        try {
            const dataRequest = {
                code: product.code,
                name: product.name,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                dateOfPurchase: product.dateOfPurchase || new Date().toISOString(), // chuỗi biểu diễn của ngày giờ hiện tại ở dạng ISO 8601
                categories: product.categories ? { id: product.categories.value, name: product.categories.label } : null
            };

            if (!product || !product.code || !product.name || !product.quantity || !product.price || !product.dateOfPurchase) {
                throw new Error("Dữ liệu sản phẩm không đầy đủ");
            }

            const response = await productService.saveProduct(dataRequest);
            console.log("response", response);
            console.log("dataRequest", dataRequest);


            if (response) {
                toast.success("Thêm mới thành công");
                handleClose();
                if (onProductAdded) onProductAdded();
            } else {
                toast.error("Thêm mới thất bại");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình lưu sản phẩm:", error);
            toast.error("Đã xảy ra lỗi: " + error.message);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        await saveProduct(values);
        setSubmitting(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm Mới Sản Phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        code: "",
                        name: "",
                        description: "",
                        price: "",
                        quantity: "",
                        dateOfPurchase: currentDateTime,
                        categories: null
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={Yup.object(authenticate)}
                    validateOnChange={true}  // Kiểm tra khi có thay đổi
                    validateOnBlur={true}
                >
                    {(formik, isSubmitting) => (
                        <Form>
                            <div className="form-group">
                                <label>Mã Sản Phẩm</label>
                                <Field name="code" type="text" className="form-control" />
                                <ErrorMessage name="code" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Tên Sản Phẩm</label>
                                <Field name="name" type="text" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Miêu Tả Sản phẩm</label>
                                <Field
                                    as="textarea"  // Sử dụng textarea thay vì input
                                    name="description"
                                    className="form-control"
                                    rows="3"  // Số dòng mặc định
                                    style={{ resize: "vertical" }}  // Cho phép thay đổi chiều cao (resize)
                                />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Số Lượng Sản Phẩm</label>
                                <Field name="quantity" type="text" className="form-control" />
                                <ErrorMessage name="quantity" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Giá Sản Phẩm</label>
                                <Field name="price" type="text" className="form-control" />
                                <ErrorMessage name="price" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Danh Mục</label>
                                <Select
                                    name="categories"
                                    options={categories}
                                    onChange={(option) => formik.setFieldValue("categories", option)}
                                    value={formik.values.categories}
                                    placeholder="Chọn Danh Mục"
                                />
                                <ErrorMessage name="categories" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                                <label>Ngày Thêm Sản Phẩm</label>
                                <Field
                                    name="dateOfPurchase"
                                    type="date"
                                    className="form-control"
                                    value={formik.values.dateOfPurchase}
                                    onChange={formik.handleChange}
                                    max={currentDateTime} /* Giới hạn không cho phép chọn ngày trong tương lai */
                                />
                                <ErrorMessage name="dateOfPurchase" component="div" className="text-danger" />
                            </div>

                            <button className="btn btn-primary mt-3" type="submit" disabled={isSubmitting}>Lưu</button>
                            <Button variant="secondary" className="btn btn-primary mt-3" onClick={handleClose}>Đóng</Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ProductCreate;
