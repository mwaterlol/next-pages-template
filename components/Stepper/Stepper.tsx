'use client';
import { Paper, Stepper as MantineStepper, rem, Title } from '@mantine/core';
import { trim } from 'radash';
import { StepperProps } from './types';
import { useRouter } from 'next/router';

const steps = ['/', '/background', '/parameters', '/results'];

export const Stepper = ({ children }: StepperProps) => {
  const router = useRouter();

  const activeIndex = steps.findIndex((step) => trim(step, '/') === trim(router.pathname, '/'));

  return (
    <Paper
      withBorder
      shadow="md"
      w="90%"
      maw={1100}
      style={(theme) => ({
        background: theme.colors.gray[0],
        borderRadius: rem(16),
        position: 'relative',
      })}
      pt="md"
      px="2%"
      pb="xl"
    >
      <Title order={4} w="100%" style={{ textAlign: 'center' }}>
        Lerable Merffusion
      </Title>
      <MantineStepper active={activeIndex} mt="xl">
        <MantineStepper.Step label="Шаг 1" description="Загрузка товара" />
        <MantineStepper.Step label="Шаг 2" description="Результат" />
      </MantineStepper>
      {children}
    </Paper>
  );
};
