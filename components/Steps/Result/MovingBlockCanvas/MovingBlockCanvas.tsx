/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
//@ts-nocheck
import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

import { Button, LoadingOverlay, Group } from '@mantine/core';
import { DownloadIcon, RefreshCcw } from 'lucide-react';
import lampSrc from '../../../../assets/Lamp.png';
import backgroundImageSrc from '../../../../assets/bg.jpeg';
import { useResult, useStepperForm } from '@/hooks';
import { bg, image } from './bg';

export const MovingBlockCanvas = () => {
  const [isDownlaoding, setIsDownloading] = useState(false);
  const { store } = useResult();
  const { stepperForm } = useStepperForm();

  const stageRef = useRef();

  const rectRef = useRef();

  const imageRef = useRef();

  const trRef = useRef();

  const [productImage, loadingProduct] = useImage(`data:image/jpeg;base64,${store?.product}`);
  const [backgroundImage, loadingBackground] = useImage(
    `data:image/jpeg;base64,${store?.background}`
  );

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

  useEffect(() => console.log(1));
  useEffect(() => {
    const tr = trRef.current;
    if (tr) {
      tr.nodes([rectRef.current, imageRef.current].filter(Boolean));
      tr.getLayer().batchDraw();
    }
  });

  const getImagePositionAndScale = () => {
    if (!productImage || loadingProduct !== 'loaded') return { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    if (!rectRef || !rectRef.current) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    const rect = rectRef.current;
    const rectWidth = rect.width();
    const rectHeight = rect?.height();

    const imageAspectRatio = productImage.width / productImage.height;
    const rectAspectRatio = rectWidth / rectHeight;

    let scaleX;
    let scaleY;
    if (rectAspectRatio > imageAspectRatio) {
      scaleX = rectWidth / productImage.width;
      scaleY = rectWidth / productImage.width;
    } else {
      scaleX = rectHeight / productImage.height;
      scaleY = rectHeight / productImage.height;
    }

    const x = (rectWidth - productImage.width * scaleX) / 2;
    const y = (rectHeight - productImage.height * scaleY) / 2;

    return { x, y, scaleX, scaleY };
  };

  const downloadImage = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `${stepperForm.productPicture?.fileName}_background.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 500);
  };

  return (
    <>
      <Group>
        <Button
          onClick={downloadImage}
          type="button"
          w="fit-content"
          leftSection={<DownloadIcon />}
          variant="outline"
        >
          Скачать изображение
        </Button>
      </Group>
      <LoadingOverlay
        visible={isDownlaoding}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        style={{ width: 514, height: 514, top: 114, left: '50%', transform: 'translate(-50%, 0)' }}
      />
      {backgroundImage && productImage && (
        <Stage width={512} height={512} style={{ width: 512 }} ref={stageRef}>
          <Layer>
            <KonvaImage image={backgroundImage} width={512} height={512} />

            <Rect
              x={store?.x}
              y={store?.y}
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
              x={rectRef.current?.x() + getImagePositionAndScale().x}
              y={rectRef.current?.y() + getImagePositionAndScale().y}
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
              // borderStroke="black"
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
              borderEnabled={!isDownlaoding}
              resizeEnabled={!isDownlaoding}
              flipEnabled={!isDownlaoding}
              rotateEnabled={!isDownlaoding}
            />
          </Layer>
        </Stage>
      )}
    </>
  );
};
