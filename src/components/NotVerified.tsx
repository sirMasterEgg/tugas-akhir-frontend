import mail from "../assets/mail.png";

const NotVerified = () => {
  return (
    <main className="h-[90vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-2xl p-4 shadow-2xl">
        <img src={mail} className="w-24" alt="Mail logo" />
        <h1 className="font-bold text-xl">Not Verified</h1>
        <p>Please check your email to verify your account.</p>
      </div>
    </main>
  );
};
export default NotVerified;
