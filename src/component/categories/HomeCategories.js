import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import swal from "sweetalert2";
import getAllCategories from '../../service/CategoriesService';
import { Button, TableRow, TableCell, colors } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faToggleOn, faToggleOff, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

function HomeCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(3);

    const fetchHomeCategories = async () => {
        setLoading(true);

        try {
            const res = await getAllCategories();
            setCategories(res);
        } catch (error) {
            console.error("Error while getting categories list:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleLoadMore = () => {
        setItemsToShow(prevItems => prevItems + 3);
    };

    useEffect(() => {
        fetchHomeCategories();
    }, []);



    return (
        <div className="table-categories">
            <h3 className="categories-heading">Danh Sách Danh Mục</h3>

            <Button className="btn btn-success btn-success-light" variant="primary">
                    Thêm Danh Mục
                </Button>

            <table className="table table-hover table-bordered categories">
                <thead className="thead-categories">
                    <tr>
                        <th>STT</th>
                        <th>Tên Danh Mục</th>
                        <th>Miêu Tả Danh Mục</th>
                        <th>Quản Lý</th>

                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(categories) && categories.length > 0 ? (
                        categories.slice(0, itemsToShow).map((categories, index) => (
                            <tr key={categories.id}>
                                <td >{index + 1}</td>
                                <td >{categories?.name}</td>
                                <td >{categories?.description}</td>
                                <td className="quan-ly-cell">
                                    <div className="btn-group">
                                        <Button className="btn btn-info btn-sm me-2" variant="primary" >
                                            <FontAwesomeIcon icon={faWrench} style={{ color: "#c01111", fontSize: "18px" }} />
                                        </Button>
                                        <Button className="btn btn-info btn-sm">
                                            <FontAwesomeIcon icon={faEye} rotation={180} style={{ color: "#7027b9", fontSize: "18px" }} />
                                        </Button>
                                        <Button className="btn btn-info btn-sm">
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
                {itemsToShow < categories.length && (
                    <Button
                        className="btn btn-success btn-sm"
                        onClick={handleLoadMore}
                    >
                        XEM THÊM
                    </Button>
                )}
            </div>
        </div >
    );
}

export default HomeCategories;
