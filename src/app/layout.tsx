import "@mantine/core/styles.css";
import "./globals.css";

import { ColorSchemeScript } from "@mantine/core";
import Providers from "./providers";

export const metadata = {
  title: "Voice Chat",
  description: "Голосовой разговорник с распознаванием речи"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
