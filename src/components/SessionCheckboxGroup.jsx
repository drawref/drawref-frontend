import { Fragment, useState } from "react";
import PropTypes from "prop-types";

function SessionCheckboxGroup({ tags, onChange }) {
  const emptyTags = {};
  for (const info of tags) {
    emptyTags[info.id] = [];
  }
  const [data, setData] = useState(emptyTags);

  return tags.map((info) => (
    <Fragment key={info.id}>
      <label className="text-right text-lg font-semibold">{info.name}</label>
      <div className="col-span-3 flex flex-wrap gap-1.5">
        {info.values.map((name) => (
          <div
            key={name}
            className="flex items-center gap-1 rounded bg-primary-100 pl-3 text-defaultText dark:bg-primary-200"
          >
            <input
              type="checkbox"
              id={`${info.id} ${name}`}
              checked={data[info.id].includes(name)}
              onChange={(e) => {
                // make copy of newData so we can freely edit it
                //  in future without worrying about other parent using it
                const newData = {};
                for (const [key, value] of Object.entries(data)) {
                  newData[key] = Array.from(value);
                }

                if (e.target.checked) {
                  newData[info.id].push(name);
                } else {
                  newData[info.id] = newData[info.id].filter((entry) => entry != name);
                }
                setData(newData);

                if (onChange) {
                  onChange(newData);
                }
              }}
            />
            <label htmlFor={`${info.id} ${name}`} className="select-none py-1.5 pr-3 text-sm">
              {name}
            </label>
          </div>
        ))}
      </div>
    </Fragment>
  ));
}
SessionCheckboxGroup.propTypes = {
  tags: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default SessionCheckboxGroup;
