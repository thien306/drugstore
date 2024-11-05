import axios from "axios";

const URL_Categories = "http://localhost:3000/categories";

const getAllCategories = async () => {
    try {
        const url = `${URL_Categories}`;
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi truy xuất tất cả danh mục:", error.message);
        return [];
    }
}

export default getAllCategories;