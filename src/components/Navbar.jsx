"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import Link from "next/link";

const categoryItems = [
  "भारत",
  "ऑटोमोबाईल",
  "टेक्नोलॉजी ",
  "लाइफस्टाइल",
  "बिजनेस",
  "हेल्थ",
  "क्रिकेट",
  "दुनिया",
  "एजुकेशन",
  "खेल",
  "मनोरंजन",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div
        className="relative w-full h-[100px] md:h-[150px] bg-cover bg-center"
        // style={{
        //   backgroundImage:
        //     "url('/vasudhaiv_tree.png')",
        // }}
      >
        {/* Logo in center */}
        {/* <div className="absolute md:top-30 top-30 inset-0 flex justify-center items-end pb-4 z-100">
          <div className="w-[120px] border-8 border-orange-600 h-[120px] bg-white rounded-full shadow-lg flex justify-center items-center overflow-hidden">
            <Link href='/'>
            <Image
              src="/vasudhaiv_tree.png"
              alt="The Global Lens"
              width={130}
              height={130}
              className="rounded-full"
            />
              </Link>
          </div>
        </div> */}
        <img src="/vasudhaiv_tree.png" alt="vasudhev.com"  className="h-full m-auto"/>
      </div>

      {/* Navigation Menu */}
      <nav className="w-full bg-white border-b-2 border-orange-500 shadow-sm sticky top-0 z-50">
        <div className="wrapper  bg-gray-100  h-8 flex justify-between items-center">
          {/* Desktop Menu */}
          <Link href="/" className="hidden md:flex gap-8 text-gray-700 font-semibold text-sm m-auto hover:text-orange-500">होम</Link>
          {categoryItems.map((item, index) => (
            <ul
              key={index}
              className="hidden md:flex gap-8 text-gray-700 font-semibold text-sm m-auto "
            >
              <li>
                <a
                  href={`/category/${item}`}
                  className="capitalize hover:text-orange-500"
                >
                  {item}
                </a>
              </li>
            </ul>
          ))}

          
        </div>

       
      </nav>
        <nav className="md:hidden overflow-x-auto flex gap-3 py-2  px-1 border-b border-gray-400">
            {categoryItems.map((item, index) => (
            <ul
              key={index}
              className="md:hidden  gap-8 text-gray-700 font-medium"
            >
              <li >
                <a
                  href={`/${item}`}
                  className="capitalize hover:text-orange-500"
                >
                  {item}
                </a>
              </li>
            </ul>
          ))}

        </nav>
    </>
  );
}
