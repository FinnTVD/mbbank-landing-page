/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";

// STYLE MODULES
import "@/modules/grapesjs/dist/css/grapes.min.css";
import "@/modules/grapesjs-template-manager/dist/grapesjs-template-manager.min.css";

// MAIN MODULE
import grapesjs from "grapesjs";

// PLUGINS MODULES
import grapesjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import grapesjsPluginForms from "grapesjs-plugin-forms";
import grapesjsPluginExport from "grapesjs-plugin-export";
import grapesjsComponentCountdown from "grapesjs-component-countdown";
import grapesjsNavbar from "grapesjs-navbar";
import grapesjsStyleBg from "grapesjs-style-bg";
import grapesjsTabs from "grapesjs-tabs";
import grapesjsTooltip from "grapesjs-tooltip";
import grapesjsCustomCode from "grapesjs-custom-code";
import grapesjsTouch from "grapesjs-touch";
import grapesjsParserPostcss from "grapesjs-parser-postcss";
import grapesjsPluginCkeditor from "grapesjs-plugin-ckeditor";
import grapesjsPluginFilestack from "grapesjs-plugin-filestack";
import grapesjsProjectManager from "grapesjs-project-manager";

// PLUGINS CUSTOMS
import pluginCustom from "./plugin-custom";
import swiperCustom from "@/app/_components/plugins/swiper"; // plugin
import templatesPlugin from "./templates-plugin";

// CONFIG PANEL BUTTONS
import {
  capitalizeFirstLetter,
  getChangedAttributeKeys,
  HistoryItem,
  panelOptsButtons,
  SavedVersion,
} from "@/app/_components/config";
import FileManager from "@/app/_components/plugins/file-manager/FileManager";

// Đặt biến cờ ngoài component
let hasInitialHistory = false;
let lastAttrChange = { key: "", value: "", time: 0 };
let isRestoringHistory = false;

export default function IndexGrapesJS() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<any | null>(null);
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);
  const [versionName, setVersionName] = useState("");
  const [editHistory, setEditHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Kiểm tra xem đã lưu phiên bản trước đó chưa
    const savedData = localStorage.getItem("mbbank-builder-versions");
    if (savedData) {
      try {
        setSavedVersions(JSON.parse(savedData));
      } catch (e) {
        localStorage.removeItem("mbbank-builder-versions");
      }
    }

    if (editorRef.current && !editor) {
      // Khởi tạo trình soạn thảo
      const editorInstance = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "auto",
        fromElement: true,
        storageManager: {
          autoload: false,
          type: "indexeddb",
        },
        pageManager: true, // Bật quản lý page/project
        undoManager: { trackChanges: true },
        plugins: [
          // customs
          pluginCustom,
          swiperCustom,
          templatesPlugin,
          // plugins
          grapesjsPresetWebpage,
          grapesjsBlocksBasic,
          grapesjsPluginForms,
          grapesjsPluginExport,
          grapesjsComponentCountdown,
          grapesjsNavbar,
          grapesjsStyleBg,
          grapesjsTabs,
          grapesjsTooltip,
          grapesjsCustomCode,
          grapesjsTouch,
          grapesjsParserPostcss,
          grapesjsPluginCkeditor,
        ],
        pluginsOpts: {
          /* ... các cấu hình plugin ... */
        },
      });

      // Xóa tất cả các component và style
      editorInstance.setComponents("");
      editorInstance.setStyle("");

      setEditor(editorInstance);

      // Lấy tất cả các panels
      const panels = editorInstance.Panels.getPanels();

      // Lặp qua từng panel
      panels.forEach((panel: any) => {
        const buttons = panel.get("buttons");
        // Lặp qua từng button và thêm attribute title
        const titleMap: Record<string, string> = {
          "set-device-desktop": "Desktop",
          "set-device-tablet": "Tablet",
          "set-device-mobile": "Mobile",
          undo: "Undo",
          redo: "Redo",
          "gjs-open-import-webpage": "Import code",
          "canvas-clear": "Clear all",
        };
        buttons.forEach((button: any) => {
          const title = titleMap[button.attributes.id];
          if (title) {
            button.set("attributes", { title });
          }
        });
      });

      // Lắng nghe sự kiện thay đổi của trình soạn thảo
      const captureHistoryState = (actionLabel: string) => {
        // Chỉ cho phép thêm "Trạng thái ban đầu" nếu chưa có trong lịch sử
        if (
          actionLabel === "Trạng thái ban đầu" &&
          editHistory.some((item) => item.action === "Trạng thái ban đầu")
        ) {
          return;
        }
        const html = editorInstance.getHtml();
        const css = editorInstance.getCss();
        const newHistoryItem: HistoryItem = {
          id: `hist-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          action: actionLabel,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          html,
          css,
        };
        setEditHistory((prevHistory) => [
          newHistoryItem,
          ...prevHistory.slice(0, 49),
        ]);
        setCurrentHistoryId(newHistoryItem.id); // Thêm dòng này để cập nhật bản ghi active
      };

      let isEditing = false;
      let lastEditComponentId: string | null = null;

      editorInstance.on(
        "component:selected",
        (component: {
          getEl: () => any;
          getId: () => string;
          getName: () => string;
          get: (arg0: string) => any;
        }) => {
          if (isRestoringHistory) return;
          const el = component.getEl();
          if (!el) return;

          const input = el.querySelector(
            'input, textarea, [contenteditable="true"]'
          );
          if (input) {
            input.addEventListener("focus", () => {
              isEditing = true;
              lastEditComponentId = component.getId();
              editorInstance.UndoManager.stop(); // tạm ngừng theo dõi thay đổi nhỏ
            });

            input.addEventListener("blur", () => {
              if (isEditing && lastEditComponentId === component.getId()) {
                isEditing = false;
                editorInstance.UndoManager.start(); // bật lại theo dõi
                // Ghi lại lịch sử duy nhất cho lần chỉnh sửa này
                captureHistoryState(
                  `Chỉnh sửa nội dung: ${
                    component.getName() || component.get("type")
                  }`
                );
                lastEditComponentId = null;
              }
            });
          }
        }
      );

      editorInstance.on("component:styleUpdate", (model: any, style: any) => {
        if (isRestoringHistory) return;
        const changedProps = Object.keys(style || {});
        const changedPropsStyle = Object.keys(style?.style || {});
        let propDetails = "";
        if (changedProps.length > 0 && changedProps.length <= 3) {
          propDetails = `${changedProps.join(", ")}`;
        }
        const selected = editorInstance.getSelected();
        const targetName = selected
          ? selected.getName() || selected.get("type")
          : "Đối tượng";
        captureHistoryState(
          `${capitalizeFirstLetter(propDetails)}: "${capitalizeFirstLetter(
            changedPropsStyle?.[0]
          )}" cho ${targetName}`
        );
      });

      editorInstance.on(
        "component:update:attributes",
        (model: any, attrName: string) => {
          if (isRestoringHistory) return;
          const targetName =
            model.getName() || model.get("type") || "Component";
          const attrValue = model.getAttributes()[attrName];
          const now = Date.now();
          // Nếu thay đổi giống lần trước và trong vòng 100ms thì bỏ qua
          if (
            lastAttrChange.key === attrName &&
            lastAttrChange.value === attrValue &&
            now - lastAttrChange.time < 100
          ) {
            return;
          }
          lastAttrChange = { key: attrName, value: attrValue, time: now };
          const listKeys = getChangedAttributeKeys(
            model?.changed,
            model?._previousAttributes
          );
          if (listKeys.length) {
            captureHistoryState(
              `Component settings : "${capitalizeFirstLetter(
                listKeys[listKeys.length - 1]
              )}" cho ${targetName}`
            );
          }
        }
      );

      editorInstance.on(
        "block:drag:stop",
        (
          component: { getName: () => any; get: (arg0: string) => any },
          block: { getLabel: () => any }
        ) => {
          if (isRestoringHistory) return;
          captureHistoryState(
            `Đã thêm khối: ${
              block.getLabel() || component.getName() || component.get("type")
            }`
          );
        }
      );

      editorInstance.on(
        "component:drag:end",
        (component: { parent: any; target: any }) => {
          if (isRestoringHistory) return;
          captureHistoryState(
            `Di chuyển: ${component.target?.attributes?.tagName} trong ${component.parent?.attributes?.tagName}`
          );
        }
      );

      editorInstance.on(
        "component:remove",
        (component: { getName: () => any; get: (arg0: string) => any }) => {
          if (isRestoringHistory) return;
          captureHistoryState(
            `Đã xóa: ${component.getName() || component.get("type")}`
          );
        }
      );

      editorInstance.on(
        "component:clone",
        (component: { getName: () => any; get: (arg0: string) => any }) => {
          if (isRestoringHistory) return;
          captureHistoryState(
            `Nhân bản: ${component.getName() || component.get("type")}`
          );
        }
      );

      setTimeout(() => {
        if (!hasInitialHistory) {
          captureHistoryState("Trạng thái ban đầu");
          hasInitialHistory = true;
        }
      }, 100);

      // 🛠️ Thêm nút mở dialog lịch sử
      editorInstance.Commands.add("show-edit-history", {
        run: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", true);
          }
          const el = document.getElementById("edit-history-list");
          if (el) el.classList.remove("hidden");
        },
        stop: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", false);
          }
          const el = document.getElementById("edit-history-list");
          if (el) el.classList.add("hidden");
        },
      });

      // 🛠️ Thêm nút mở dialog lưu page
      editorInstance.Commands.add("show-save-dialog", {
        run: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", true);
          }
          const el = document.getElementById("save-dialog");
          if (el) el.classList.remove("hidden");
        },
        stop: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", false);
          }
          const el = document.getElementById("save-dialog");
          if (el) el.classList.add("hidden");
        },
      });

      // 🛠️ Thêm nút mở dialog lưu phiên bản
      editorInstance.Commands.add("show-versions-list", {
        run: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", true);
          }
          const el = document.getElementById("versions-list");
          if (el) el.classList.remove("hidden");
        },
        stop: (editorCmd: any, sender: any) => {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", false);
          }
          const el = document.getElementById("versions-list");
          if (el) el.classList.add("hidden");
        },
      });

      // 🛠️ Thêm nút mở dialog file manager
      editorInstance.Commands.add("open-file-manager", {
        run(
          editor: any,
          sender: { set: (arg0: string, arg1: boolean) => void }
        ) {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", true);
          }
          const el = document.getElementById("file-manager-panel");
          if (el) el.classList.remove("hidden");
        },
        stop(
          editor: any,
          sender: { set: (arg0: string, arg1: boolean) => void }
        ) {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", false);
          }
          const el = document.getElementById("file-manager-panel");
          if (el) el.classList.add("hidden");
        },
      });

      // 🛠️ Thêm các nút vào thanh công cụ
      const pn = editorInstance.Panels;
      const panelOpts =
        pn.getPanel("options") || pn.addPanel({ id: "options", visible: true });
      panelOpts.get("buttons").add(panelOptsButtons);

      // 🛠️ Thêm logo vào giữa thanh công cụ
      setTimeout(() => {
        const panelButtons = document.querySelector(
          ".gjs-pn-panels .gjs-pn-buttons"
        );
        if (panelButtons && !panelButtons.querySelector(".custom-logo")) {
          const logo = document.createElement("img");
          logo.src = "/mbbank/Logo_MB_new.png";
          logo.alt = "Logo";
          logo.className = "custom-logo";
          logo.style.height = "40px";
          logo.style.margin = "0 auto";

          // Thêm logo vào giữa các nút
          panelButtons.insertBefore(
            logo,
            panelButtons.children[Math.floor(panelButtons.children.length / 2)]
          );
        }
      }, 500);
    }

    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, []);

  const saveCurrentVersion = () => {
    if (!editor || !versionName.trim()) return;
    const html = editor.getHtml();
    const css = editor.getCss();
    const newVersion: SavedVersion = {
      id: Date.now().toString(),
      name: versionName,
      date: new Date().toLocaleString("vi-VN"),
      html,
      css,
    };
    const updatedVersions = [...savedVersions, newVersion];
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      "mbbank-builder-versions",
      JSON.stringify(updatedVersions)
    );
    setVersionName("");
    editor.Commands.stop("show-save-dialog");
    removeActivePanel("save-version");
  };

  const loadVersion = (version: SavedVersion) => {
    if (!editor) return;
    editor.setComponents(version.html);
    editor.setStyle(version.css);
    setEditHistory((prev) => [
      {
        id: `load-${Date.now()}`,
        action: `Đã tải phiên bản: ${version.name}`,
        timestamp: new Date().toLocaleTimeString("vi-VN"),
        html: version.html,
        css: version.css,
      },
      ...prev.slice(0, 49),
    ]);
  };

  const deleteVersion = (id: string) => {
    const updatedVersions = savedVersions.filter((v) => v.id !== id);
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      "mbbank-builder-versions",
      JSON.stringify(updatedVersions)
    );
  };

  const loadHistoryState = (historyItem: HistoryItem) => {
    if (!editor) return;
    isRestoringHistory = true; // Bắt đầu quá trình phục hồi, tạm dừng ghi lịch sử
    editor.setComponents(historyItem.html);
    editor.setStyle(historyItem.css);
    setCurrentHistoryId(historyItem.id); // Đánh dấu bản đang active
    isRestoringHistory = false; // Kết thúc phục hồi, bật lại ghi lịch sử
  };

  const removeActivePanel = (id: string) => {
    if (typeof window === "undefined" || !editor) return;
    editor.Panels.getButton("options", id)?.set("active", false);
  };

  return (
    <main className="flex h-screen relative">
      <div className="size-full flex-1 overflow-hidden" ref={editorRef}></div>

      {/* Dialog lưu phiên bản */}
      <div
        id="save-dialog"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-96 border border-gray-300"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Lưu phiên bản
        </h2>
        <input
          type="text"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Nhập tên phiên bản..."
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              editor?.Commands.stop("show-save-dialog");
              removeActivePanel("save-version");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={saveCurrentVersion}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!versionName.trim()}
          >
            Lưu
          </button>
        </div>
      </div>

      {/* Danh sách phiên bản đã lưu */}
      <div
        id="versions-list"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[500px] max-h-[80vh] overflow-auto border border-gray-300"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Phiên bản đã lưu
        </h2>
        {savedVersions.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có phiên bản nào được lưu.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {savedVersions.map((version) => (
              <li key={version.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {version.name}
                    </h3>
                    <p className="text-sm text-gray-500">{version.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        editor?.Commands.stop("show-versions-list");
                        removeActivePanel("view-versions");
                        loadVersion(version);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      Tải
                    </button>
                    <button
                      onClick={() => deleteVersion(version.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              editor?.Commands.stop("show-versions-list");
              removeActivePanel("view-versions");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Panel Lịch sử Chỉnh sửa */}
      <div
        id="edit-history-list"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[550px] max-h-[80vh] overflow-auto border border-gray-300"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Lịch sử chỉnh sửa
        </h2>
        {editHistory.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có thay đổi nào được ghi lại.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {editHistory.map((item) => (
              <li
                key={item.id}
                className={`py-3 group hover:bg-gray-50 transition-colors ${
                  currentHistoryId === item.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">
                      {item.action}
                    </h3>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  <button
                    onClick={() => {
                      editor.Commands.stop("show-edit-history");
                      removeActivePanel("view-edit-history");
                      loadHistoryState(item);
                    }}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    Khôi phục
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              editor?.Commands.stop("show-edit-history");
              removeActivePanel("view-edit-history");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>

      <div
        id="file-manager-panel"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[600px] max-h-[80vh] overflow-auto border border-gray-300"
      >
        <FileManager
          onFileSelect={(file) => {
            // Ví dụ: Chèn ảnh vào vùng đang chọn của editor
            if (editor && file.type === "file") {
              const selected = editor.getSelected();
              if (selected && selected.is("image")) {
                selected.set("src", `${file.name}`);
              } else {
                // Hoặc thêm mới một image vào canvas
                editor.addComponents({
                  type: "image",
                  src: `${file.name}`,
                });
              }
            }
          }}
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              editor?.Commands.stop("open-file-manager");
              removeActivePanel("open-file-manager");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </main>
  );
}
