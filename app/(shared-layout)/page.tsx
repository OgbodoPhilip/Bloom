import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
   <section>
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold mb-6">
        Welcome to <AnimatedGradientText>NextPro</AnimatedGradientText>
      </h1>
      <p className="text-xl mb-8 text-gray-600">
        Your ultimate Next.js starter template with Tailwind CSS and Framer Motion.
      </p>
      <a
        href="/create"
        className="inline-flex items-center rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold hover:bg-blue-600 transition"
      >
        Get Started
        <ChevronRight className="ml-2 h-5 w-5" />
      </a>
    </div>
   </section>
  );
}
