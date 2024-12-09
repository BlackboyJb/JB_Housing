import "@/assets/styles/global.css";

export const metadata = {
  title: "Real Estate",
  keywords: "Rental Property Real Estate",
  description: "Find the Perfect rental Property",
};

const MainLayout = ({ children }) => {
  return (
    <html>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default MainLayout;
