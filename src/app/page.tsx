import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main>
      <Navbar currentPage={"Home"}/>
      <section className="p-4">
        <h1 className="font-extrabold text-3xl mb-1">Welcome to my website</h1>
        <p>
          My name is Nicholas and I&apos;m a first year student studying at the Singapore Management University.
        </p>
      </section>
    </main>
  );
}
