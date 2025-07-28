import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Smart City",
  description: "Made by Quadrant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Navbar/>
      {children}
      </body>
    </html>
  );
}
