import { GlobalUserStatusDto } from "../apis/dto/shared/user.dto.ts";

const WarningBadge = ({ status }: { status?: GlobalUserStatusDto }) => {
  const generateContent = () => {
    switch (status?.userStatus) {
      case "WARNED":
        return <div className="badge badge-warning gap-2">WARNING</div>;
      case "TIMEOUT":
        return <div className="badge badge-neutral gap-2">TIMEOUT</div>;
      default:
        return null;
    }
  };

  return (
    <>
      {status?.userStatus &&
      new Date(status?.expired).getTime() >= Date.now() ? (
        <>{generateContent()}</>
      ) : null}
    </>
  );
};

export default WarningBadge;
