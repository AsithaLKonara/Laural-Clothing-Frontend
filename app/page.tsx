import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 px-[120px] text-center">
        <h1 className="text-4xl font-bold mt-10">Welcome to Laural Clothing</h1>
      </div>
    </main>
  );
}
