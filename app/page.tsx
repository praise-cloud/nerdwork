"use client"

import NavigationBar from "@/components/common/navigationBar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const communityImages = [
  "/images/community-1.svg",
  "/images/community-2.svg",
  "/images/community-3.svg",
  "/images/community-4.svg",
];

export default function Home() {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const topics = [
    "Pop Culture",
    "Video Games",
    "Comics",
    "Theater",
    "Anime",
    "Books",
    "Movies",
    "Music",
  ];

  return (
    <div className="flex flex-col w-full h-full mx-auto justify-center items-center">
      <div className="fixed top-0 left-0 w-full z-20 bg-transparent">
        <NavigationBar />
      </div>

      <section className="relative w-full h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.svg"
            alt="Nerdwork Hero"
            fill
            className="object-cover brightness-60"
            priority
          />
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/100 via-black/80 md:via-black/70 to-transparent" />

        <div className="relative z-20 px-6 md:px-5 text-center max-w-2xl w-full pt-20 md:pt-50 mt-50 ">
          <div className="inline-block bg-blue-800 text-sm font-medium rounded-full px-4 py-1 mb-4">
            Comic con 2025 is here,{" "}
            <Link href="/sign-up" className="underline">
              Register now
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 font-obo">
            WHERE PASSION <br className="hidden sm:inline" /> MEETS COMMUNITY
          </h1>

          <p className="text-sm md:text-base text-gray-300 mb-6">
            From comics to conventions, find your people and immerse yourself in
            everything you love.
          </p>

          <div className="flex flex-row items-center justify-center gap-2 mb-8">
            <Input
              type="email"
              placeholder="Email address"
              className="w-full max-w-sm bg-gray-800 border-none focus-visible:ring-2"
            />
            <Button className="bg-primary">Sign Up</Button>
          </div>

          <div className="flex w-full mx-auto max-w-sm md:max-w-xs justify-center items-center">
            <p className="text-xs md:text-sm text-gray-400">
              Step into the ultimate nerd verse: <br className="sm:hidden" />
              Explore exclusive comics on the Nerdwork+ platform.{" "}
              <br className="hidden sm:inline" />
              Attend the most exciting comic conventions.{" "}
              <br className="hidden sm:inline" />
              Connect with one of the largest nerd communities.
            </p>
          </div>
        </div>
      </section>

      <section className="relative w-full pt-10 pb-10 bg-black text-white md:px-50 xl:px-80 px-8">
        <div className="flex flex-row gap-4 md:gap-6 justify-between items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight font-obo">
              PEOPLE <br /> PASSION <br /> COMMUNITY
            </h2>
            <p className="text-white mb-6 max-w-sm w-full">
              No matter your passion, there's a community for you.
            </p>
            <div className="group relative">
              <ul className="space-y-3 mb-4 font-medium text-[18px] md:text-xl">
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="text-gray-400 hover:text-white cursor-pointer relative md:w-30"
                    onMouseEnter={() => setHoveredTopic(topic)}
                    onMouseLeave={() => setHoveredTopic(null)}
                  >
                    {topic}
                    {hoveredTopic === topic && (
                      <div className="absolute left-30 top-1/2 -translate-y-1/2 ml-4">
                        <Button size="sm">Join Community</Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
            {communityImages.map((src, idx) => {
              const rotationClass =
                idx % 2 === 0 ? "rotate-[1deg]" : "-rotate-[2deg]";
              return (
                <div
                  key={idx}
                  className={`object-cover overflow-hidden rounded-lg shadow-lg ${rotationClass}`}
                >
                  <Image
                    src={src}
                    alt={`community-${idx}`}
                    width={300}
                    height={300}
                    className="object-cover w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

       {/* African Storytelling Section */}
       <section
        className="relative w-full py-20 before:absolute before:inset-0 before:bg-black/100 before:z-0"
        style={{
          backgroundImage: 'url(/images/comic-gallery-background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto -mb-20 px-6 mt-5">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight text-left md:text-center font-obo">
            REDEFINING <br/> AFRICAN <br/> STORYTELLING
          </h2>
          <p className="text-gray-300 mb-6 text-left md:text-center">
            Step into a universe of African comics like never before.
          </p>
          <div className="flex flex-row jsutify-start md:justify-center gap-4">
            <Button className="bg-blue-600">Go to Nerdwork+</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>

        {/* Comic Covers Gallery */}
        <div className="relative z-0 flex flex-col">
          {[
            "/images/comic-col-1.svg",
            "/images/comic-col-2.svg",
            "/images/comic-col-3.svg",
          ].map((src, idx) => (
            <div key={idx} className="flex flex-col w-full h-25 md:h-50 lg:h-[420px]">
              <Image
                src={src}
                alt={`comic-${idx}`}
                width={240}
                height={360}
                className="object-cover w-full h-52 md:h-[600px] lg:h-[900px] "
              />
            </div>
          ))}
        </div>


        {/* Feature Summary */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-1 gap-5 mt-12 text-left md:text-center px-8">
        <div className="flex mx-auto max-w-3xl w-full justify-center items-center">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-left md:text-center font-obo">FROM CREATORS DEVOTED READERS.
          <br className="md:hidden" /> THERE'S A STORY FOR EVERYONE
          </h2>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-9 lg:gap-12 mt-5 text-left md:text-start md:mx-30 xl:mx-90">
          {[
            {
              title: "Discover African Stories",
              desc: "Immerse yourself in authentic African narratives, from folklore to futuristic adventures."
            },
            {
              title: "Better Reading Experience",
              desc: "Seamless, immersive, and tailored for your comfort, enjoy comics like never before."
            },
            {
              title: "Creator Management",
              desc: "Empowering African creators with the tools to bring stories to life."
            },
            {
              title: "African Focused Voice",
              desc: "Bringing African culture, creativity, and perspective to the world."
            }
          ].map((feature, idx) => (
            <div key={idx} className="flex md:flex-col space-x-4">
              <h4 className="text-2xl md:text-4xl font-bold mb-2">{idx + 1}</h4>
                <div className="flex flex-col items-start justify-start gap-2">
                <h5 className="font-semibold text-[18px] md:text-xl">{feature.title}</h5>
                <p className="text-sm text-gray-400 md:text-[18px]">{feature.desc}</p>
                </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* comic con */}
    <section className="relative w-full py-24 px-6 bg-black text-white md:max-w-7xl">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-5 max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight flex max-w-3xl font-obo">
            EPIC COMIC CONS <br />& IRL MEETUPS
          </h2>
          <p className="text-gray-400 mb-6">
            Meet your favorite creators, cosplay icons, and fellow fans.
          </p>
          <div className="flex flex-col md:w-xs gap-4">
            <Button className="bg-blue-600">Register for comic con 2025</Button>
            <Button variant="outline">See last year's comic con</Button>
          </div>
        </div>

        {/* Image Stack */}
        <div className="relative w-full h-full md:h-[500px] flex-1 mb-50 md:mb-80">
          <div className="absolute top-0 md:top-0 right-0 md:right-0 shadow-lg rounded overflow-hidden">
            <Image src="/images/comic-con-1.jpg" alt="con-img-1" width={480} height={240} className="object-cover" />
          </div>
          <div className="absolute top-[20px] md:top-[140px] left-[20%] md:left-[10%] shadow-lg rounded overflow-hidden -rotate-[2deg]">
            <Image src="/images/comic-con-2.jpg" alt="con-img-2" width={480} height={240}  className="object-cover" />
          </div>
          <div className="absolute top-0 md:top-[350px]  right-0 md:right-[10%] rounded overflow-hidden rotate-[5deg]">
            <Image src="/images/comic-con-3.png" alt="con-img-3" width={480} height={240}  className="object-cover" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="md:absolute md:top-[24%] md:left-[2%] grid grid-cols-2 md:grid-cols-1 gap-6 mt-20 max-w-7xl mx-auto text-center">
        {[{
          number: "5000",
          label: "ATTENDEES",
          sub: "in 3 years"
        }, {
          number: "300",
          label: "MEMBERS",
          sub: "Registered"
        }, {
          number: "20+",
          label: "STALLS",
          sub: "Booths and Activities"
        }, {
          number: "4Y",
          label: "RUNNING",
          sub: "Registered Members"
        }].map((stat, idx) => (
          <div key={idx} className="flex flex-col items-start ">
            <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</h3>
            <p className="uppercase font-extrabold tracking-wide text-2xl md:text-4xl">{stat.label}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Sponsors */}
      <div className="mt-16 flex flex-col items-start mx-auto max-w-7xl">
        <p className="text-sm text-gray-400 mb-6">Sponsors of comic con 2024</p>
        <div className="grid grid-cols-3 space-y-8 md:space-y-20 md:grid-cols-5 justify-start items-start space-x-5 md:space-x-40 ">
          {["carry1st-icon", "itel-icon", "filmhouse-icon", "tribe-icon", "monster-icon","carry1st-icon", "itel-icon", "filmhouse-icon", "tribe-icon", "monster-icon"]
            .map((name, idx) => (
              <div className="" key={idx}>
                <Image
                src={`/icons/${name}.svg`}
                alt={name}
                width={100}
                height={50}
                className="object-contain h-10"
              />
              </div>
            ))}
        </div>
      </div>
    </section>

    <section className="relative w-full h-screen text-white flex items-center justify-center overflow-hidden mt-10">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nerd-community.svg"
          alt="Crowd celebrating"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center z-10 text-center max-w-3xl px-6 items-start justify-start md:items-center mx-auto">

        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-left md:text-center font-obo">
          PASSION MEETS <br /> COMMUNITY
        </h2>
        <p className="flex text-gray-300 text-base md:text-lg md:max-w-[540px] mb-6 text-left md:text-center">
          Where your passions bring people together. Our goal is to create the best ecosystem for storytellers, artists, and nerds in Africa.
        </p>
        <Button>Our vision</Button>
      </div>
    </section>
    <section className="relative w-full bg-black text-white px-6 py-20 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex flex-col justify-start">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight font-obo">
            FREQUENTLY <br /> ASKED <br /> QUESTIONS
          </h2>
          <p className="text-gray-300 mb-6">
            What fans everywhere have been asking. <br /> Can’t find the answer? Ask us directly!
          </p>
          <Button variant="outline" className="w-fit">Contact Support</Button>
        </div>

        {/* Right Section */}
        <div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1">
              <AccordionTrigger>What is Nerdwork all about?</AccordionTrigger>
              <AccordionContent>
                Nerdwork is a community of creatives, enthusiasts and fun loving people who are looking to celebrate art, pop culture, and entertainment. The comic convention will feature panels, exhibits, cosplay, games, and guest appearances from creators and celebrities.
              </AccordionContent>
            </AccordionItem>
            {["Do I need to be a weeb/nerd to attend a comic con?",
              "Do I have to wear a costume?",
              "Can I buy tickets at the door",
              "What activities can I expect at a comic con?",
              "Are there age restrictions for attendees?",
              "Can I meet my favorite creators or celebrities?",
              "Will there be merchandise available for purchase?",
              "Are pets allowed at the event?",
              "What are the health and safety guidelines for attendees?"]
            .map((question, idx) => (
              <AccordionItem key={idx} value={`q${idx + 2}`}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>Details coming soon.</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>

    {/* Footer Area */}
    <div className="mt-20 flex flex-col md:flex-row justify-center items-center w-full max-w-7xl mx-auto gap-5">
        <div className="flex flex-col md:w-full mb-10 md:mb-0">
        <Image
              src="/icons/logo-icon.svg"
              alt="Nerdwork logo"
              width={150}
              height={150}
              className="mb-3"
            />
            <p className="mb-3">Join to stay up to date</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-gray-900" />
              <Button>Sign Up</Button>
            </div>
        </div>

      <div className="flex hidden md:flex ">
      <Image
            src="/images/footer-image.svg"
            alt="Mascot character"
            width={900}
            height={600}
            className="object-contain"
          />
      </div>

      <div className="flex gap-10">
          <div className="flex flex-col w-full">
                <p className="font-semibold mb-3 flex w-full w-20 md:w-25">Qiuck Links</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Home</li>
                  <li>Nerdwork+</li>
                  <li>Events</li>
                  <li>Company</li>
                </ul>
              </div>
          <div className="flex flex-col w-full">
                <h4 className="font-semibold mb-3 flex">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Press</li>
                  <li>Blog</li>
                </ul>
              </div>
          <div className="flex flex-col w-full">
                <h4 className="font-semibold mb-3 flex">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Contact Us</li>
                  <li>Help Center</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Services</li>
                </ul>
          </div>
      </div>

            <div className="flex md:hidden justify-center items-center w-full mx-auto gap-39 my-15">
                <h4 className="font-semibold">NERDWORK</h4>
                <div className="flex gap-3">
                  <Image
                    src="/icons/facebook-icon.svg"
                    alt="facebook logo"
                    width={24}
                    height={24}
                    className=" rounded-lg"
                  />
                  <Image
                    src="/icons/instagram-icon.svg"
                    alt="facebook logo"
                    width={24}
                    height={24}
                    className="rounded-lg"
                  />
                  <Image
                    src="/icons/x-icon.svg"
                    alt="facebook logo"
                    width={24}
                    height={24}
                    className=" rounded-lg"
                  />
                </div>
            </div>
      </div>
    </div>
  );
}
