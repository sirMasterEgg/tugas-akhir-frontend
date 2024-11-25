import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PiFile } from "react-icons/pi";

const className: string =
  "w-20 h-20 inline-flex items-center flex-shrink-0 justify-center border rounded shadow";

export default function AttachmentCard({ url }: { url: string }) {
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    const fetchAttachment = async () => {
      const response = await axios.get(url);
      const responseHeader =
        (
          response.headers["Content-Type"] || response.headers["content-type"]
        )?.toString() ?? "";

      setFileType(responseHeader);
    };

    if (url.split(".").pop()?.length === 3) {
      switch (url.split(".").pop()) {
        case "mp4":
          setFileType("video/mp4");
          break;
        case "pdf":
          setFileType("application/pdf");
          break;
        case "jpg":
          setFileType("image/jpg");
          break;
        case "jpeg":
          setFileType("image/jpeg");
          break;
        case "png":
          setFileType("image/png");
          break;
        default:
          fetchAttachment();
          break;
      }
    } else {
      fetchAttachment();
    }
  }, [url]);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const renderAttachment = () => {
    if (fileType.includes("image")) {
      return (
        <>
          <div
            onClick={() => modalRef.current?.showModal()}
            className={className + " cursor-pointer"}
          >
            <img
              src={url}
              onError={() => setFileType("unknown")}
              className="w-full"
              alt="attachment"
            />
          </div>
          <dialog ref={modalRef} className="modal">
            <div className="modal-box">
              <img src={url} alt="attachment-preview" />
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </>
      );
    } else {
      return (
        <a href={url} className={className} target="_blank">
          <span className="inline-flex flex-col justify-center items-center w-full">
            <PiFile />
            <span className="w-full truncate text-xs">
              {url.split("/").pop()}
            </span>
          </span>
        </a>
      );
    }
  };

  return <>{renderAttachment()}</>;
}
