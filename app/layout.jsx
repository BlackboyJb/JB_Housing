import "@/assets/styles/global.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Real Estate",
  keywords: "Rental Property Real Estate",
  description: "Find the Perfect rental Property",
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html>
        <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
