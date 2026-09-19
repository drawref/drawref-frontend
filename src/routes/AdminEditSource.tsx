import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminSourceInfoBox from "../components/AdminSourceInfoBox";
import AdminPathMetadataForm from "../components/AdminPathMetadataForm";

import { useAppSelector } from "../app/hooks";
import {
  useGetSourceQuery,
  useEditSourceMutation,
  useGetSourcePathMetadataQuery,
  useUpsertPathMetadataMutation,
  useDeletePathMetadataMutation,
} from "../app/apiSlice";
import NotFound from "./NotFound";
import { parseError } from "../app/utilities";
import { PathMetadata } from "../types/drawref";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan } from "@mdi/js";

function AdminEditSource() {
  const user = useAppSelector((state) => state.userProfile);
  const { sourceSlug } = useParams<{ sourceSlug: string }>();
  const navigate = useNavigate();
  const [editingMetadata, setEditingMetadata] = useState<PathMetadata | null>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  if (!sourceSlug) {
    return <NotFound />;
  }

  const { data: source, isLoading: isFetchingSource } = useGetSourceQuery({
    token: user.token,
    slug: sourceSlug,
  });
  const { data: metadataList, isLoading: isFetchingMetadata } = useGetSourcePathMetadataQuery({
    token: user.token,
    slug: sourceSlug,
  });

  const [editSource, { isLoading: isEditingSource, error: sourceError }] = useEditSourceMutation();
  const [upsertMetadata, { isLoading: isUpserting, error: metadataError }] = useUpsertPathMetadataMutation();
  const [deleteMetadata] = useDeletePathMetadataMutation();

  const isWorking = isFetchingSource || isEditingSource || isFetchingMetadata || isUpserting;

  const errorToShow = sourceError ? `Could not edit source: ${parseError(sourceError)}` : "";
  const metaErrorToShow = metadataError ? `Could not save metadata: ${parseError(metadataError)}` : "";

  return (
    <>
      {isWorking && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 pb-12 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Edit Source</h1>
          <div className="mx-4 flex max-w-full flex-col items-start justify-center gap-6 md:flex-row">
            {!isFetchingSource && source && (
              <AdminSourceInfoBox
                source={source}
                error={errorToShow}
                isSubmitting={isEditingSource}
                onSubmit={async (data) => {
                  try {
                    await editSource({
                      token: user.token,
                      slug: sourceSlug,
                      body: data,
                    }).unwrap();
                    navigate("/admin/sources");
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
            )}

            {!isFetchingSource && source && (
              <div className="box-border flex w-[40em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xl font-medium">Path Metadata Rules</h2>
                  {!showMetadataForm && (
                    <button
                      onClick={() => {
                        setEditingMetadata(null);
                        setShowMetadataForm(true);
                      }}
                      className="rounded bg-primary-700 px-3 py-1.5 font-medium hover:bg-primary-600"
                    >
                      Add Rule
                    </button>
                  )}
                </div>

                {metaErrorToShow && <p className="font-medium text-red-500">{metaErrorToShow}</p>}

                {showMetadataForm && (
                  <div className="mb-6">
                    <AdminPathMetadataForm
                      sourceId={source.id!}
                      sourceSlug={sourceSlug}
                      metadata={editingMetadata || undefined}
                      allMetadata={metadataList}
                      isSubmitting={isUpserting}
                      onCancel={() => {
                        setShowMetadataForm(false);
                        setEditingMetadata(null);
                      }}
                      onSubmit={async (data) => {
                        try {
                          await upsertMetadata({
                            token: user.token,
                            slug: sourceSlug,
                            body: data,
                          }).unwrap();
                          setShowMetadataForm(false);
                          setEditingMetadata(null);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                )}

                {!isFetchingMetadata && metadataList && metadataList.length === 0 && !showMetadataForm && (
                  <p className="my-4 text-center text-gray-400">
                    No metadata rules configured. Images will inherit default category rules if available.
                  </p>
                )}

                {!isFetchingMetadata && metadataList && metadataList.length > 0 && (
                  <div className="flex flex-col overflow-hidden rounded border border-primary-700">
                    {metadataList.map((meta) => (
                      <div
                        key={meta.id}
                        className="flex items-center justify-between border-b border-primary-700 p-3 last:border-b-0 hover:bg-primary-800"
                      >
                        <div className="flex-grow text-left">
                          <p className="font-mono text-sm">
                            {meta.relative_path === "" ? "/" : `/${meta.relative_path}`}
                          </p>
                          <div className="mt-1 flex gap-3 text-xs text-gray-400">
                            {meta.category_id && <span>Category: {meta.category_id}</span>}
                            {meta.author && <span>Author: {meta.author}</span>}
                            <span>Mode: {meta.tag_mode}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            title="Edit"
                            onClick={() => {
                              setEditingMetadata(meta);
                              setShowMetadataForm(true);
                            }}
                            className="rounded p-2 hover:bg-primary-600"
                          >
                            <Icon path={mdiPencil} size={0.9} />
                          </button>
                          <button
                            title="Delete"
                            onClick={async () => {
                              if (window.confirm(`Delete rule for path ${meta.relative_path || "/"}?`)) {
                                try {
                                  await deleteMetadata({
                                    token: user.token,
                                    slug: sourceSlug,
                                    id: meta.id!,
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="rounded p-2 text-red-300 hover:bg-red-800"
                          >
                            <Icon path={mdiTrashCan} size={0.9} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminEditSource;
