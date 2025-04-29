/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "@/modules/grapesjs/dist/css/grapes.min.css";

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

// Import plugin Destack vừa tạo
import pluginCustom from "./plugin-custom";
import grapesjsSwiperSlider from "grapesjs-swiper-slider"; // plugin
import swiperCustom from "@/app/_components/plugins/swiper"; // plugin

// Định nghĩa kiểu dữ liệu cho bản lưu
interface SavedVersion {
  id: string;
  name: string;
  date: string;
  html: string;
  css: string;
}

export default function IndexGrapesJS() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [versionName, setVersionName] = useState("");

  useEffect(() => {
    // Khôi phục danh sách các bản lưu từ localStorage khi component được mount
    const savedData = localStorage.getItem("mbbank-builder-versions");
    // 🛠️ Nếu muốn reset localStorage lần đầu tiên
    localStorage.removeItem("mbbank-builder-versions");
    if (savedData) {
      setSavedVersions(JSON.parse(savedData));
    }

    if (editorRef.current) {
      const editorInstance = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "auto",
        fromElement: true,
        storageManager: { autoload: false },
        plugins: [
          // plugins custom
          pluginCustom,
          swiperCustom,
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
        ],
        pluginsOpts: {
          // plugins custom
          pluginCustom: {},
          swiperCustom: {},
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
        },
      });

      // 🧹 Xóa sạch template
      editorInstance.setComponents("");
      editorInstance.setStyle("");

      setEditor(editorInstance);

      // Thêm nút lưu vào thanh công cụ
      editorInstance.Panels.addButton("options", {
        id: "save-version",
        className: "fa fa-floppy-o",
        command: "show-save-dialog",
        attributes: { title: "Lưu phiên bản" },
      });

      // Thêm nút xem danh sách phiên bản đã lưu
      editorInstance.Panels.addButton("options", {
        id: "view-versions",
        className: "fa fa-list",
        command: "show-versions-list",
        attributes: { title: "Xem danh sách phiên bản" },
      });

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
    </main>
  );
}
