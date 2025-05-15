"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {navigationItems} from "@/lib/navigationLinks"


export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full z-50">
      <nav className="flex items-center justify-between px-5 py-6 md:px-10 relative">
        {/* Logo & Menu Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/">
            <Image
              src="/icons/logo-icon.svg"
              alt="logo"
              width={130}
              height={130}
              className="cursor-pointer"
            />
          </Link>

          <div className="md:hidden ml-auto">
            <Image
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              src="/icons/menu-icon.svg"
              alt="menu"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 items-center">
          {navigationItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="text-white font-normal text-md md:text-sm lg:text-md hover:text-gray-300 transition"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Button className="bg-blue-600">Login</Button>
          <Button>Sign Up</Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black bg-opacity-90 px-5 py-6 flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white font-medium hover:text-gray-300 transition"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 mt-4">
              <Button >Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
