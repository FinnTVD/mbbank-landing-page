/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";

// STYLE MODULES
import "@/modules/grapesjs/dist/css/grapes.min.css";
// import "@/modules/grapesjs-template-manager/dist/grapesjs-template-manager.min.css";

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

// PLUGINS CUSTOMS
import pluginCustom from "./plugin-custom";
import swiperCustom from "@/app/_components/plugins/swiper";
import templatesPlugin from "./templates-plugin";
import accordionPlugin from "@/app/_components/plugins/accordion";

// CONFIG PANEL BUTTONS
import {
  capitalizeFirstLetter,
  getChangedAttributeKeys,
  HistoryItem,
  panelOptsButtons,
  SavedVersion,
} from "@/app/_components/config";
import FileManager from "./plugins/file-manager/FileManager";
import Image from "next/image";

// Đặt biến cờ ngoài component
let hasInitialHistory = false;
let lastAttrChange = { key: "", value: "", time: 0 };

export default function IndexGrapesJS() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editor, setEditor] = useState<any | null>(null);
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);
  const [versionName, setVersionName] = useState("");
  const [editHistory, setEditHistory] = useState<HistoryItem[]>([]);
  const [saveType, setSaveType] = useState<"page" | "template">("page"); // State cho lựa chọn loại lưu trữ khi lưu
  const [activeTab, setActiveTab] = useState<"page" | "template">("page"); // State cho tab đang active trong danh sách
  const [thumbnail, setThumbnail] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Kiểm tra xem đã lưu phiên bản trước đó chưa
    const savedData = localStorage.getItem("mbbank-builder-versions");
    if (savedData) {
      try {
        // Cần xử lý dữ liệu cũ có thể không có trường 'type'
        const parsedData: SavedVersion[] = JSON.parse(savedData);
        setSavedVersions(
          parsedData.map((item) => ({
            ...item,
            type: item.type || "page", // Gán type mặc định nếu không tồn tại
          }))
        );
      } catch (e) {
        console.error("Failed to parse saved versions:", e);
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
        undoManager: { trackChanges: true },
        plugins: [
          // customs
          pluginCustom,
          swiperCustom,
          templatesPlugin,
          accordionPlugin,
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
          // Cấu hình cho templatesPlugin nếu cần
        },
      });

      // Xóa tất cả các component và style
      editorInstance.setComponents("");
      editorInstance.setStyle("");

      setEditor(editorInstance);

      // === Thêm Tooltip cho các button panel có sẵn ===
      // Lấy tất cả các panels
      const panels = editorInstance.Panels.getPanels();

      // Lặp qua từng panel
      panels.forEach((panel: any) => {
        // Lấy tất cả các button trong panel
        const buttons = panel.get("buttons");

        // Lặp qua từng button và thêm attribute title
        buttons.forEach((button: any) => {
          const buttonId = button.get("id");
          const buttonLabel = button.get("label");
          // Đặt title dựa trên ID hoặc label của button
          if (buttonId) {
            button.set("attributes", { title: `${buttonLabel || buttonId}` });
          }
        });
      });
      // === Kết thúc thêm Tooltip ===

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
        // Giới hạn lịch sử không quá 50 mục
        setEditHistory((prevHistory) => [
          newHistoryItem,
          ...prevHistory.slice(0, 49),
        ]);
      };

      editorInstance.on(
        "block:drag:stop",
        (
          component: { getName: () => any; get: (arg0: string) => any },
          block: { getLabel: () => any }
        ) => {
          captureHistoryState(
            `Đã thêm khối: ${
              block.getLabel() || component.getName() || component.get("type")
            }`
          );
        }
      );

      editorInstance.on(
        "component:remove",
        (component: { getName: () => any; get: (arg0: string) => any }) =>
          captureHistoryState(
            `Đã xóa: ${component.getName() || component.get("type")}`
          )
      );

      editorInstance.on(
        "component:clone",
        (component: { getName: () => any; get: (arg0: string) => any }) =>
          captureHistoryState(
            `Nhân bản: ${component.getName() || component.get("type")}`
          )
      );

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
          const el = component.getEl();
          if (!el) return;

          // Chọn các phần tử có thể chỉnh sửa nội dung
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
        const changedProps = Object.keys(style || {});
        const changedPropsStyle = Object.keys(style?.style || {});
        let propDetails = "";
        // Chỉ hiển thị chi tiết thuộc tính nếu số lượng thay đổi ít
        if (changedProps.length > 0 && changedProps.length <= 3) {
          propDetails = `${changedProps.join(", ")}`;
        }
        const selected = editorInstance.getSelected();
        const targetName = selected
          ? selected.getName() || selected.get("type")
          : "Đối tượng"; // Tên đối tượng bị ảnh hưởng
        captureHistoryState(
          `${capitalizeFirstLetter(propDetails)}: "${capitalizeFirstLetter(
            changedPropsStyle?.[0] // Lấy tên thuộc tính style đầu tiên
          )}" cho ${targetName}`
        );
      });

      editorInstance.on(
        "component:update:attributes",
        (model: any, attrName: string) => {
          // if (!attrName) return; // Bỏ qua nếu không có tên attribute (có thể xảy ra với một số type update)
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
          lastAttrChange = { key: attrName, value: attrValue, time: now }; // Cập nhật lần thay đổi cuống
          const listKeys = getChangedAttributeKeys(
            // Lấy danh sách các attribute bị thay đổi
            model?.changed,
            model?._previousAttributes
          );
          // Chỉ ghi lịch sử nếu có attribute thay đổi
          if (listKeys.length) {
            captureHistoryState(
              `Component settings : "${capitalizeFirstLetter(
                listKeys[listKeys.length - 1] // Lấy tên attribute cuối cùng thay đổi
              )}" cho ${targetName}`
            );
          }
        }
      );

      // Ghi lại trạng thái ban đầu sau khi editor load hoàn tất và canvas sẵn sàng
      editorInstance.on("load", () => {
        setTimeout(() => {
          if (!hasInitialHistory) {
            captureHistoryState("Trạng thái ban đầu");
            hasInitialHistory = true;
          }
        }, 100);

        // Tải các template đã lưu vào templatesPlugin khi editor sẵn sàng
        const savedTemplates = savedVersions.filter(
          (v) => v.type === "template"
        );
        // Giả định templatesPlugin có method addTemplate
        savedTemplates.forEach((template) => {
          // Check if templatesPlugin and its addTemplate method exist
          if (
            editorInstance.TemplatesPlugin &&
            typeof editorInstance.TemplatesPlugin.addTemplate === "function"
          ) {
            editorInstance.TemplatesPlugin.addTemplate({
              id: template.id, // Sử dụng ID đã lưu
              name: template.name,
              html: template.html,
              css: template.css,
              thumbnail: template.thumbnail || "", // Bao gồm thumbnail nếu có
              // Các thuộc tính khác mà templatesPlugin của bạn cần
            });
          } else {
            console.warn(
              "templatesPlugin or its addTemplate method not found."
            );
            // Xử lý hoặc thông báo lỗi nếu plugin không đúng cấu hình
          }
        });
      });

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

      // 🛠️ Thêm nút mở dialog lưu phiên bản
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
          // Khi mở dialog danh sách, đảm bảo tab đang active được cập nhật nếu cần
          // Ví dụ: bạn có thể muốn mặc định mở tab "Page" hoặc tab được sử dụng gần nhất
          setActiveTab("page"); // Mặc định mở tab "Page"
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
          sender: { set: (arg0: string, arg1: boolean) => void },
          options: { purpose?: string } = {}
        ) {
          if (sender && typeof (sender as any).set === "function") {
            (sender as any).set("active", true);
          }
          const el = document.getElementById("file-manager-panel");
          if (el) {
            el.classList.remove("hidden");
            // Lưu mục đích sử dụng vào window để FileManager component có thể truy cập
            (window as any).fileManagerPurpose = options.purpose || "default";
          }
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
      // Sử dụng requestAnimationFrame hoặc đợi cho panel render xong nếu setTimeout không đủ
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
      }, 500); // Có thể cần điều chỉnh thời gian timeout
    }

    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
        // Reset biến cờ khi component unmount
        hasInitialHistory = false;
        lastAttrChange = { key: "", value: "", time: 0 };
      }
    };
  }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

  const removeActivePanel = (id: string) => {
    if (typeof window === "undefined" || !editor) return;
    editor.Panels.getButton("options", id)?.set("active", false);
  };

  // Hàm mở file manager cho thumbnail
  const openFileManagerForThumbnail = () => {
    if (editor) {
      (window as any).onFileSelectForThumbnail = (file: { name: string }) => {
        setThumbnail(file.name); // hoặc file.path nếu có
        editor?.Commands.stop("open-file-manager");
        removeActivePanel("open-file-manager");
      };
      editor.stopCommand("open-file-manager"); // đảm bảo trạng thái về false
      editor.runCommand("open-file-manager", { purpose: "thumbnail" });
    }
  };

  const saveCurrentVersion = () => {
    if (!editor || !versionName.trim()) return;
    const html = editor.getHtml();
    const css = editor.getCss();

    const newVersion: SavedVersion = {
      id: Date.now().toString(), // ID duy nhất dựa trên timestamp
      name: versionName,
      date: new Date().toLocaleString("vi-VN"),
      html,
      css,
      type: saveType, // Lưu loại phiên bản
      thumbnail: thumbnail, // Luôn lưu thumbnail cho cả page và template
    };

    // Nếu là template, thêm vào templatesPlugin nếu có
    if (saveType === "template") {
      if (
        editor?.TemplatesPlugin &&
        typeof editor.TemplatesPlugin.addTemplate === "function"
      ) {
        editor.TemplatesPlugin.addTemplate({
          id: newVersion.id,
          name: newVersion.name,
          html: newVersion.html,
          css: newVersion.css,
          thumbnail: newVersion.thumbnail || "",
        });
      } else {
        console.warn(
          "templatesPlugin or its addTemplate method not found when trying to add template."
        );
      }
    }

    // Lưu phiên bản vào localStorage (bao gồm cả page và template với thumbnail)
    const updatedVersions = [...savedVersions, newVersion];
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      "mbbank-builder-versions",
      JSON.stringify(updatedVersions)
    );
    setVersionName("");
    setThumbnail(""); // Reset thumbnail sau khi lưu
    setSaveType("page"); // Reset loại lưu trữ về mặc định sau khi lưu
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
        action: `Đã tải ${
          version.type === "page" ? "phiên bản trang" : "template"
        }: ${version.name}`,
        timestamp: new Date().toLocaleTimeString("vi-VN"),
        html: version.html,
        css: version.css,
      },
      ...prev.slice(0, 49), // Giữ lịch sử không quá 50 mục
    ]);
    // Đóng dialog sau khi tải
    editor?.Commands.stop("show-versions-list");
    removeActivePanel("view-versions");
  };

  const deleteVersion = (id: string) => {
    // Tìm phiên bản cần xóa để kiểm tra loại
    const versionToDelete = savedVersions.find((v) => v.id === id);

    const updatedVersions = savedVersions.filter((v) => v.id !== id);
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      "mbbank-builder-versions",
      JSON.stringify(updatedVersions)
    );

    // Nếu là template, cần xóa cả trong templatesPlugin (nếu plugin có API hỗ trợ)
    if (versionToDelete?.type === "template") {
      if (
        editor?.TemplatesPlugin &&
        typeof editor.TemplatesPlugin.removeTemplate === "function"
      ) {
        editor.TemplatesPlugin.removeTemplate(id); // Giả định removeTemplate nhận ID
      } else {
        console.warn(
          "templatesPlugin or its removeTemplate method not found when trying to remove template."
        );
        // Xử lý hoặc thông báo lỗi nếu plugin không đúng cấu hình
      }
    }
  };

  const loadHistoryState = (historyItem: HistoryItem) => {
    if (!editor) return;
    editor.setComponents(historyItem.html);
    editor.setStyle(historyItem.css);
    // Đóng dialog lịch sử sau khi khôi phục
    editor?.Commands.stop("show-edit-history");
    removeActivePanel("view-edit-history");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);

      // Reset input file để xóa tên file hiển thị
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Lọc danh sách phiên bản dựa trên tab đang active
  const filteredVersions = savedVersions.filter(
    (version) => version.type === activeTab
  );

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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn loại lưu trữ:
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center cursor-pointer">
              {" "}
              {/* Thêm cursor-pointer */}
              <input
                type="radio"
                className="form-radio text-blue-600 focus:ring-blue-500" // Thêm style
                name="saveType"
                value="page"
                checked={saveType === "page"}
                onChange={() => setSaveType("page")}
              />
              <span className="ml-2 text-gray-700">Trang (Page)</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              {" "}
              {/* Thêm cursor-pointer */}
              <input
                type="radio"
                className="form-radio text-blue-600 focus:ring-blue-500" // Thêm style
                name="saveType"
                value="template"
                checked={saveType === "template"}
                onChange={() => setSaveType("template")}
              />
              <span className="ml-2 text-gray-700">Mẫu (Template)</span>
            </label>
          </div>
        </div>
        <input
          type="text"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          placeholder="Nhập tên phiên bản..."
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {thumbnail && (
          <div className="w-full h-fit relative pb-3">
            <Image
              className="w-full h-auto object-contain rounded-[0.5rem]"
              src={thumbnail}
              alt=""
              width={200}
              height={150}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <span className="block my-2">Hoặc</span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          type="button"
          onClick={openFileManagerForThumbnail}
        >
          File Manager 📁
        </button>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              editor?.Commands.stop("show-save-dialog");
              removeActivePanel("save-version");
              setVersionName(""); // Reset tên phiên bản khi đóng dialog
              setSaveType("page"); // Reset loại lưu trữ về mặc định
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
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[500px] max-h-[80vh] flex flex-col border border-gray-300" // Sử dụng flexbox
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Phiên bản đã lưu
        </h2>
        {/* Tab Navigation */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm outline-none ${
                activeTab === "page"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("page")}
            >
              Trang ({savedVersions.filter((v) => v.type === "page").length})
            </button>
            <button
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm outline-none ${
                activeTab === "template"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("template")}
            >
              Mẫu ({savedVersions.filter((v) => v.type === "template").length})
            </button>
          </nav>
        </div>

        {/* Danh sách phiên bản (được lọc) */}
        <div className="flex-1 overflow-y-auto">
          {/* Sử dụng flex-1 và overflow-y-auto */}
          {filteredVersions.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              {activeTab === "page"
                ? "Chưa có phiên bản trang nào được lưu."
                : "Chưa có mẫu nào được lưu."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredVersions.map((version) => (
                <li key={version.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image
                        className="w-[120px] h-auto rounded-[0.5rem]"
                        src={version.thumbnail || ""}
                        alt=""
                        width={400}
                        height={300}
                      />
                      <div className="pl-[1rem]">
                        <h3 className="font-medium text-gray-800">
                          {version.name}
                        </h3>
                        <p className="text-sm text-gray-500">{version.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadVersion(version)}
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
        </div>

        <div className="mt-6 flex justify-end shrink-0">
          {" "}
          {/* Sử dụng shrink-0 để không bị co */}
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
          <p className="text-gray-500 italic text-center py-4">
            {" "}
            {/* Thêm text-center, py-4 */}
            Chưa có thay đổi nào được ghi lại.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {editHistory.map((item) => (
              <li
                key={item.id}
                className="py-3 group hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">
                      {item.action}
                    </h3>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  <button
                    onClick={() => loadHistoryState(item)}
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

      {/* Dialog file manager */}
      <div
        id="file-manager-panel"
        className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[600px] max-h-[80vh] overflow-auto border border-gray-300"
      >
        <FileManager
          onFileSelect={(file: any) => {
            // Kiểm tra mục đích sử dụng của file manager
            const purpose = (window as any).fileManagerPurpose || "default";

            if (purpose === "thumbnail") {
              // Nếu mở file manager để chọn thumbnail
              if (
                typeof (window as any).onFileSelectForThumbnail === "function"
              ) {
                (window as any).onFileSelectForThumbnail(file);
              }
            } else {
              // Xử lý mặc định cho editor
              if (editor && file.type === "file") {
                const selected = editor.getSelected();
                if (selected && selected.is("image")) {
                  selected.set("src", `${file.name}`);
                } else {
                  // Hoặc thêm mới một image vào canvas
                  editor.addComponents({
                    type: "image",
                    src: `${file.name}`,
                    attributes: {
                      width: "100%",
                      height: "auto",
                    },
                  });
                }
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
