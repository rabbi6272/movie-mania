import localFont from "next/font/local";
import { Nunito } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const ttTrailers = localFont({
  src: "./tttrailer.ttf",
  display: "swap",
  style: "italic",
  weight: "800",
});
