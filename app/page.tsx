import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <h1 className="text-3xl font-bold py-4">Meet AI</h1>
      <Button variant="default" >Get Started</Button>
    </div>
  );
}
