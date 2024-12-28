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
    <div className="min-h-screen mx-auto max-w-[1960px]">
      {/* Hero Section with Video */}
      <div className="relative h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            playsInline
            preload="auto"
            muted
            poster="/poster-video.png"
            className="absolute min-w-full min-h-full w-auto  h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ aspectRatio: "16/9" }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Navigation */}
        <nav className="relative z-20">
          <ul className="w-full flex flex-row h-16 justify-between items-center p-4">
            <li className="flex items-center justify-center gap-2 py-3 px-4 rounded-3xl bg-black/60 backdrop-blur-sm hover:bg-white hover:text-black">
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
              <div className="gap-2 py-3 px-4 rounded-3xl bg-black/60 backdrop-blur-sm hover:bg-white hover:text-black hover:cursor-pointer">
                <Link href={user ? "/dashboard" : "/login"}>Get Started</Link>
              </div>
            </li>
          </ul>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-8">
          <div className="text-center rounded-xl p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Share Your Moments,
              <span className="text-primary animate-color-change">
                {" "}
                Instantly
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Create beautiful photo albums and share them with friends and
              family in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link href={user ? "/dashboard" : "/login"}>
                <Button size="lg">Start Sharing</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="bg-background">
        {/* Image Grid Section */}
        <section className="py-16 px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Capture Life&apos;s Moments
          </h2>
          <div
            id="bento-div"
            className="w-full grid grid-cols-10 max-auto auto-rows-[35rem] gap-4 p-1"
          >
            <div className="col-span-10 lg:col-span-4 group overflow-hidden rounded-xl">
              <Image
                src="/image1.jpg"
                alt="Image of people laughing"
                width={1600}
                height={900}
                className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="col-span-10 lg:col-span-6 group overflow-hidden rounded-xl">
              <Image
                src="/image2.jpg"
                alt="Image of people laughing"
                width={1600}
                height={900}
                className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="col-span-10 lg:col-span-6 group overflow-hidden rounded-xl">
              <Image
                src="/image3.jpg"
                alt="Image of people laughing"
                width={1600}
                height={900}
                className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="col-span-10 lg:col-span-4 group overflow-hidden rounded-xl">
              <Image
                src="/image4.jpg"
                width={1600}
                height={900}
                alt="Image of people laughing"
                className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <h2 className="text-3xl font-semibold text-center mb-16 animate-fade-in-up">
            Why Choose SnapLink?
          </h2>
          <div className="grid md:grid-cols-3 gap-12 px-4">
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
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex justify-center mb-6">
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Sharing?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already enjoying the simplicity
              and power of SnapLink.
            </p>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background text-white py-12 text-center mt-20">
          <p>&copy; 2024 SnapLink. All rights reserved.</p>
          <p>Plamen Dochev</p>
        </footer>
      </div>
    </div>
  );
}
