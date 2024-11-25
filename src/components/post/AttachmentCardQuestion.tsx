import { PiFile, PiTrash } from "react-icons/pi";
import { nanoid } from "nanoid";

const className: string =
  "w-20 h-20 inline-flex items-center flex-shrink-0 justify-center border rounded shadow relative";

export default function AttachmentCardQuestion({
  url,
  deleteFile = () => {},
}: {
  url: string;
  deleteFile?: () => void;
}) {
  const renderAttachment = () => {
    if (url.split(",")[0].includes("image")) {
      return (
        <>
          <div
            className={className + " cursor-pointer group"}
            onClick={deleteFile}
          >
            <img src={url} className="w-full" alt="attachment" />
            <PiTrash className="hidden group-hover:block absolute text-white z-10" />
            <div className="hidden group-hover:block absolute w-full h-full bg-black/65"></div>
          </div>
        </>
      );
    } else {
      return (
        <div
          className={className + " cursor-pointer group"}
          onClick={deleteFile}
        >
          <span className="inline-flex flex-col justify-center items-center w-full">
            <PiFile />
            <span className="w-full truncate text-xs">{nanoid(15)}</span>
            <PiTrash className="hidden group-hover:block absolute text-white z-10" />
            <div className="hidden group-hover:block absolute w-full h-full bg-black/65"></div>
          </span>
        </div>
      );
    }
  };

  return <>{renderAttachment()}</>;
}
