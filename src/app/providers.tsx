"use client";

import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "md",
  fontFamily: "system-ui, -apple-system, sans-serif"
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
