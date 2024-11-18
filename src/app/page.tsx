// src/app/page.tsx
import { ResumeBuilder } from "@/components/ui/resume-builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ResumeBuilder />
    </main>
  );
}