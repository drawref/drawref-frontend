import { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

import { changeMetadata } from "../app/sessionMetadataSlice";

function SessionCheckboxGroup({ categoryId, metadata }) {
  const data = useSelector((state) => state.sessionMetadata);
  const dispatch = useDispatch();

  return Object.keys(metadata).map((key) => (
    <Fragment key={key}>
      <label className="text-right text-lg font-semibold">{metadata[key].name}</label>
      <div className="col-span-3 flex gap-1.5">
        {metadata[key].values.map((name) => (
          <div key={name} className="flex items-center gap-1 rounded bg-primary-100 pl-3">
            <input
              type="checkbox"
              id={`${key}.${name}`}
              name={`${key} ${name}`}
              checked={data[key] && data[key][name]}
              onChange={(e) =>
                dispatch(
                  changeMetadata({
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
  metadata: PropTypes.object.isRequired,
};

export default SessionCheckboxGroup;
