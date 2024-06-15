/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
//@ts-nocheck
import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from 'react-konva';
import Link from 'next/link';
import { Button, LoadingOverlay, Text, Flex, Paper, Loader } from '@mantine/core';
import { DownloadIcon, Plus, RefreshCcw } from 'lucide-react';
import { useStepperForm } from '@/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { ApiResponse } from '@/types';
import { resultStore } from '@/store';

export const MovingBlockCanvas = ({
  backgroundImage,
  productImage,
  x,
  y,
}: {
  backgroundImage: HTMLImageElement | undefined;
  productImage: HTMLImageElement | undefined;
  x: number;
  y: number;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { stepperForm } = useStepperForm();

  const stageRef = useRef();
  const rectRef = useRef();
  const imageRef = useRef();
  const trRef = useRef();

  const checkBoundaries = (node) => {
    const stage = node.getStage();
    const box = node.getClientRect();
    const width = stage.width();
    const height = stage.height();

    if (box.x < 0) {
      node.x(node.x() - box.x);
    }
    if (box.y < 0) {
      node.y(node.y() - box.y);
    }
    if (box.x + box.width > width) {
      node.x(node.x() - (box.x + box.width - width));
    }
    if (box.y + box.height > height) {
      node.y(node.y() - (box.y + box.height - height));
    }
  };

  const getImagePositionAndScale = () => {
    if (!productImage) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    const rectNode = rectRef.current;
    if (!rectNode) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    const rectWidth = rectNode.width();
    const rectHeight = rectNode.height();

    const imageWidth = productImage.width;
    const imageHeight = productImage.height;

    const imageAspectRatio = imageWidth / imageHeight;
    const rectAspectRatio = rectWidth / rectHeight;

    let scaleX, scaleY, offsetX, offsetY;

    if (rectAspectRatio > imageAspectRatio) {
      scaleX = rectHeight / imageHeight;
      scaleY = rectHeight / imageHeight;
    } else {
      scaleX = rectWidth / imageWidth;
      scaleY = rectWidth / imageWidth;
    }

    offsetX = (rectWidth - imageWidth * scaleX) / 2;
    offsetY = (rectHeight - imageHeight * scaleY) / 2;

    return { x: offsetX, y: offsetY, scaleX, scaleY };
  };

  const downloadImage = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${stepperForm.productPicture?.fileName.split('.')[0]}_background.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 500);
  };

  useEffect(() => {
    const transformer = trRef.current;
    if (transformer) {
      transformer.nodes([rectRef.current, imageRef.current].filter(Boolean));
      transformer.getLayer().batchDraw();
    }
  });

  const [loading, setLoading] = useState(false);

  const regenerate = async () => {
    if (!stepperForm?.productPicture?.fileData) {
      notifications.show({
        color: 'red',
        title: 'Произошла ошибка при генерации фона',
        message: 'Попробуйте пожалуйста позже',
      });

      return;
    }
    setLoading(true);
    try {
      const response: { data: ApiResponse } = await axios.post('/api/process-image', {
        image: stepperForm.productPicture?.fileData
          .replace(/^data:image\/jpeg;base64,/, '')
          .replace(/^data:image\/png;base64,/, '')
          .replace(/^data:image\/gif;base64,/, ''),
      });

      resultStore.set(response.data);
    } catch (error) {
      console.log(error);
      notifications.show({
        color: 'red',
        title: 'Произошла ошибка при генерации фона',
        message: 'Попробуйте пожалуйста позже',
      });
    } finally {
      setLoading(true);
    }
  };
  return (
    <>
      <Flex align="center" gap="md" justify="space-between">
        <Button
          onClick={downloadImage}
          type="button"
          w="fit-content"
          leftSection={<DownloadIcon />}
          variant="outline"
        >
          Скачать изображение
        </Button>
        <Button onClick={regenerate} rightSection={<RefreshCcw />} variant="outline">
          Перегенерация
        </Button>
      </Flex>
      <LoadingOverlay
        visible={isDownloading || loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        style={{ width: 514, height: 514, top: 114, left: '50%', transform: 'translate(-50%, 0)' }}
      />
      <Stage width={512} height={512} style={{ width: 512 }} ref={stageRef}>
        <Layer>
          <KonvaImage image={backgroundImage} width={512} height={512} />

          <Rect
            x={x}
            y={y}
            width={productImage?.width}
            height={productImage?.height}
            draggable
            ref={rectRef}
            onDragMove={() => checkBoundaries(rectRef.current)}
            onTransform={() => checkBoundaries(rectRef.current)}
            onTransformEnd={() => checkBoundaries(rectRef.current)}
          />
          <KonvaImage
            image={productImage}
            width={productImage?.width}
            height={productImage?.height}
            x={x}
            y={y}
            scaleX={getImagePositionAndScale().scaleX}
            scaleY={getImagePositionAndScale().scaleY}
            draggable
            ref={imageRef}
            onDragMove={() => {
              checkBoundaries(imageRef.current);
            }}
            onTransform={() => {
              checkBoundaries(imageRef.current);
            }}
            onTransformEnd={() => {
              checkBoundaries(imageRef.current);
            }}
          />
          <Transformer
            ref={trRef}
            borderStrokeWidth={1}
            boundBoxFunc={(oldBox, newBox) => {
              const stage = rectRef.current.getStage();
              const width = stage.width();
              const height = stage.height();

              if (newBox.x < 0 || newBox.y < 0) {
                return oldBox;
              }

              if (
                newBox.x < 0 ||
                newBox.y < 0 ||
                newBox.x + newBox.width > width ||
                newBox.y + newBox.height > height
              ) {
                return oldBox;
              }

              return newBox;
            }}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            borderEnabled={!isDownloading}
            resizeEnabled={!isDownloading}
            flipEnabled={!isDownloading}
            rotateEnabled={!isDownloading}
          />
        </Layer>
      </Stage>
    </>
  );
};
