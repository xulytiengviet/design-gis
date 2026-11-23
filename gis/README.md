# Design GIS

Atlas dành cho người biên tập hồ sơ quy hoạch đô thị và nông thôn. Giao diện, API JavaScript và CLI đọc cùng danh mục. Mỗi kết quả tra đất có ảnh mẫu, số trang và ngữ cảnh tỷ lệ.

## Chạy từ bản sao kho

Tại thư mục gốc, chạy `python -m http.server 8000 --bind 127.0.0.1 --directory gis` rồi mở [atlas](http://127.0.0.1:8000/). Sau khi chép dự án bằng CLI, chạy máy chủ trong thư mục mới và bỏ tùy chọn `--directory gis`. Trang chạy hoàn toàn trên máy, kể cả khi mất Internet. Các liên kết tài liệu Astryx trên GitHub và Công báo cần kết nối.

```sh
node gis/cli.mjs create ../ban-do-ben-tre
node gis/cli.mjs land "nhà ở liên kế" 5
node gis/cli.mjs blocks "tăng áp"
node gis/cli.mjs component Table
node gis/cli.mjs themes
node ../ban-do-ben-tre/cli.mjs theme stone
```

Lệnh `theme` đặt theme mặc định của bản sao. Lựa chọn trong trình duyệt có ưu tiên cao hơn. Bảy bảng màu giao diện tĩnh hỗ trợ chế độ tối và giữ màu của mẫu bản đồ. Chỉnh biến CSS trong `style.css` để đổi thương hiệu.

## React và Astryx

Kho cung cấp 150+ component hỗ trợ accessibility, bảy gói theme React và CLI Astryx. Hai template bổ sung trong fork nằm ở `packages/cli/assets/templates/pages/gis-drawing-sheet` và `gis-water-legend`. Chép `page.tsx` tương ứng vào dự án React đã cài Astryx hoặc dùng CLI **build từ checkout này** để tra template. Bản npm upstream có bộ template riêng.

```sh
astryx component Button
astryx template gis-drawing-sheet
astryx template gis-water-legend
astryx theme --help
```

Các template dùng component React của Astryx, CSS Modules, Tailwind hoặc CSS thuần theo cấu hình dự án. Các ví dụ Vite, Next và Tailwind ở thư mục `apps`. Dùng hướng dẫn khởi tạo trong README gốc. Chạy `node gis/tools/index-components.mjs` từ kho để đồng bộ danh mục component sau khi cập nhật Astryx.

## Dữ liệu cho ứng dụng và agent

| Tài nguyên | Nội dung |
| --- | --- |
| `data/land.json`, `data/land.csv` | 178 dòng sử dụng đất thuộc Mục 2–7. Một chức năng có thể xuất hiện ở nhiều tỷ lệ. |
| `api.mjs` | `findLand(rows, query, section)`, `stages(section)`, `sections`, `themes`. Các lệnh tra cứu CLI trả JSON. |
| `hatch/` | Mẫu thể hiện cắt từ PDF, thứ tự giai đoạn do `stages` cung cấp. |
| `cad/blocks.json` | Tên block, ý nghĩa, layer chèn và số trang nguồn. |
| `data/components.json` | Tên, nhóm, mô tả, đường dẫn API trong kho và lệnh tra từng component. |

`id` định danh một dòng. `page` đếm từ trang 1 của PDF. `layer` là tên cơ sở theo bảng; giá trị null ở Mục 7 khi bảng không có cột này. `aci` là số Index ghi trong nguồn. `rgb` quy đổi để hiển thị theo bảng ACI của ezdxf 1.4.5. Mẫu Hatch là ảnh đối chiếu hình học và giai đoạn; nguồn không ghi tên pattern CAD cho từng hàng. Với cùng màu có thể có nhiều chức năng. Ví dụ Index 94 được dùng cho cả thể dục thể thao và cây xanh sử dụng hạn chế ở Mục 5.

## CAD, PCCC và văn bản

Mở `cad/thu-vien.dwg` (DWG R2000) hoặc DXF trong CAD. 15 block tái dựng từ hình vector của 5 công trình cấp nước trên trang 51 qua 3 giai đoạn. Bản vẽ có mẫu vùng khép kín cho ranh giới quốc gia, cấp tỉnh và cấp cơ sở, với layer, Index và kiểu nét tra từ trang 5. Các lớp đất hiện trạng/quy hoạch của Mục 5 được khai báo sẵn. Tên block do dự án đặt. Chọn tỷ lệ chèn và tỷ lệ nét phù hợp với bản vẽ đích. Bộ CAD này là thư viện biên soạn của dự án, phạm vi nhỏ hơn toàn bộ Phụ lục I.

Theo Điều 3 khoản 3 Thông tư 16/2025/TT-BXD, hồ sơ lồng ghép giải pháp và thiết kế PCCC phù hợp cấp độ quy hoạch. Bảng lớp **tham khảo** Phụ lục II trang 8 và 11 ghi lớp điểm và vùng cấp nước PCCC. Đối chiếu cả nội dung đồ án và quy định chuyên ngành khi lập hồ sơ.

- [Phụ lục I gốc, 54 trang](sources/16-bxd-1.pdf)
- [Phụ lục II gốc, 13 trang](sources/16-bxd-2.pdf)
- [Thông tư 16/2025/TT-BXD](https://vbpl.moj.gov.vn/vinhphuc/Pages/vbpq-toanvan.aspx?ItemID=179202)
- [Thông tư 43/2025/TT-BXD, Điều 1 khoản 7](https://congbao.chinhphu.vn/tai-ve-van-ban-so-43-2025-tt-bxd-46838-60369?format=pdf)

Tên đất tại Mục 7 trong danh mục áp dụng cập nhật thuật ngữ của Thông tư 43. Ảnh mẫu và hai PDF phản ánh bản gốc ban hành kèm Thông tư 16.

## Chọn bộ ký hiệu theo sản phẩm cần giao

| Công việc | Căn cứ tra cứu | Cách đọc |
| --- | --- | --- |
| Đo đạc lập bản đồ địa chính | TT26/2024/TT-BTNMT, Phụ lục 22 | Đọc số thửa, diện tích, loại đất và mẫu nét. Ranh theo hiện trạng, giấy tờ, chỉ giới hoặc chỉnh lý có ý nghĩa riêng. Đối chiếu hồ sơ đăng ký khi xác định chủ thể có quyền. |
| Lập bản vẽ quy hoạch đô thị và nông thôn | TT16/2025/TT-BXD, Phụ lục I | Chọn cấp đồ án, tỷ lệ, giai đoạn hiện trạng hoặc quy hoạch. Đọc layer, Index Color và hatch cùng nhau. |
| Kiểm tra cấu trúc cơ sở dữ liệu quy hoạch | TT16/2025/TT-BXD, Phụ lục II | Đối chiếu nhóm dữ liệu, lớp, hình học và thuộc tính. Plugin đọc File Geodatabase và xuất báo cáo theo bộ quy tắc đi kèm. |

Ví dụ, nhãn **ODT 18 / 421,1** trong mẫu địa chính cho biết loại đất, số thửa 18 và diện tích 421,1 m². Muốn biết chức năng được định hướng cho vị trí đó, chồng lớp đồ án có cùng hệ quy chiếu và đọc chú giải của đồ án. Khi in chồng lớp, giữ riêng tên nguồn, thời điểm và chú giải của từng bộ.

- [PDF TT26 đính kèm, Phụ lục 22 bắt đầu ở trang 91](sources/26-btnmt.pdf#page=91)
- [Bản hợp nhất về đo đạc địa chính 34/VBHN-BNNMT](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/8/34-vbhn-bnnmt.pdf)
- [Bản hợp nhất về quy hoạch 59/VBHN-BXD ngày 02/07/2026](https://vanban.chinhphu.vn/?classid=2629&docid=218798&pageid=27160)
- [Mã nguồn tái sử dụng và giấy phép](qgis/README.md)

Trang Địa chính và CLI cùng đọc 11 mục chọn lọc từ bản PDF được cung cấp. Trường `reference` dẫn đến điểm hoặc hàng trong phụ lục. Trường `page` mở đúng trang của PDF. Xem toàn bộ hình và tỷ lệ ở bản gốc. Trang QGIS và CLI đọc chung `data/qgis.json`. Lệnh chuyển mã trả văn bản Unicode.

```sh
node gis/cli.mjs cadastral "nhãn thửa"
node gis/cli.mjs qgis
node gis/cli.mjs font tcvn3 "ViÖt Nam"
```
