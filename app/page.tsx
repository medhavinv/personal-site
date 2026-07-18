import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="max-w-full overflow-x-hidden">
      <Nav />
      <main className="mx-auto max-w-content px-8">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
