import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="min-h-[calc(100vh-13rem)]">{children}</main>
      <Footer />
    </div>
  );
}
