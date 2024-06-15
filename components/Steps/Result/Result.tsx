import { Button, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { MovingBlockCanvas } from './MovingBlockCanvas';

export const Result = () => (
  <Stack mt="lg">
    <Title order={4}>Результаты генерации:</Title>
    <MovingBlockCanvas />
    <Button component={Link} href="/">
      Выбрать новое изображение
    </Button>
  </Stack>
);
