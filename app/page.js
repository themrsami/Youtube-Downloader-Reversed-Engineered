import DropdownWithDownloadButton from "@/components/DropdownWithDownloadButton";

export default function Home() {
  return (
    <>
    <div className="flex flex-col gap-4 justify-center items-center self-center h-screen">
      <h1 className="text-center text-3xl font-semibold m-2 text-white">Youtube Downloader</h1>
      <DropdownWithDownloadButton/>
    </div>
    </>
  );
}
