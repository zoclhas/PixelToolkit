import * as Menu from "@/components/ui/menubar";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";

export default function MenuBar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  function closeWindow() {
    window.electron.ipcRenderer.sendMessage("close-app");
  }

  // Route back to home page if native menu is reacted
  window.electron.ipcRenderer.on("go-home", () => navigate("/"));

  // Changing theme from quick, and native menu bar
  const changeTheme = (selectedTheme: "light" | "dark") =>
    setTheme(selectedTheme);

  window.electron.ipcRenderer.on("change-theme", (e: any) =>
    changeTheme(e.theme),
  );

  return (
    <nav className="w-max p-4 pb-0">
      <Menu.Menubar>
        <Menu.MenubarMenu>
          <Menu.MenubarTrigger>File</Menu.MenubarTrigger>
          <Menu.MenubarContent>
            <Menu.MenubarItem asChild>
              <Link to="/">
                Home <Menu.MenubarShortcut>⌃H</Menu.MenubarShortcut>
              </Link>
            </Menu.MenubarItem>
            <Menu.MenubarItem onClick={() => closeWindow()}>
              Quit <Menu.MenubarShortcut>⌃Q</Menu.MenubarShortcut>
            </Menu.MenubarItem>
          </Menu.MenubarContent>
        </Menu.MenubarMenu>

        <Menu.MenubarMenu>
          <Menu.MenubarTrigger>Edit</Menu.MenubarTrigger>
        </Menu.MenubarMenu>

        <Menu.MenubarMenu>
          <Menu.MenubarTrigger>View</Menu.MenubarTrigger>

          {/* Quick theme switch */}
          <Menu.MenubarContent>
            <Menu.MenubarSeparator />
            <Menu.MenubarSub>
              <Menu.MenubarSubTrigger>Theme</Menu.MenubarSubTrigger>
              <Menu.MenubarSubContent>
                <Menu.MenubarRadioGroup
                  value={
                    theme === "dark"
                      ? "dark"
                      : theme === "light"
                        ? "light"
                        : "dark"
                  }
                >
                  <Menu.MenubarRadioItem
                    value="dark"
                    onClick={() => changeTheme("dark")}
                  >
                    Dark
                  </Menu.MenubarRadioItem>
                  <Menu.MenubarRadioItem
                    value="light"
                    onClick={() => changeTheme("light")}
                  >
                    Light
                  </Menu.MenubarRadioItem>
                </Menu.MenubarRadioGroup>
              </Menu.MenubarSubContent>
            </Menu.MenubarSub>
          </Menu.MenubarContent>
        </Menu.MenubarMenu>
      </Menu.Menubar>
    </nav>
  );
}
