'use client';

import {useState} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';

export default function DrawingSheet() {
  const [number, setNumber] = useState('QH05');
  const [title, setTitle] = useState('Sơ đồ định hướng phát triển không gian');
  const normalized = title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/gi, 'D')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();
  const code = number.trim().toUpperCase();
  return (
    <main lang="vi">
      <VStack gap={4}>
        <Heading level={1}>Phiếu bản vẽ GIS</Heading>
        <TextInput label="Số hiệu bản vẽ" value={number} onChange={setNumber} />
        <TextInput label="Tên bản vẽ" value={title} onChange={setTitle} />
        <output aria-live="polite">
          {/^[A-Z0-9][A-Z0-9._-]*$/.test(code) && normalized
            ? code + '-' + normalized + '.dwg'
            : 'Nhập số hiệu hợp lệ và tên bản vẽ.'}
        </output>
        <Text>
          Quy cách tên tệp theo Phụ lục I, trang 1, Thông tư 16/2025/TT-BXD.
        </Text>
      </VStack>
    </main>
  );
}
