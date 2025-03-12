import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20 md:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;