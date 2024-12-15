"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/components/modal";
import ExternalLinkButton from "@/components/ExternalLinkButton";
import DownloadButton from "@/components/DownloadButton";
import NextButton from "@/components/NextButton";
import PreviousButton from "./PreviousButton";
import { ImageS3 } from "@/app/lib/definitions";

export default function PhotoModalClient({
  images,
  initialIndex,
}: {
  images: ImageS3[];
  initialIndex: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const currentImage = images[currentIndex];

  return (
    <Modal>
      <Image
        width={720}
        height={480}
        alt={`Image ${currentIndex + 1} of ${images.length}`}
        src={currentImage.src}
        className="w-full h-full transform brightness-110 transition will-change-auto object-cover"
      />
      <ExternalLinkButton link={currentImage.src} />
      <DownloadButton url={currentImage.src} />
      <NextButton onNext={handleNext} />
      <PreviousButton onPrevious={handlePrevious} />
    </Modal>
  );
}
