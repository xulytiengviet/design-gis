# Nguồn công cụ QGIS

Trong QGIS chọn **Plugins → Manage and Install Plugins → Install from ZIP**, sau đó chọn gói tương ứng và bật plugin. Mỗi ZIP chứa đầy đủ mã Python đang chạy, giấy phép và tệp ORIGIN. Danh mục dùng cho cả atlas và CLI ở [qgis.json](../data/qgis.json).

| Thành phần | Mã tái sử dụng | Điều chỉnh trong Design GIS |
| --- | --- | --- |
| [TT16_GIS_Check của Hoa Le](https://github.com/lequynhhoa/TT16_GIS_Check/tree/ea20b08a7e400dfdf85376c3f5700bbc7b9d18d7) | Plugin 1.0.3, bộ quy tắc JSON, bộ kiểm tra hình học và xuất báo cáo | Đóng gói thư mục chạy để cài từ ZIP. Dùng cho cơ sở dữ liệu quy hoạch theo Phụ lục II. |
| [QGIS_print_coordinate của GFD](https://github.com/lequynhhoa/QGIS_print_coordinate/tree/e3131674a1211f6779d6a2d3f462cfd54bdf2043) | Plugin 2.2, nhận diện CRS của từng lớp, bảng kết quả và xuất CSV | Giải quyết dấu xung đột Git ở metadata và mã giao diện, giữ nhánh dùng qgis.PyQt và crs_inspector. |
| [QGIS-Vietnamese-Fonts-Converter của ThanhGIS](https://github.com/thanhgis/QGIS-Vietnamese-Fonts-Converter/tree/e757f6d78c632edf5edf4ca35c6891b9f7a7d4e3) | Bảng chuyển trong vn_fonts.py (2016) | Chuyển bảng sang JavaScript để web và CLI dùng chung, thay từng ký tự đúng một lần. Chế độ .VnTimeH áp dụng chữ hoa toàn trường. Chọn bảng mã theo phông nguồn trước khi chuyển. |

Ba thành phần được phân phối theo GPL-2.0-or-later. [Nội dung giấy phép GPL v2](COPYING).
