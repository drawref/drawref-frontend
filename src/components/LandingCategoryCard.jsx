import { Link } from "react-router-dom";

function LandingCategoryCard({ categoryKey, name, imageUrl }) {
  return (
    <Link to={`/c/${categoryKey}`} className="block w-[15rem] px-3 py-3 shadow-card border-slate-200 border-[5px] flex-shrink-0">
      <div className="w-full h-[12.5rem] bg-zinc-300 bg-cover rounded" style={{ backgroundImage: `url(${ imageUrl })` }}></div>
      <h2 className="font-medium mt-2 -mb-1 text-2xl">{ name }</h2>
    </Link>
  );
}

export default LandingCategoryCard;
