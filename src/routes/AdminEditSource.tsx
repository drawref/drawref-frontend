import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminSourceInfoBox from "../components/AdminSourceInfoBox";
import AdminPathMetadataForm from "../components/AdminPathMetadataForm";
import AdminSourcePathBrowser from "../components/AdminSourcePathBrowser";

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
  const [editingMetadataPath, setEditingMetadataPath] = useState<string>("");

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
                </div>

                {metaErrorToShow && <p className="font-medium text-red-500">{metaErrorToShow}</p>}

                {showMetadataForm && (
                  <div className="mb-6">
                    <AdminPathMetadataForm
                      sourceId={source.id!}
                      sourceSlug={sourceSlug}
                      metadata={
                        editingMetadata ||
                        (editingMetadataPath
                          ? ({
                              relative_path: editingMetadataPath,
                              source_id: source.id,
                              tags: {},
                              tag_mode: "merge",
                            } as PathMetadata)
                          : undefined)
                      }
                      allMetadata={metadataList}
                      isSubmitting={isUpserting}
                      onCancel={() => {
                        setShowMetadataForm(false);
                        setEditingMetadata(null);
                        setEditingMetadataPath("");
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
                          setEditingMetadataPath("");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                )}

                {!showMetadataForm && (
                  <AdminSourcePathBrowser
                    sourceId={source.id!}
                    sourceSlug={sourceSlug}
                    metadataList={metadataList}
                    onEditMetadata={(meta) => {
                      if ("id" in meta) {
                        setEditingMetadata(meta as PathMetadata);
                        setEditingMetadataPath("");
                      } else {
                        setEditingMetadata(null);
                        setEditingMetadataPath(meta.relative_path);
                      }
                      setShowMetadataForm(true);
                    }}
                  />
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
