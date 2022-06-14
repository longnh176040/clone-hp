const RESPONSE_MESSAGES = {
    EXISTED: "[object] đã tồn tại",
    NOT_FOUND: "[object] không tồn tại",
    CREATE_SUCCESS: "Tạo [object] thành công",
    UPDATE_SUCCESS: "Cập nhật [object] thành công",
    DELETE_SUCCESS: "Xoá [object] thành công",
    FIELD_REQUIRED: "[object] không được để trống",
    ACTION_SUCCESS: "[action] thành công"
}

const MESSAGE_KEYS = {
    object: "[object]",
    action: "[action]"
}

const MESSAGE_VALUES = {
    sku: "Thông số",
    imageProductUrls: "Ảnh sản phẩm",
    product: "Sản phẩm",
    rating: "Đánh giá"
}

module.exports = {
    RESPONSE_MESSAGES,
    MESSAGE_KEYS,
    MESSAGE_VALUES
}
