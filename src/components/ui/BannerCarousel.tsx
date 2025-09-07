"use client";

import { useEffect, useState } from "react";

const images = [
  "https://picsum.photos/id/1018/1200/400",
  "https://picsum.photos/id/1015/1200/400",
  "https://picsum.photos/id/1019/1200/400",
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-64 lg:h-72 overflow-hidden rounded-2xl">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`banner-${i}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
