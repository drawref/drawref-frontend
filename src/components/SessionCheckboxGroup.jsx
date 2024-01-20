import { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

import { changeTags } from "../app/sessionTagsSlice";

function SessionCheckboxGroup({ categoryId, tags }) {
  const data = useSelector((state) => state.sessionTags);
  const dispatch = useDispatch();

  return Object.keys(tags).map((key) => (
    <Fragment key={key}>
      <label className="text-right text-lg font-semibold">{tags[key].name}</label>
      <div className="col-span-3 flex flex-wrap gap-1.5">
        {tags[key].values.map((name) => (
          <div key={name} className="flex items-center gap-1 rounded bg-primary-100 pl-3">
            <input
              type="checkbox"
              id={`${key}.${name}`}
              name={`${key} ${name}`}
              checked={data[key] && data[key][name]}
              onChange={(e) =>
                dispatch(
                  changeTags({
                    key: key,
                    name: name,
                    value: e.target.checked,
                  }),
                )
              }
            />
            <label htmlFor={`${key}.${name}`} className="select-none py-1.5 pr-3 text-sm">
              {name}
            </label>
          </div>
        ))}
      </div>
    </Fragment>
  ));
}
SessionCheckboxGroup.propTypes = {
  categoryId: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
};

export default SessionCheckboxGroup;
