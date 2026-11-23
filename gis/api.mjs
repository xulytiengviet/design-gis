export const sections = {
  2: 'Quy hoạch chung đô thị · 1/10.000',
  3: 'Quy hoạch chung đô thị · 1/5.000',
  4: 'Quy hoạch phân khu · 1/2.000, 1/5.000',
  5: 'Quy hoạch chi tiết · 1/500',
  6: 'Quy hoạch chung khu chức năng · 1/5.000, 1/10.000',
  7: 'Quy hoạch chung xã, đặc khu ngoài hệ thống đô thị · 1/10.000, 1/25.000',
};
export const themes = {
  neutral: '#394754',
  butter: '#805d0c',
  chocolate: '#7b4535',
  matcha: '#28644a',
  stone: '#625d51',
  gothic: '#634476',
  y2k: '#2150a0',
};
export const fold = value =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();
export function findLand(rows, query = '', section = '') {
  const terms = fold(query).split(/\s+/);
  return rows.filter(
    r =>
      (!section || String(r.section) === String(section)) &&
      terms.every(t =>
        fold(
          [r.name, r.layer, r.aci, r.id, sections[r.section]].join(' '),
        ).includes(t),
      ),
  );
}
export function stages(section) {
  if (section === 5) return ['Hiện trạng', 'Quy hoạch'];
  return ['Hiện trạng', section === 7 ? 'Ngắn hạn' : 'Đợt đầu', 'Dài hạn'];
}
