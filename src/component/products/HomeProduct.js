import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import swal from "sweetalert2";
import productService from '../../service/ProductService';
import { Button, TableRow, TableCell, colors } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faToggleOn, faToggleOff, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import ProductCreate from '../products/ProductCreate';
import '../../style/Product.css'
import ProductDetail from '../products/ProductDetail'
import { toast } from "react-toastify";
import ProductEdit from '../products/ProductEdit';
import 'bootstrap-icons/font/bootstrap-icons.css';

function HomeProduct() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const handleCloseCreateModal = () => setShowCreateModal(false);
    const handleShowCreateModal = () => setShowCreateModal(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
    const handleCloseDetailModal = () => setShowDetailModal(false);
    const handleShowDetailModal = () => setShowDetailModal(true);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchHomeProduct = async () => {
        setLoading(true);

        try {
            const res = await productService.getAllProduct();
            setProduct(res);
        } catch (error) {
            console.error("Error while getting product list:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLoadMore = () => {
        setItemsToShow(prevItems => prevItems + 3);
    };

    useEffect(() => {
        fetchHomeProduct();
    }, []);


    const productDetails = async (id) => {
        try {
            const product = await productService.findProduct(id)
            console.log("product", product);
            setSelectedProductForDetail(product);
            handleShowDetailModal(true)
        } catch (error) {
            toast.error("Lỗi khi lấy chi tiết sản Phẩm");
        }
    };

    const handleEdit = async (id) => {
        try {
            const product = await productService.findProduct(id);
            setSelectedProductForEdit(product);
            handleShowEditModal();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lấy dữ liệu giao dịch!");
        }
    };

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn tác điều này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đúng rồi, xóa nó đi!",
            cancelButtonText: "Không, hủy đi!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                let isDeleted = await productService.deleteProduct(id);
                if (isDeleted) {
                    swalWithBootstrapButtons.fire(
                        "Đã xóa!",
                        "Sản phẩm của bạn đã được xóa.",
                        "success"
                    );
                    setProduct(product.filter(product => product.id !== id));
                } else {
                    swalWithBootstrapButtons.fire(
                        "Lỗi",
                        "Xóa sản phẩm không thành công.",
                        "error"
                    );
                }
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                    "Đã hủy",
                    "Sản phẩm của bạn vẫn an toàn :)",
                    "error"
                );
            }
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        if (searchKeyword.trim() === "") {
            fetchHomeProduct(); // Lấy lại tất cả sản phẩm nếu ô tìm kiếm trống
        } else {
            try {
                const data = await productService.searchNameAndCategories(searchKeyword);
                if (data.length === 0) {
                    toast.info("Không có dữ liệu phù hợp.");
                    setProduct([]); // Xóa danh sách sản phẩm nếu không tìm thấy kết quả
                } else {
                    setProduct(data); // Hiển thị kết quả tìm kiếm
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi tìm kiếm.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="table-product">
            <h3 className="product-heading">Danh Sách Sản Phẩm</h3>

            <div className="top-bar">
                <Button className="btn btn-success btn-success-light" variant="primary" onClick={handleShowCreateModal}>
                    Thêm Sản Phẩm
                </Button>

                <div className="search-bar-client">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm mã sản phẩm và danh mục"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />


                    <button className="btn btn-outline-info btn-sm" onClick={handleSearch}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            <table className="table table-hover table-bordered product">
                <thead className="thead-product">
                    <tr>
                        <th>STT</th>
                        <th>Mã Sản Phẩm</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Miêu Tả Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Giá</th>
                        <th>Thời Gian</th>
                        <th>Danh Mục</th>
                        <th>Quản Lý</th>

                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(product) && product.length > 0 ? (
                        product.slice(0, itemsToShow).map((product, index) => (
                            <tr key={product.id}>
                                <td >{index + 1}</td>
                                <td >{product?.code}</td>
                                <td >{product?.name}</td>
                                <td className="truncate-text">
                                    {product?.description}
                                </td>   
                                <td >{product?.quantity}</td>
                                <td>{product?.price ? product.price.toLocaleString() + " VND" : "N/A"}</td>
                                <td >{new Date(product?.dateOfPurchase).toLocaleDateString()}</td>
                                <td>
                                    {Array.isArray(product.categories)
                                        ? product.categories.map((category) => category.name).join(", ")
                                        : product.categories?.name}
                                </td>
                                <td className="quan-ly-cell">
                                    <div className="btn-group">
                                        <Button className="btn btn-info btn-sm me-2" variant="primary" onClick={() => handleEdit(product.id)}>
                                            <FontAwesomeIcon icon={faWrench} style={{ color: "#c01111", fontSize: "18px" }} />
                                        </Button>
                                        <Button className="btn btn-info btn-sm" onClick={() => productDetails(product.id)}>
                                            <FontAwesomeIcon icon={faEye} rotation={180} style={{ color: "#7027b9", fontSize: "18px" }} />
                                        </Button>
                                        <Button className="btn btn-info btn-sm" onClick={() => handleDelete(product.id)}>
                                            <FontAwesomeIcon icon={faTrash} style={{ color: "#FF0000", fontSize: "18px" }} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={11}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>

            </table>

            <div className="text-center mt-3">
                {itemsToShow < product.length && (
                    <Button
                        className="btn btn-success btn-sm"
                        onClick={handleLoadMore}
                    >
                        XEM THÊM
                    </Button>
                )}
            </div>

            <ProductCreate
                showModal={showCreateModal}
                handleClose={handleCloseCreateModal}
                onProductAdded={fetchHomeProduct}
            />

            {showDetailModal && (
                <ProductDetail
                    product={selectedProductForDetail}
                    handleClose={handleCloseDetailModal}
                />
            )}

            <ProductEdit
                showModal={showEditModal}
                handleClose={() => {
                    handleCloseEditModal();
                    fetchHomeProduct(0);
                }}
                product={selectedProductForEdit}
            />
        </div >
    );
}

export default HomeProduct;
