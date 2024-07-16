import { useState, useRef, Fragment } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { useGetSampleDataQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "./SessionCheckboxGroup";
import TheLoadingModal from "../components/TheLoadingModal";

function AdminSampleDataBox({ onSubmit, error }) {
  const user = useSelector((state) => state.userProfile);
  const [uploadData, setUploadData] = useState({});
  const [agreeToConditions, setAgreeToConditions] = useState(false);

  const { data: sampleData, isLoading: isSampleDataLoading } = useGetSampleDataQuery({ token: user.token });
  const checkboxDefaultData = sampleData && [
    {
      id: "categories",
      name: "Categories",
      values: sampleData.categories.map((cat) => cat.name),
    },
    {
      id: "images",
      name: "Images",
      values: sampleData.images.map((img) => img.author),
    },
  ];

  // const otherTextErrors = [addImageError, uploadImageError].filter((e) => e && e.data).map((e) => e.data.error);
  // const errorToShow = [error, otherTextErrors].join(" ").trim();
  const errorToShow = "";

  const conditions =
    sampleData &&
    uploadData &&
    uploadData.images &&
    sampleData.images
      .map((img) => {
        if (uploadData.images.indexOf(img.author) !== -1) {
          return img.requirement;
        }
        return "";
      })
      .filter((name) => !!name);

  return (
    <>
      {isSampleDataLoading && <TheLoadingModal />}
      <form
        className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
        onSubmit={async (e) => {
          e.preventDefault();

          const data = {
            categories: uploadData.categories,
            images: uploadData.images,
          };

          // console.log(conditions, conditions && conditions.length, agreeToConditions);

          if (conditions && conditions.length > 0 && agreeToConditions === false) {
            console.log("Can't submit, conditions aren't agreed to");
            return;
          }

          onSubmit(data);
        }}
      >
        {sampleData && (
          <>
            <h2 className="text-xl font-medium">Import</h2>
            <div className="mx-auto grid grid-cols-4 gap-x-7 gap-y-4">
              <SessionCheckboxGroup tags={checkboxDefaultData} onChange={(data) => setUploadData(data)} />
            </div>

            {conditions && conditions.length > 0 && (
              <>
                <h2 className="mt-6 text-xl font-medium">Conditions</h2>
                <ul className="">
                  {conditions.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={agreeToConditions}
                    onChange={() => setAgreeToConditions(!agreeToConditions)}
                  />
                  <label htmlFor="checkbox">I agree to the conditions above.</label>
                </div>
              </>
            )}
          </>
        )}

        {errorToShow && (
          <span className="mx-auto -mb-5 mt-3 w-auto bg-red-600 px-3 py-1 text-sm">Error: {errorToShow}</span>
        )}

        <button
          type="submit"
          className="mx-auto mt-6 rounded bg-secondary-500 px-5 py-1.5 text-sm text-white shadow"
          disabled={false}
        >
          Save
        </button>
      </form>
    </>
  );
}
AdminSampleDataBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default AdminSampleDataBox;
