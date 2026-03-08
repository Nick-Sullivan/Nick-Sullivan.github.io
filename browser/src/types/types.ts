import type { ImageMetadata } from "astro";

export interface ImageItem {
  src: ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fetchpriority?: "high" | "low" | "auto";
}

export interface Message {
  text: string;
  author_name: string;
}
