// import "./globals.css";
import "leaflet/dist/leaflet.css";


export const metadata = {
  title: "Smart City",
  description: "Made by Quadrant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
