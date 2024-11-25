import { getInitialProfileImageSrc } from "../helpers/initial-profile-image.ts";

export default function ProfilePicture({
  url,
  name,
  fontSize = "text-4xl",
}: {
  url?: string;
  name: string;
  fontSize?: string;
}) {
  return (
    <>
      {url ? (
        <img src={url} className="rounded-full" alt="Profile picture" />
      ) : (
        <div className="avatar static placeholder w-full h-full">
          <div className="bg-blue-600 text-white rounded-full">
            <span className={`${fontSize}`}>
              {getInitialProfileImageSrc(name)?.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
