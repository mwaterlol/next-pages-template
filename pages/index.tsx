import { notifications } from '@mantine/notifications';
import { Flex, Loader, LoadingOverlay, Paper, rem, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Actions, ProductForm, ProductFormData, Stepper } from '@/components';
import { resultStore } from '@/store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ApiResponse } from '@/types';

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    'Вырезаем фон с изображения товара',
    'Генерируем фон для товара',
    'Отправляем фон',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [loadingTextIndex]);

  const onSubmit = async (data: ProductFormData) => {
    notifications.clean();
    setLoading(true);
    try {
      resultStore.set(undefined);
      const response: { data: ApiResponse } = await axios.post('/api/process-image', {
        image: data.productPicture.fileData
          .replace(/^data:image\/jpeg;base64,/, '')
          .replace(/^data:image\/png;base64,/, '')
          .replace(/^data:image\/gif;base64,/, ''),
      });

      resultStore.set(response.data);
      router.push('/results');
    } catch (error) {
      console.log(error);
      setLoading(false);
      setTimeout(
        () =>
          notifications.show({
            color: 'red',
            title: 'Произошла ошибка при генерации фона',
            message: 'Попробуйте пожалуйста позже',
          }),
        100
      );
    }
  };

  return (
    <Stepper>
      <ProductForm onSubmit={onSubmit} actions={<Actions backButtonDisabled />} />
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ blur: 2 }}
        style={{ borderRadius: rem(16) }}
        loaderProps={{
          children: (
            <Paper
              shadow="sm"
              p="md"
              style={(theme) => ({
                border: `1px solid ${theme.colors.gray[5]}`,
              })}
              radius="lg"
            >
              <Flex align="center" direction="column" gap={10}>
                <Loader />
                <Text size="lg">{loadingTexts[loadingTextIndex]}</Text>
              </Flex>
            </Paper>
          ),
        }}
      />
    </Stepper>
  );
};

export default HomePage;
