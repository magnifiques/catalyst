import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link
          href="/"
          className="flex flex-row gap-4 items-center justify-center"
        >
          <Image
            src="/assets/icons/logo.png"
            alt="logo"
            width={50}
            height={50}
          />
          <p className="text-xl font-bold text-yellow-600">Catalyst</p>
        </Link>

        <p>
          Created with 💛, by{" "}
          <Link
            href="https://github.com/magnifiques"
            className="text-purple-600 hover:text-yellow-300"
            target="__blank"
          >
            Magnifiques
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
