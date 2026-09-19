import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiRefresh } from "@mdi/js";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { useAppSelector } from "../app/hooks";
import { useGetSourcesQuery, useDeleteSourceMutation, useScanSourceMutation } from "../app/apiSlice";

function AdminSources() {
  const user = useAppSelector((state) => state.userProfile);

  const { data: sources, isLoading } = useGetSourcesQuery({ token: user.token });
  const [deleteSource] = useDeleteSourceMutation();
  const [scanSource] = useScanSourceMutation();

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="mb-8 bg-primary-950 text-center text-white">
          <h1 className="mb-3 mt-10 text-2xl font-semibold">Sources</h1>
          <div className="mx-auto flex w-[40em] max-w-full flex-col border-[5px] border-primary-700 bg-primary-900">
            {sources &&
              sources.map((src) => (
                <div key={src.id} className="flex flex-nowrap items-center border-b border-primary-700">
                  <Link
                    to={`/admin/source/${src.id}`}
                    className="block flex-grow px-4 py-2 text-left text-lg font-medium hover:bg-primary-800"
                  >
                    {src.name} <span className="text-sm font-normal text-gray-400">({src.source_type})</span>
                  </Link>
                  <button
                    className="block px-3 py-2 hover:bg-primary-800"
                    title="Scan Source"
                    onClick={async (e) => {
                      try {
                        await scanSource({
                          slug: src.id!.toString(),
                          token: user.token,
                        });
                        alert(`Scanned ${src.name} successfully!`);
                      } catch (err) {
                        console.error(err);
                        alert(`Failed to scan ${src.name}.`);
                      }
                    }}
                  >
                    <Icon path={mdiRefresh} size={1.2} className="text-white" />
                  </button>
                  <button
                    className="block px-3 py-2 hover:bg-red-800"
                    title="Delete source"
                    onClick={async (e) => {
                      if (window.confirm(`Delete source ${src.name}?\nThis will remove all associated images!`)) {
                        try {
                          await deleteSource({
                            slug: src.id!.toString(),
                            token: user.token,
                          });
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }}
                  >
                    <Icon path={mdiTrashCan} size={1.2} className="text-white" />
                  </button>
                </div>
              ))}
            <Link to="/admin/source/create" className="block py-3 font-medium hover:bg-primary-800">
              Create new source
            </Link>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminSources;
