import { Link } from "react-router-dom";

function LandingCategoryCard({ categoryKey, name, imageUrl }) {
  return (
    <Link
      to={`/c/${categoryKey}`}
      className="block w-[15rem] flex-shrink-0 border-[5px] border-slate-200 px-3 py-3 shadow-card"
    >
      <div
        className="h-[12.5rem] w-full rounded bg-zinc-300 bg-cover"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <h2 className="-mb-1 mt-2 text-2xl font-medium">{name}</h2>
    </Link>
  );
}

export default LandingCategoryCard;
