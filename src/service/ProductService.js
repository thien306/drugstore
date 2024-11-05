import axios from "axios";

const URL_PRODUCT = "http://localhost:3000/products";

const getAllProduct = async () => {
    try {
        const url = `${URL_PRODUCT}`;
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi truy xuất tất cả sản phẩm:", error.message);
        return [];
    }
}


export const saveProduct = async (product) => {
    try {
        const response = await axios.post(URL_PRODUCT, product);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi truy xuất tất sản phẩm:", error.message);
        return [];
    }
};

const deleteProduct = async (id) => {
    try {
        await axios.delete(URL_PRODUCT + "/" + id);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const findProduct = async (id) => {
    try {
        let res = await axios.get(URL_PRODUCT + "/" + id);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi truy xuất tất sản phẩm:", error.message);
    }
}

export const editProduct = async (id, product) => {
    try {
        const response = await axios.put(`${URL_PRODUCT}/${id}`, product);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi truy xuất tất sản phẩm:", error.message);
        return [];
    }
}

const searchNameAndCategories = async (searchTerm) => {
    try {
        const res = await axios.get(URL_PRODUCT);
        return res.data.filter((product) => 
            product.name.includes(searchTerm) ||
            (product.categories && product.categories.name && product.categories.name.includes(searchTerm))
        );
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error.message);
        return [];
    }
};







export default {getAllProduct, deleteProduct, findProduct, searchNameAndCategories}