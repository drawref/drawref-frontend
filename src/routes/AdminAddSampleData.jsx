import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminSampleDataBox from "../components/AdminSampleDataBox";

import { useAddSampleDataMutation } from "../app/apiSlice";

function AdminAddSampleData() {
  const user = useSelector((state) => state.userProfile);

  const [addSampleData, { isLoading: isAddingSampleData, error: sampleDataError }] = useAddSampleDataMutation();
  const navigate = useNavigate();

  return (
    <>
      {isAddingSampleData && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Add sample data</h1>
          <div className="mx-4 mb-8 flex max-w-full items-start justify-center gap-6">
            <AdminSampleDataBox
              onSubmit={async (data) => {
                try {
                  const result = await addSampleData({ token: user.token, body: data }).unwrap();
                  // created successfully, move to the new category edit page
                  navigate(`/admin/`);
                } catch (err) {
                  console.error(err);
                }
              }}
            />
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminAddSampleData;
