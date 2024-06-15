'use client';
import { ActionIcon, Button, Flex, rem, Stack, Title, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { MovingBlockCanvas } from './MovingBlockCanvas';
import { useResult } from '@/hooks';
import useImage from 'use-image';
import { CircleHelp } from 'lucide-react';

export const Result = () => {
  const { store } = useResult();
  const [productImage, loadingProduct] = useImage(`data:image/jpeg;base64,${store?.product}`);
  const [backgroundImage, loadingBackground] = useImage(
    `data:image/jpeg;base64,${store?.background}`
  );

  return (
    <Stack mt="lg" mih={650}>
      <Flex gap="md" align="center">
        <Title order={4}>Результаты генерации:</Title>
        <Tooltip label="При скачивании изображения границы товара будут убраны">
          <CircleHelp size={18} />
        </Tooltip>
      </Flex>
      {productImage && backgroundImage && (
        <MovingBlockCanvas
          productImage={productImage}
          backgroundImage={backgroundImage}
          x={store?.x ?? 10}
          y={store?.y ?? 10}
        />
      )}
      <Button component={Link} href="/">
        Выбрать новое изображение
      </Button>
    </Stack>
  );
};
