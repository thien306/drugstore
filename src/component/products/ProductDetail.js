import React, { useEffect } from "react";
import { Formik, Field } from "formik";
import '../../style/ProductDetail.css';
import Button from "react-bootstrap/Button";

const ProductDetail = ({ product, handleClose }) => {
    if (!product) {
        return null;
    }


    return (
        <>
            <div className="overlay" onClick={handleClose}></div>
            <div className="product-detail">
                <div className="product-detail-header">
                    <Button onClick={handleClose} className="close-button">×</Button>
                </div>
                <Formik
                    initialValues={{
                        id: product.id || "",
                        code: product.code || "",
                        name: product.name || "",
                        description: product.description || "",
                        quantity: product.quantity || "",
                        price: product.price ? product.price.toLocaleString() + " VND" : "",
                        categories: product.categories ? product.categories.name : "",
                        dateOfPurchase: product.dateOfPurchase ? new Date(product.dateOfPurchase).toLocaleDateString() : "",
                    }}
                >
                    {() => (
                        <form>
                            <h5>Thông Tin Sản Phẩm</h5>
                            <div className="form-group-detail">
                                <label>Mã Sản Phẩm</label>
                                <Field name="name" type="text" className="form-control" disabled />
                            </div>
                            <div className="form-group-detail">
                                <label>Tên Sản Phẩm</label>
                                <Field name="name" type="text" className="form-control" disabled />
                            </div>
                            <div className="form-group-detail">
                                <label>Miêu Tả Sản Phẩm</label>
                                <Field
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    disabled
                                    data-full-text={product.description} /* Thêm thuộc tính này để chứa toàn bộ nội dung */
                                />
                            </div>
                            <div className="form-group-detail">
                                <label>Số Lượng Sản Phẩm</label>
                                <Field name="quantity" type="textarea" className="form-control" disabled />
                            </div>
                            <div className="form-group-detail">
                                <label>Giá Sản Phẩm</label>
                                <Field name="price" type="text" className="form-control" disabled />
                            </div>
                            <div className="form-group-detail">
                                <label>Danh Mục Sản Phẩm</label>
                                <Field name="categories" type="text" className="form-control" disabled />
                            </div>
                            <div className="form-group-detail">
                                <label>Ngày Thêm Mới</label>
                                <Field name="dateOfPurchase" type="text" className="form-control" disabled />
                            </div>

                        </form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default ProductDetail;
