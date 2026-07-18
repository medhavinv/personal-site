import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Approach } from "@/components/Approach";
import { Work } from "@/components/Work";
import { Teaching } from "@/components/Teaching";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Chat } from "@/components/Chat";
import { Analytics } from "@/components/Analytics";

export default function Home() {
  return (
    <div className="max-w-full overflow-x-clip">
      <Nav />
      <main className="mx-auto max-w-content px-8">
        <Hero />
        <Journey />
        <Approach />
        <Work />
        <Teaching />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Chat />
      <Analytics />
    </div>
  );
}
