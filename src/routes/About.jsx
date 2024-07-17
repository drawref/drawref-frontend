import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

import logo from "../assets/logo-dark.svg";

function About() {
  return (
    <div className="App bg-white">
      <TheHeader />
      <div id="content" className="bg-white text-center text-defaultText">
        <h1 className="mb-3 mt-10 flex items-center justify-center gap-2 text-3xl font-semibold">
          About
          <img src={logo} alt="DrawRef logo" />
        </h1>
        <div className="mx-4 mb-8 mt-6 flex max-w-full items-start justify-center gap-6">
          <div className="basic-formatting box-border flex w-[35rem] max-w-full flex-col gap-3 border-[5px] border-slate-200 px-6 py-6 text-left text-lg shadow-card">
            <p>Hi there! So what is DrawRef?</p>
            <p>
              Basically, <a href="https://github.com/danieloaks/drawref-backend">the software</a> lets you import your
              own reference images and have them presented on a timed basis. Here are a few other sites that let you do
              the same thing:
            </p>
            <ul className="ml-6 list-disc">
              <li>
                <a href="http://reference.sketchdaily.net/">reference.sketchdaily.net</a>
              </li>
              <li>
                <a href="https://line-of-action.com/">line-of-action.com</a>
              </li>
              <li>
                <a href="https://quickposes.com/en">quickposes.com</a>
              </li>
              <li>
                <a href="https://www.adorkastock.com/sketch/">AdorkaStock Sketch</a>
              </li>
            </ul>
            <p>How does DrawRef differ? You can run DrawRef on your own machine and import your own images.</p>
            <p>
              Right now, you need to be pretty computer-literate to run your own copy (check out
              <a href="https://github.com/danieloaks/drawref-backend">the instructions!</a>), but hopefully one day it
              will be super simple to do so.
            </p>
            <p>
              <a href="https://drawref.danieloaks.net/">drawref.danieloaks.net</a> is a hosted copy of the app, with all
              sample data imported! This lets you play around with it and see how DrawRef works.
            </p>
          </div>
        </div>
      </div>
      <TheFooter />
    </div>
  );
}

export default About;
