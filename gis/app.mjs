import {
  sections,
  themes,
  fold,
  findLand,
  findCadastral,
  stages,
} from './api.mjs';
import {convertFont} from './qgis/font.mjs';
const $ = id => document.getElementById(id);
function el(tag, text) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
}
function link(text, url) {
  const a = el('a', text);
  a.href = url;
  return a;
}
async function read(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error(file);
  return response.json();
}
function showDetail(r) {
  const title = el('h2', r.name);
  title.id = 'detailTitle';
  const fig = el('figure'),
    img = el('img');
  img.src = r.hatch;
  img.alt = 'Mẫu tô của ' + r.name;
  fig.append(img, el('figcaption', stages(r.section).join('  /  ')));
  const list = el('dl');
  for (const [term, value] of Object.entries({
    'Đồ án': sections[r.section],
    'Phân lớp cơ sở': r.layer ?? 'Xem bảng Mục 7',
    'Index Color': r.aci,
    'RGB tham khảo (ACI)': r.rgb.join(', '),
  })) {
    list.append(el('dt', term), el('dd', value));
  }
  $('detailBody').replaceChildren(
    el('p', 'PHỤ LỤC I · MỤC ' + r.section),
    title,
    fig,
    list,
    link(
      'Đối chiếu bản gốc · trang ' + r.page,
      'sources/16-bxd-1.pdf#page=' + r.page,
    ),
  );
  $('detail').showModal();
}
function route() {
  const id = ['cad', 'components', 'dia-chinh', 'qgis'].includes(
    location.hash.slice(1),
  )
    ? location.hash.slice(1)
    : 'atlas';
  for (const section of document.querySelectorAll('main>section'))
    section.hidden = section.id !== id;
  for (const a of document.querySelectorAll('nav a')) {
    if (a.hash === '#' + id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}
addEventListener('hashchange', route);
route();
try {
  const [land, components, settings, cadastral, tools] = await Promise.all(
    [
      'data/land.json',
      'data/components.json',
      'settings.json',
      'data/cadastral.json',
      'data/qgis.json',
    ].map(read),
  );
  for (const key of Object.keys(themes)) $('theme').add(new Option(key, key));
  const themeKey = 'design-gis:' + location.pathname;
  function paint(theme, dark) {
    $('theme').value = theme;
    document.documentElement.style.setProperty('--accent', themes[theme]);
    document.documentElement.classList.toggle('dark', dark);
    $('dark').setAttribute('aria-pressed', String(dark));
  }
  const saved = localStorage.getItem(themeKey);
  paint(
    Object.hasOwn(themes, saved) ? saved : settings.theme,
    localStorage.getItem(themeKey + ':dark') === 'yes',
  );
  $('theme').onchange = () => {
    const value = $('theme').value;
    localStorage.setItem(themeKey, value);
    paint(value, document.documentElement.classList.contains('dark'));
  };
  $('dark').onclick = () => {
    const dark = !document.documentElement.classList.contains('dark');
    localStorage.setItem(themeKey + ':dark', dark ? 'yes' : 'no');
    paint($('theme').value, dark);
  };
  for (const [key, label] of Object.entries(sections))
    $('scale').add(new Option(label, key));
  function renderLand() {
    const found = findLand(land, $('search').value, $('scale').value);
    $('count').textContent = found.length + ' mục';
    $('rows').replaceChildren(
      ...found.map(r => {
        const row = el('tr'),
          name = el('td'),
          action = el('button', r.name),
          sample = el('td'),
          img = el('img');
        action.onclick = () => showDetail(r);
        name.append(
          action,
          el('small', 'Mục ' + r.section + ' · ' + (r.layer ?? 'Nông thôn')),
        );
        img.src = r.hatch;
        img.loading = 'lazy';
        img.alt = stages(r.section).join(', ');
        sample.append(img);
        row.append(name, el('td', r.aci), sample);
        return row;
      }),
    );
    if (!found.length) {
      const cell = el(
        'td',
        'Không tìm thấy ký hiệu. Hãy đổi từ khóa hoặc tỷ lệ.',
      );
      cell.colSpan = 3;
      const tr = el('tr');
      tr.append(cell);
      $('rows').append(tr);
    }
  }
  function renderComponents() {
    const q = fold($('componentQuery').value);
    const found = components.filter(c =>
      fold(c.name + ' ' + c.group).includes(q),
    );
    $('cards').replaceChildren(
      ...found.map(c => {
        const card = el('article');
        card.append(
          el('small', c.group),
          el('h2', c.name),
          el('code', c.cli),
          link(
            'Tài liệu API ↗',
            'https://github.com/xulytiengviet/design-gis/blob/main/' + c.source,
          ),
        );
        return card;
      }),
    );
    if (!found.length) $('cards').append(el('p', 'Không tìm thấy component.'));
  }
  function renderCadastral() {
    const rows = findCadastral(cadastral, $('dcQuery').value);
    $('dcCount').textContent = rows.length + ' mục';
    $('dcRows').replaceChildren(
      ...rows.map(item => {
        const row = el('tr'),
          name = el('td', item.name),
          source = el('td');
        name.append(el('small', item.reference));
        source.append(
          link('Trang ' + item.page, 'sources/26-btnmt.pdf#page=' + item.page),
        );
        row.append(name, el('td', item.meaning), source);
        return row;
      }),
    );
  }
  for (const tool of tools) {
    const card = el('article');
    card.append(el('h2', tool.name), el('p', tool.description));
    if (tool.file) card.append(link('Tải ZIP cho QGIS', tool.file), el('br'));
    card.append(link('Mã nguồn đối chiếu', tool.source));
    $('qgisTools').append(card);
  }
  const renderFont = () => {
    $('fontResult').value = convertFont(
      $('fontInput').value,
      $('fontMode').value,
    );
  };
  $('fontMode').onchange = renderFont;
  $('fontInput').oninput = renderFont;
  $('dcQuery').oninput = renderCadastral;
  renderCadastral();
  $('search').oninput = renderLand;
  $('scale').onchange = renderLand;
  $('componentQuery').oninput = renderComponents;
  renderLand();
  renderComponents();
} catch (e) {
  $('error').textContent =
    'Không tải được dữ liệu. Mở atlas qua máy chủ HTTP và tải lại trang.';
  console.error(e);
}
