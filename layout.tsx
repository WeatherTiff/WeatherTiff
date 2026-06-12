import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WeatherTiff - Real-Time Weather App",
  description: "WeatherTiff: Professional weather app with radar, alerts, and hourly forecasts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
