import { useNavigate } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminSourceInfoBox from "../components/AdminSourceInfoBox";

import { useAppSelector } from "../app/hooks";
import { useCreateSourceMutation } from "../app/apiSlice";
import { parseError } from "../app/utilities";

function AdminCreateSource() {
  const user = useAppSelector((state) => state.userProfile);
  const navigate = useNavigate();

  const [createSource, { isLoading, error }] = useCreateSourceMutation();

  const errorToShow = error ? `Could not create source: ${parseError(error)}` : "";

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Create Source</h1>
          <div className="mx-4 mb-8 flex max-w-full items-start justify-center gap-6">
            <AdminSourceInfoBox
              error={errorToShow}
              isSubmitting={isLoading}
              onSubmit={async (data) => {
                try {
                  await createSource({ token: user.token, body: data }).unwrap();
                  navigate("/admin/sources");
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

export default AdminCreateSource;
