import PropTypes from "prop-types";

function SessionCheckboxGroup({ categoryId, metadata }) {
  return Object.keys(metadata).map((key) => (
    <>
      <label className="text-right text-lg font-semibold">{metadata[key].name}</label>
      <div className="col-span-3 flex gap-1.5">
        {metadata[key].values.map((name) => (
          <div key={name} className="flex items-center gap-1 rounded bg-primary-100 pl-3">
            <input type="checkbox" id={`${key}.${name}`} name={`meta.${key}.${name}`} />
            <label htmlFor={`${key}.${name}`} className="select-none py-1.5 pr-3 text-sm">
              {name}
            </label>
          </div>
        ))}
      </div>
    </>
  ));
}
SessionCheckboxGroup.propTypes = {
  categoryId: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
};

export default SessionCheckboxGroup;
