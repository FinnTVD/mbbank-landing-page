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
import grapesjsTemplateManager from "grapesjs-template-manager";
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
    </main>
  );
}
