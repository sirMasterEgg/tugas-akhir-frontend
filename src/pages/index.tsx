import Navbar from "../components/Navbar.tsx";
import { TypeAnimation } from "react-type-animation";
import illustration from "../assets/illustration.svg";
import { RouteEnum } from "../enums/route.enum.ts";

const IndexPage = () => {
  return (
    <>
      <Navbar />
      <main className="h-[90vh] flex items-center justify-center">
        <aside className="md:w-1/2 md:pl-10">
          <h1 className="font-bold text-3xl lg:text-4xl xl:text-6xl">
            Welcome To "Tanya!"
          </h1>
          <TypeAnimation
            sequence={[
              "Question and Answer Platform",
              1000,
              "Ask and Answer Questions Together",
              1000,
              "Welcome abroad",
              1000,
            ]}
            speed={40}
            className="text-center text-xl md:text-3xl xl:pl-2"
            repeat={Infinity}
          />
          <div className="mt-5 text-center md:text-left xl:pl-2">
            <a href={RouteEnum.LOGIN} className="btn btn-primary">
              Let's Get Started !
            </a>
          </div>
        </aside>
        <div className="hidden md:w-1/2 md:flex md:items-center md:justify-center">
          <div
            style={{
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              backgroundColor: "rgba(70,58,162,0.25)",
              width: "50rem",
              height: "35rem",
            }}
            className="flex items-center justify-center"
          >
            <img src={illustration} alt="Illustration" />
          </div>
        </div>
      </main>
    </>
  );
};
export default IndexPage;
