import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Cloud, DownloadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="min-h-screen mx-auto max-w-[1960px] bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="sticky top-0 z-10">
        <ul className="w-full flex flex-row h-16 justify-between items-center p-4">
          <li className="flex items-center justify-center gap-2 py-3 px-4 rounded-3xl bg-background/60 hover:bg-white hover:text-black">
            <Image
              src="/camera.svg"
              alt="SnapLink Logo"
              width={24}
              height={24}
              priority
            />
            <Link className="font-medium" href="/">
              SnapLink
            </Link>
          </li>
          <li className="flex items-center gap-4">
            <div className="gap-2 py-3 px-4 rounded-3xl bg-black/60 hover:bg-white hover:text-black hover:cursor-pointer">
              <Link href={user ? "/dashboard" : "/login"}>Get Started</Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Full-Screen Hero Section */}
      <div className="min-h-screen mt-20 lg:mt-0 flex flex-col justify-center items-center px-8 ">
        <div className="flex flex-col lg:flex-row items-center gap-12 relative">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Share Your Moments,
              <span className="animate-color-change"> Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Create beautiful photo albums and share them with friends and
              family in seconds. No complicated setup, just pure simplicity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
              <Link href={user ? "/dashboard" : "/login"}>
                <Button>Start Sharing</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side image layout */}
          <div className="flex-1 relative md:mt-12 lg:mt-0">
            <div className="relative min-w-[365px] sm:w-[600px] md:w-[700px] lg:w-full  h-[500px] animate-fade-in-up animation-delay-600">
              <Image
                src="/hero_img.jpg"
                alt="Image of people laughing"
                fill
                className="object-cover brightness-110 rounded-xl"
              />
              <div className="lg:absolute absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 animate-slide-up">
                <h3 className="text-white text-sm md:text-lg font-semibold mb-2">
                  Capture the Moment
                </h3>
                <p className="text-white/80 text-sm">
                  Share your adventures with loved ones instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-16 animate-fade-in-up">
          Why Choose SnapLink?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: Share2,
              title: "Easy Sharing",
              description:
                "Share your photos with anyone, anywhere. Generate unique links in seconds.",
            },
            {
              icon: DownloadCloud,
              title: "Offline Viewing",
              description:
                "Save your favorite photos locally to access them even without an internet connection.",
            },
            {
              icon: Cloud,
              title: "Cloud Access",
              description:
                "Access your photos from any device, anytime. Always in sync.",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-6">
                <feature.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-background text-white py-12 text-center mt-20">
        <p>&copy; 2024 SnapLink. All rights reserved.</p>
        <p>Plamen Dochev</p>
      </footer>
    </div>
  );
}
