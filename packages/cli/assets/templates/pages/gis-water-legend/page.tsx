'use client';

import {useState} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';

const features = [
  ['NHA_MAY', 'Nhà máy nước'],
  ['BOM_CAP_1', 'Trạm bơm cấp 1'],
  ['BOM_TANG_AP', 'Trạm bơm tăng áp'],
  ['BOM_GIENG', 'Trạm bơm giếng'],
  ['DAI_NUOC', 'Đài nước, bể chứa nước'],
];

export default function WaterLegend() {
  const [feature, setFeature] = useState('NHA_MAY');
  const [stage, setStage] = useState('HT');
  return (
    <main lang="vi">
      <VStack gap={4}>
        <Heading level={1}>Chú giải công trình cấp nước</Heading>
        <label>
          Công trình{' '}
          <select value={feature} onChange={e => setFeature(e.target.value)}>
            {features.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Giai đoạn{' '}
          <select value={stage} onChange={e => setStage(e.target.value)}>
            <option value="HT">Hiện trạng</option>
            <option value="QHDD">Quy hoạch đợt đầu</option>
            <option value="QHDH">Quy hoạch dài hạn</option>
          </select>
        </label>
        <output aria-live="polite">
          Block {stage}_{feature} · Layer {stage}_HTKT_CN_Tram
        </output>
        <Text>
          Tên block theo thư viện Design GIS. Mẫu hình theo Phụ lục I, Mục 8,
          trang 51.
        </Text>
      </VStack>
    </main>
  );
}
