import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import DropdownWithDownloadButton from "@/components/DropdownWithDownloadButton";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center self-center h-screen">
        <h1 className="text-center text-3xl font-semibold m-2 text-white block">Youtube Downloader <p className='text-sm'>Reversed Engineered</p></h1>
        <h2>Made with ♥ by themrsami</h2>
        <div className="flex space-x-4 m-4">
          <Link href="https://github.com/themrsami" passHref target="_blank">
              <FaGithub className="text-white text-2xl" />
          </Link>
          <Link href="https://instagram.com/themrsami" passHref target="_blank">
              <FaInstagram className="text-white text-2xl" />
          </Link>
          <Link href="https://linkedin.com/in/usama-nazir" passHref target="_blank">
              <FaLinkedin className="text-white text-2xl" />
          </Link>
        </div>
        <DropdownWithDownloadButton />
      </div>
    </>
  );
}
