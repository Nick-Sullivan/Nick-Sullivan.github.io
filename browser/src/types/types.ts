import type { ImageMetadata } from "astro";

export interface ImageItem {
  src: ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export interface Message {
  text: string;
  author_name: string;
}
