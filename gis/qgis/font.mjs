// SPDX-License-Identifier: GPL-2.0-or-later
// Mapping adapted from vn_fonts.py, (C) 2016 ThanhGIS. See README.md.
const legacy =
  '\u00a8\u00a1\u00ae\u00a7\u00ac\u00a5\u00ad\u00a6\u00b5\u00b6\u00b9\u00ca\u00c7\u00c8\u00c9\u00cb\u00be\u00bb\u00bc\u00bd\u00c6\u00d0\u00ce\u00cf\u00d1\u00d5\u00d2\u00d3\u00d4\u00d6\u00d8\u00dc\u00de\u00e1\u00e2\u00e4\u00e8\u00cc\u00e5\u00e6\u00e7\u00e9\u00ed\u00ea\u00eb\u00ec\u00ee\u00d7\u00b8\u00a9\u00a2\u00f9\u00ef\u00f1\u00f4\u00f8\u00f5\u00f6\u00f7\u00fa\u00fb\u00fc\u00fe\u00fd\u00ab\u00a4\u00f3\u00e3\u00b7\u00dd\u00aa\u00a3\u00f2\u00df';
const unicode =
  'ăĂđĐơƠưƯàảạấầẩẫậắằẳẵặéẻẽẹếềểễệỉĩịỏõọốèồổỗộớờởỡợìáâÂựùủụứừửữỳỷỹỵýôÔúóãíêÊũò';
const table = new Map(Array.from(legacy, (letter, i) => [letter, unicode[i]]));
export function convertFont(text, mode = 'tcvn3') {
  if (mode === 'unicode') return text.normalize('NFC');
  if (mode !== 'tcvn3' && mode !== 'tcvn3-upper')
    throw Error('Chọn unicode, tcvn3 hoặc tcvn3-upper.');
  const decoded = Array.from(text, letter => table.get(letter) ?? letter).join(
    '',
  );
  return mode === 'tcvn3-upper' ? decoded.toLocaleUpperCase('vi') : decoded;
}
