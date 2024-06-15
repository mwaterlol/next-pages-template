'use client';
import {
  ActionIcon,
  Button,
  Flex,
  LoadingOverlay,
  rem,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import { MovingBlockCanvas } from './MovingBlockCanvas';
import { useResult, useStepperForm } from '@/hooks';
import useImage from 'use-image';
import { CircleHelp, DownloadIcon, Plus } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { Image as MantineImage } from '@mantine/core';
export const Result = () => {
  const { store } = useResult();
  const { stepperForm } = useStepperForm();
  const [productImage] = useImage(`data:image/jpeg;base64,${store?.product}`);
  const [backgroundImage] = useImage(`data:image/jpeg;base64,${store?.background}`);

  const [productStaticImage, setProductStaticImage] = useState<HTMLImageElement | undefined>(
    undefined
  );
  useEffect(() => {
    if (store?.generated_image) {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${store.product}`;
      img.onload = () => setProductStaticImage(img);
      img.onerror = (error) => console.error('Error loading product image:', error);
    }
  }, [store?.product]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const downloadImage = async () => {
    try {
      const response = await fetch(`data:image/png;base64,${store?.generated_image}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${stepperForm.productPicture?.fileName.split('.')[0]}_backgorund.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      notifications.show({
        color: 'red',
        title: 'Ошибка при скачивании изображения',
        message: 'Попробуйте пожалуйста позже',
      });
    } finally {
    }
  };
  return (
    <Stack mt="lg" mih={650}>
      <Flex gap="md" align="center">
        <Title order={4}>Результаты генерации:</Title>
        <Tooltip label="При скачивании изображения границы товара будут убраны">
          <CircleHelp size={18} />
        </Tooltip>
      </Flex>
      <Flex justify="space-between" gap="md" wrap="wrap">
        <Flex direction="column" gap="md">
          {productImage && backgroundImage && (
            <MovingBlockCanvas
              productImage={productImage}
              backgroundImage={backgroundImage}
              x={store?.x ?? 10}
              y={store?.y ?? 10}
            />
          )}
          <Button component={Link} href="/" rightSection={<Plus />} w="fit-content">
            Выбрать новое изображение
          </Button>
        </Flex>
        <Flex direction="column" gap="md">
          <Flex align="center" gap="md" justify="end">
            <Button
              onClick={downloadImage}
              type="button"
              w="fit-content"
              leftSection={<DownloadIcon />}
              variant="outline"
            >
              Скачать оригинальное изображение
            </Button>
          </Flex>

          {/* {store?.generated_image && ( */}
          {isClient && (
            <MantineImage
              key={store?.generated_image}
              src={`data:image/png;base64,${store?.generated_image}`}
              width={512}
              height={512}
              alt=""
            />
          )}
          {/* )} */}
        </Flex>
      </Flex>
    </Stack>
  );
};
