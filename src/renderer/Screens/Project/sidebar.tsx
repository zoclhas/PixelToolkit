import { FileTreeFolder } from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import filterTree from "@/utils/filter-tree";
import { FolderSync, Search } from "lucide-react";
import React, { useState } from "react";
import * as Tooltip from "@/components/ui/tooltip";
import { FileTreeProps } from "../../../main/ipc-events/project";

export default function Sidebar(props: {
  fileTree: FileTreeProps;
  projectPath: string;
}) {
  const { fileTree, projectPath } = props;

  const [pathToTexture, setPathToTexture] = useState<string>();
  const [query, setQuery] = useState<string>("");

  function modifiedFileTree(): FileTreeProps {
    if (query) {
      const filteredTree = filterTree(fileTree, query);
      if (filteredTree) {
        return filteredTree;
      }
    }

    return fileTree;
  }

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search")! as string;
    setQuery(searchQuery);
  }

  // Setting selected texture path
  window.electron.ipcRenderer.on("selected-texture", (arg) =>
    setPathToTexture(arg as string),
  );

  return (
    <>
      <div className="sticky left-0 top-0 z-20 flex flex-col gap-2 rounded-b-xl bg-background p-2 shadow-sm">
        <div className="flex justify-end">
          <Tooltip.TooltipProvider>
            <Tooltip.Tooltip>
              <Tooltip.TooltipTrigger>
                <Button
                  variant="outline"
                  className="px-8"
                  onClick={() =>
                    window.electron.ipcRenderer.sendMessage(
                      "get-project-file-tree",
                      projectPath,
                    )
                  }
                >
                  <FolderSync className="size-4" />
                </Button>
              </Tooltip.TooltipTrigger>
              <Tooltip.TooltipContent>Resync Folder</Tooltip.TooltipContent>
            </Tooltip.Tooltip>
          </Tooltip.TooltipProvider>
        </div>

        <form className="flex w-full" onSubmit={submitHandler}>
          <div className="flex w-full items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              name="search"
              className="min-w-none w-auto max-w-none grow"
            />
            <Button size="icon">
              <Search className="size-4" />
            </Button>
          </div>
        </form>
      </div>

      <FileTreeFolder
        fileTree={modifiedFileTree()}
        query={query}
        projectPath={projectPath}
      />

      {pathToTexture ? (
        <code className="shadow-xs fixed bottom-2 left-4 flex select-none items-center rounded-xl border bg-background p-2 text-xs">
          {pathToTexture}
        </code>
      ) : (
        <code className="shadow-xs fixed bottom-2 left-4 flex select-none items-center rounded-xl border bg-background p-2 text-xs">
          (None Selected)
        </code>
      )}
      <div />
    </>
  );
}
