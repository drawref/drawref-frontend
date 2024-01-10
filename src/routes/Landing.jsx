import { Link } from "react-router-dom";

import TheHeader from '../components/TheHeader';
import TheFooter from '../components/TheFooter';
import LandingCategoryCard from '../components/LandingCategoryCard'
import pose from '../assets/default-categories/default-pose.jpg';
import face from '../assets/default-categories/default-head.jpg';

function Landing() {
  return (
    <>
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="text-3xl font-semibold mt-10 mb-3">
            Select a category
          </h1>
          <div className="flex w-[60rem] max-w-full px-4 mx-auto flex-wrap justify-center items-center my-8 gap-8 md:gap-12">
            <LandingCategoryCard categoryKey="poses" name="Poses" imageUrl={ `${pose}` } />
            <LandingCategoryCard categoryKey="faces" name="Faces" imageUrl={ `${face}` } />
            <LandingCategoryCard categoryKey="animals" name="Animals" />
            <LandingCategoryCard categoryKey="hands" name="Hands" />
            <LandingCategoryCard categoryKey="plants" name="Plants" />
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Landing;
