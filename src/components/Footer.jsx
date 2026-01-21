import Image from "next/image";
import { Facebook, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12 bg-white">

      {/* Top Section */}
      <div className="wrapper py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO SECTION */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/vasudhaiv_tree.png" // replace with your logo
            alt="Logo"
            width={120}
            height={60}
          />

          <p className="text-xs text-gray-500 mt-2">Powered by VASUDHEV</p>
        </div>

        {/* LANGUAGE SITES */}
        <div>
          <h3 className="font-bold text-lg mb-2">Languages Sites</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>Hindi News</li>
            <li>English News</li>
            <li>Gujarati News</li>
            <li>Marathi News</li>
            <li>Tamil News</li>
            <li>Telugu News</li>
            <li>Bangla News</li>
          </ul>
        </div>

        {/* ABOUT SECTION */}
        <div>
          <h3 className="font-bold text-lg mb-2">About</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Advertise</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Work With Us</a></li>
          </ul>
        </div>

        {/* SOCIAL ICONS */}
        <div>
          <h3 className="font-bold text-lg mb-2">Follow Us On</h3>
          <div className="flex gap-4 mt-3">
            <a href="#" className="text-blue-600"><Facebook size={28} /></a>
            <a href="#" className="text-red-600"><Youtube size={28} /></a>
            <a href="#" className="text-pink-600"><Instagram size={28} /></a>
            <a href="#" className="text-black">
              <svg
                width="28"
                height="28"
                viewBox="0 0 50 50"
                fill="currentColor"
              >
                <path d="M6 44L21 6h8L17 44h-11zM23 44L38 6h11L35 44h-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300" />

      {/* DNPA Notice */}
      <p className="text-center text-gray-600 text-sm py-4">
        This website follows the{" "}
        <span className="text-red-600 font-semibold cursor-pointer">
          DNPA's code of Conduct
        </span>
      </p>

      {/* Bottom Legal Section */}
      <p className="text-center text-xs text-gray-500 pb-6">
        Copyright © {new Date().getFullYear()} The Global Lens.
        All rights reserved. | Cookie Settings
      </p>
    </footer>
  );
}
