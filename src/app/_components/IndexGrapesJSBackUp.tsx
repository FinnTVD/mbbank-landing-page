/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "@/modules/grapesjs/dist/css/grapes.min.css";
import "@/modules/grapesjs-template-manager/dist/grapesjs-template-manager.min.css";

// Import các plugin miễn phí
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
// import grapesjsTemplateManager from "grapesjs-template-manager";
// import grapesjsSwiperSlider from "grapesjs-swiper-slider";
// import grapesjsBlocksBootstrap4 from "grapesjs-blocks-bootstrap4";
// Import plugin Destack vừa tạo
import pluginCustom from "./plugin-custom";
import swiperCustom from "@/app/_components/plugins/swiper"; // plugin
import templatesPlugin from "./templates-plugin";

// Định nghĩa kiểu dữ liệu cho bản lưu
interface SavedVersion {
  id: string;
  name: string;
  date: string;
  html: string;
  css: string;
}

// Define type for history actions
interface HistoryAction {
  id: number; // Index in the undo manager stack
  name: string; // User-friendly name of the action
  timestamp: string;
  type: string; // e.g., 'add', 'remove', 'update', 'style'
  targetName?: string; // Name of the component affected
}

export default function IndexGrapesJS() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [versionName, setVersionName] = useState("");

  // States for History Panel
  const [historyActions, setHistoryActions] = useState<HistoryAction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<
    "actions" | "versions"
  >("actions");

  useEffect(() => {
    // Khôi phục danh sách các bản lưu từ localStorage khi component được mount
    const savedData = localStorage.getItem("mbbank-builder-versions");
    // 🛠️ Nếu muốn reset localStorage lần đầu tiên
    // localStorage.removeItem("mbbank-builder-versions");
    if (savedData) {
      setSavedVersions(JSON.parse(savedData));
    }

    if (editorRef.current) {
      const editorInstance = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "auto",
        fromElement: true,
        // pageManager: true,
        storageManager: {
          autoload: false, // Thêm dòng này để tránh tự động load từ storage
          type: "indexeddb",
        },
        plugins: [
          // plugins custom
          pluginCustom,
          swiperCustom,
          // grapesjsBlocksBootstrap4,
          // ["grapesjs-swiper-slider"],
          // grapesjsSwiperSlider,
          // plugins system
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
          // grapesjsTemplateManager,
          templatesPlugin,
        ],
        pluginsOpts: {
          // plugins custom
          pluginCustom: {},
          swiperCustom: {},
          grapesjsBlocksBootstrap4: {
            // blocks: {
            //   // ...
            // },
            // blockCategories: {
            //   // ...
            // },
            // labels: {
            //   // ...
            // },
          },
          // "grapesjs-swiper-slider": {
          //   // options
          // },
          // grapesjsSwiperSlider: {},
          // plugins system
          grapesjsPresetWebpage: {},
          grapesjsBlocksBasic: {},
          grapesjsPluginForms: {},
          grapesjsPluginExport: {},
          grapesjsComponentCountdown: {},
          grapesjsNavbar: {},
          grapesjsStyleBg: {},
          grapesjsTabs: {},
          grapesjsTooltip: {},
          grapesjsCustomCode: {},
          grapesjsTouch: {},
          grapesjsParserPostcss: {},
          grapesjsPluginCkeditor: {},
          // grapesjsTemplateManager: {
          //   // Cấu hình templates
          //   templates: [
          //     {
          //       id: "template1",
          //       name: "Trang chủ MB Bank",
          //       category: "Trang chủ",
          //       thumbnail: "/mbbank/templates/template1.jpg", // Đường dẫn đến ảnh thumbnail
          //       template: {
          //         html: `
          //           <div class="header">
          //             <div class="logo">
          //               <img src="/mbbank/Logo_MB_new.png" alt="MB Bank Logo" />
          //             </div>
          //             <div class="nav">
          //               <a href="#">Trang chủ</a>
          //               <a href="#">Dịch vụ</a>
          //               <a href="#">Liên hệ</a>
          //             </div>
          //           </div>
          //           <div class="hero">
          //             <h1>Ngân hàng MB - Đồng hành cùng thành công</h1>
          //             <p>Giải pháp tài chính toàn diện cho cá nhân và doanh nghiệp</p>
          //             <button>Tìm hiểu thêm</button>
          //           </div>
          //         `,
          //         css: `
          //         .header {
          //           display: flex;
          //           justify-content: space-between;
          //           padding: 20px;
          //           background-color: #fff;
          //         }
          //         .logo img {
          //           height: 40px;
          //         }
          //         .nav {
          //           display: flex;
          //           gap: 20px;
          //         }
          //         .nav a {
          //           text-decoration: none;
          //           color: #333;
          //         }
          //         .hero {
          //           text-align: center;
          //           padding: 100px 20px;
          //           background-color: #f5f5f5;
          //         }
          //         .hero h1 {
          //           font-size: 36px;
          //           margin-bottom: 20px;
          //         }
          //         .hero p {
          //           font-size: 18px;
          //           margin-bottom: 30px;
          //         }
          //         .hero button {
          //           padding: 12px 24px;
          //           background-color: #1e88e5;
          //           color: #fff;
          //           border: none;
          //           border-radius: 4px;
          //           cursor: pointer;
          //         }
          //       `,
          //       },
          //     },
          //   ],

          //   // Cấu hình lưu trữ
          //   storage: "local", // 'local', 'remote', hoặc 'indexeddb'
          //   storageKey: "mbbank-templates", // Key để lưu vào localStorage

          //   // Các tùy chọn khác
          //   modalTitle: "Chọn mẫu trang MB Bank",
          //   importBtnText: "Sử dụng mẫu này",
          //   addBtnText: "Thêm mẫu mới",
          //   editBtnText: "Chỉnh sửa",
          //   deleteBtnText: "Xóa",

          //   // Các callback
          //   onSelect: (template: any) => {
          //     console.log("Đã chọn template:", template);
          //   },
          //   onAdd: (template: any) => {
          //     console.log("Đã thêm template mới:", template);
          //   },
          //   onEdit: (template: any) => {
          //     console.log("Đã chỉnh sửa template:", template);
          //   },
          //   onDelete: (template: any) => {
          //     console.log("Đã xóa template:", template);
          //   },
          // },
        },
      });

      // 🧹 Xóa sạch template
      editorInstance.setComponents("");
      editorInstance.setStyle("");

      setEditor(editorInstance);

      // --- START: History Feature Logic ---
      const um = editorInstance.UndoManager;

      const getActionName = (item: any): string => {
        const type = item.get("type");
        const target = item.get("target");
        let actionLabel = "Unknown change";
        let targetName = "Element";

        if (target) {
          targetName =
            target.getName() ||
            target.get("tagName") ||
            target.get("type") ||
            "Element";
        }

        switch (type) {
          case "add":
            actionLabel = `${targetName} Added`;
            break;
          case "remove":
            actionLabel = `${targetName} Removed`;
            break;
          case "style":
            actionLabel = `${targetName} Style Changed`;
            break;
          case "change": // This can be generic for component property changes
          case "update": // Often used for attribute/property changes
            const changedProps = item.get("properties") || item.get("changed"); // GrapesJS might use 'properties' or 'changed'
            if (
              changedProps &&
              typeof changedProps === "object" &&
              Object.keys(changedProps).length > 0
            ) {
              const propKeys = Object.keys(changedProps);
              actionLabel = `${targetName} ${propKeys.join(", ")} Updated`;
            } else {
              actionLabel = `${targetName} Updated`;
            }
            break;
          default:
            actionLabel = `Change on ${targetName}`;
        }
        // If it's the very first "empty" state, label it as "Editing Started"
        if (
          um.getStack().indexOf(item) === 0 &&
          um.getStack().length > 1 &&
          !target &&
          type === undefined
        ) {
          return "Editing Started";
        }
        if (
          um.getStack().indexOf(item) === 0 &&
          !target &&
          type === undefined &&
          um.getStack().length === 1
        ) {
          return "Initial State";
        }

        return actionLabel;
      };

      const updateHistoryList = () => {
        if (!editorInstance) return;
        const stack = um.getStack();
        const formattedActions = stack
          .map((item: any, index: number) => ({
            id: index,
            name: getActionName(item),
            timestamp: new Date().toLocaleTimeString("vi-VN"),
            type: item.get("type") || "initial",
            targetName:
              item.get("target")?.getName() ||
              item.get("target")?.get("tagName"),
          }))
          .reverse(); // Reverse to show newest first
        setHistoryActions(formattedActions);
      };

      // Initial history population and listen for changes
      updateHistoryList();
      editorInstance.on(
        "undo redo component:update component:add component:remove change:canvasOffset",
        updateHistoryList
      );

      editorInstance.Commands.add("show-history", {
        run: () => {
          updateHistoryList(); // Ensure list is up-to-date when opening
          setShowHistory(true);
          document.getElementById("history-panel")?.classList.remove("hidden");
        },
        stop: () => {
          setShowHistory(false);
          document.getElementById("history-panel")?.classList.add("hidden");
        },
      });

      const applyHistoryAction = (actionId: number) => {
        if (!editorInstance) return;
        const stack = um.getStack();
        const originalStackIndex = stack.length - 1 - actionId;

        if (originalStackIndex < 0 || originalStackIndex >= stack.length)
          return;

        // Cách dò vị trí hiện tại: tìm phần tử cuối cùng khớp với editor hiện tại
        const currentHtml = editorInstance.getHtml();
        const currentCss = editorInstance.getCss();

        const currentIndex = stack.findIndex((s: { html: any; css: any }) => {
          return s.html === currentHtml && s.css === currentCss;
        });

        if (currentIndex === -1) {
          console.warn(
            "Không xác định được trạng thái hiện tại trong history."
          );
          return;
        }

        const stepsToUndo = currentIndex - originalStackIndex;
        const stepsToRedo = originalStackIndex - currentIndex;

        if (stepsToUndo > 0) {
          for (let i = 0; i < stepsToUndo; i++) um.undo();
        } else if (stepsToRedo > 0) {
          for (let i = 0; i < stepsToRedo; i++) um.redo();
        }

        updateHistoryList();
      };

      // Attach to window for access from JSX, or pass down through props if preferred
      (window as any).applyHistoryAction = applyHistoryAction;

      // --- END: History Feature Logic ---

      // Tạo command để hiển thị dialog lưu phiên bản
      editorInstance.Commands.add("show-save-dialog", {
        run: function () {
          setShowSavedList(false);
          document.getElementById("save-dialog")?.classList.remove("hidden");
        },
        stop: function () {
          document.getElementById("save-dialog")?.classList.add("hidden");
        },
      });

      // Tạo command để hiển thị danh sách phiên bản
      editorInstance.Commands.add("show-versions-list", {
        run: function () {
          setShowSavedList(true);
          document.getElementById("versions-list")?.classList.remove("hidden");
        },
        stop: function () {
          document.getElementById("versions-list")?.classList.add("hidden");
        },
      });

      // Running commands from panels
      const pn = editorInstance.Panels;
      const panelOpts = pn.addPanel({
        id: "options",
      });
      // Thêm nút template manager vào thanh công cụ
      panelOpts.get("buttons").add([
        {
          attributes: {
            title: "Chọn mẫu trang",
          },
          className: "fa fa-file-o",
          command: "open-templates", //Open modal
          id: "open-templates",
        },
      ]);

      // Thêm nút lưu vào thanh công cụ
      pn.addButton("options", {
        id: "save-version",
        className: "fa fa-floppy-o",
        command: "show-save-dialog",
        attributes: { title: "Lưu phiên bản" },
      });

      // Add History Button to Panel
      pn.addButton("options", {
        id: "view-history",
        className: "fa fa-history",
        command: "show-history",
        attributes: { title: "Lịch sử chỉnh sửa" },
      });

      // Thêm nút xem danh sách phiên bản đã lưu
      pn.addButton("options", {
        id: "view-versions",
        className: "fa fa-list",
        command: "show-versions-list",
        attributes: { title: "Xem danh sách phiên bản" },
      });

      // 🛠️ Thêm logo vào giữa thanh công cụ
      setTimeout(() => {
        const panelButtons = document.querySelector(
          ".gjs-pn-panels .gjs-pn-buttons"
        );
        if (panelButtons && !panelButtons.querySelector(".custom-logo")) {
          const logo = document.createElement("img");
          logo.src = "/mbbank/Logo_MB_new.png"; // 🔹 Đường dẫn logo của bạn
          logo.alt = "Logo";
          logo.className = "custom-logo"; // 🔥 Gán class để sau này dễ kiểm tra
          logo.style.height = "40px";
          logo.style.margin = "0 auto";

          // Thêm logo vào giữa các nút
          panelButtons.insertBefore(
            logo,
            panelButtons.children[Math.floor(panelButtons.children.length / 2)]
          );
        }
      }, 500);
      // Đợi GrapesJS load xong trước khi chèn logo
    }
  }, []);

  // Hàm lưu phiên bản hiện tại
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
    document.getElementById("save-dialog")?.classList.add("hidden");
  };

  // Hàm tải phiên bản đã lưu
  const loadVersion = (version: SavedVersion) => {
    if (!editor) return;

    editor.setComponents(version.html);
    editor.setStyle(version.css);

    document.getElementById("versions-list")?.classList.add("hidden");
  };

  // Hàm xóa phiên bản đã lưu
  const deleteVersion = (id: string) => {
    const updatedVersions = savedVersions.filter((v) => v.id !== id);
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      "mbbank-builder-versions",
      JSON.stringify(updatedVersions)
    );
  };

  return (
    <main className="flex h-screen relative">
      <div
        className="flex-1 w-full h-full overflow-hidden"
        ref={editorRef}
      ></div>

      {/* Dialog lưu phiên bản */}
      <div
        id="save-dialog"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96"
      >
        <h2 className="text-xl font-bold mb-4">Lưu phiên bản</h2>
        <input
          type="text"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Nhập tên phiên bản"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() =>
              document.getElementById("save-dialog")?.classList.add("hidden")
            }
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Hủy
          </button>
          <button
            onClick={saveCurrentVersion}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!versionName.trim()}
          >
            Lưu
          </button>
        </div>
      </div>

      {/* Danh sách phiên bản đã lưu */}
      <div
        id="versions-list"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-[500px] max-h-[80vh] overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4">Danh sách phiên bản đã lưu</h2>
        {savedVersions.length === 0 ? (
          <p className="text-gray-500">Chưa có phiên bản nào được lưu</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {savedVersions.map((version) => (
              <li key={version.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{version.name}</h3>
                    <p className="text-sm text-gray-500">{version.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadVersion(version)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => deleteVersion(version.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() =>
              document.getElementById("versions-list")?.classList.add("hidden")
            }
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Đóng
          </button>
        </div>
      </div>
      {/* History Panel */}
      <div
        id="history-panel"
        className="fixed top-0 right-0 h-screen bg-white shadow-lg z-40 w-[350px] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 bg-purple-700 text-white">
          <h2 className="text-lg font-semibold">Lịch sử</h2>
          <button
            onClick={() => editor?.Commands.run("show-history")}
            className="text-white hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveHistoryTab("actions")}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
              activeHistoryTab === "actions"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            HÀNH ĐỘNG
          </button>
          <button
            onClick={() => setActiveHistoryTab("versions")}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
              activeHistoryTab === "versions"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            BẢN SỬA ĐỔI
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {activeHistoryTab === "actions" && (
            <div>
              {historyActions.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">
                  Chưa có hành động nào.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {historyActions.map(
                    (
                      action,
                      idx // Use original index for key if action.id is not unique enough or stable
                    ) => (
                      <li
                        key={`${action.name}-${action.timestamp}-${idx}`} // More robust key
                        // className={`p-3 hover:bg-gray-100 cursor-pointer text-sm ${
                        //   editor?.UndoManager &&
                        //   editor?.UndoManager?.getIndex() &&
                        //   editor?.UndoManager?.getStack().length -
                        //     1 -
                        //     editor?.UndoManager?.getIndex() ===
                        //     action.id
                        //     ? "bg-purple-100 border-l-4 border-purple-500"
                        //     : ""
                        // }`}
                        className={`p-3 hover:bg-gray-100 cursor-pointer text-sm`}
                        onClick={() =>
                          (window as any).applyHistoryAction(action.id)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            {action.name}
                          </span>
                          {/* Simple visual indicator based on action type */}
                          {action.type === "add" && (
                            <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                          )}
                          {action.type === "remove" && (
                            <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                          )}
                          {(action.type === "update" ||
                            action.type === "style" ||
                            action.type === "change") && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {action.timestamp}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          {activeHistoryTab === "versions" && (
            <div>
              {savedVersions.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">
                  Chưa có bản sửa đổi nào được lưu.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {savedVersions.map((version) => (
                    <li key={version.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-700 text-sm">
                            {version.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {version.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadVersion(version)}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => deleteVersion(version.id)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {activeHistoryTab === "actions" && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => setActiveHistoryTab("versions")}
              className="w-full py-2 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
            >
              Chuyển tới Bản sửa đổi cho các phiên bản cũ hơn
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
