/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
/* eslint-disable import/no-anonymous-default-export */

export default (editor, opts = {}) => {
  const dc = editor.DomComponents;
  const defaultType = dc.getType("default");
  const defaultView = defaultType.view;

  // Định nghĩa các type con
  dc.addType("accordion-header", {
    model: {
      defaults: {
        tagName: "div",
        classes: ["accordion-header"],
        editable: true,
        droppable: false,
        content: "Mục",
      },
    },
  });
  dc.addType("accordion-body", {
    model: {
      defaults: {
        tagName: "div",
        classes: ["accordion-body"],
        editable: true,
        droppable: true,
        content: "Nội dung mục",
      },
    },
  });
  dc.addType("accordion-content", {
    model: {
      defaults: {
        tagName: "div",
        classes: ["accordion-content"],
        droppable: true,
        editable: true,
      },
    },
  });
  dc.addType("accordion-item", {
    model: {
      defaults: {
        tagName: "div",
        classes: ["accordion-item"],
        droppable: true,
        editable: true,
      },
    },
  });

  dc.addType(opts.name, {
    model: {
      defaults: {
        traits: [
          {
            type: "number",
            name: "itemCount",
            label: "Số lượng mục",
            min: 1,
            max: 20,
            default: 3,
            changeProp: 1,
          },
          {
            type: "checkbox",
            name: "multipleOpen",
            label: "Cho phép mở nhiều mục",
            changeProp: 1,
          },
          {
            type: "checkbox",
            name: "collapsible",
            label: "Cho phép đóng tất cả",
            default: true,
            changeProp: 1,
          },
          {
            type: "number",
            name: "animationSpeed",
            label: "Tốc độ animation (ms)",
            default: 300,
            changeProp: 1,
          },
          {
            type: "select",
            name: "headerStyle",
            label: "Kiểu header",
            options: [
              { value: "default", name: "Mặc định" },
              { value: "rounded", name: "Bo tròn" },
              { value: "bordered", name: "Viền đậm" },
            ],
            changeProp: 1,
          },
        ],
        components: [
          {
            tagName: "div",
            classes: ["myAccordion"],
            components: Array.from({ length: 3 }).map((_, i) => ({
              type: "accordion-item",
              classes:
                i === 0 ? ["accordion-item", "active"] : ["accordion-item"],
              components: [
                {
                  type: "accordion-header",
                  content: `Mục ${i + 1}`,
                },
                {
                  type: "accordion-content",
                  style: i === 0 ? { padding: "15px", maxHeight: "500px" } : {},
                  components: [
                    {
                      type: "accordion-body",
                      content: `Nội dung mục ${i + 1}`,
                    },
                  ],
                },
              ],
            })),
          },
        ],
        script: function () {
          const multipleOpen = "{[ multipleOpen ]}" === "true";
          const collapsible = "{[ collapsible ]}" === "true";
          const animationSpeed = parseInt("{[ animationSpeed ]}") || 300;
          const headerStyle = "{[ headerStyle ]}" || "default";
          const isEditor = typeof grapesjs !== "undefined";

          // Áp dụng class cho header
          const applyHeaderStyle = () => {
            const headers = this.querySelectorAll(".accordion-header");
            headers.forEach((header) => {
              header.classList.remove(
                "header-default",
                "header-rounded",
                "header-bordered"
              );
              switch (headerStyle) {
                case "rounded":
                  header.classList.add("header-rounded");
                  break;
                case "bordered":
                  header.classList.add("header-bordered");
                  break;
                default:
                  header.classList.add("header-default");
                  break;
              }
            });
          };

          // Gắn sự kiện và xử lý accordion khi chạy thực
          const initAccordion = () => {
            const headers = this.querySelectorAll(".accordion-header");
            headers.forEach((header) => {
              header.onclick = null;
              header.addEventListener("click", function () {
                const item = this.parentElement;
                const isActive = item.classList.contains("active");

                if (!collapsible && isActive) return;

                if (!multipleOpen) {
                  const siblings = this.closest(".myAccordion").children;
                  Array.from(siblings).forEach((sibling) => {
                    sibling.classList.remove("active");
                  });
                }

                item.classList.toggle("active");
              });
            });
          };

          // Gắn CSS transition bằng style nếu không có sẵn (chỉ khi chạy thực)
          const applyAnimationStyle = () => {
            const contents = this.querySelectorAll(".accordion-content");
            contents.forEach((content) => {
              content.style.transition = `max-height ${animationSpeed}ms ease, padding ${animationSpeed}ms ease`;
            });
          };

          applyHeaderStyle();
          if (!isEditor) {
            applyAnimationStyle();
            initAccordion();
          }
        },
      },
      init() {
        this.on("change:itemCount", this.handleItemCountChange);
      },
      handleItemCountChange() {
        const itemCount = this.get("itemCount") || 3;
        const accordion = this.components().at(0); // .myAccordion
        const current = accordion.components().length;
        // Thêm hoặc bớt item
        if (itemCount > current) {
          for (let i = current; i < itemCount; i++) {
            accordion.append({
              type: "accordion-item",
              classes:
                i === 0 ? ["accordion-item", "active"] : ["accordion-item"],
              components: [
                {
                  type: "accordion-header",
                  content: `Mục ${i + 1}`,
                },
                {
                  type: "accordion-content",
                  style: i === 0 ? { padding: "15px", maxHeight: "500px" } : {},
                  components: [
                    {
                      type: "accordion-body",
                      content: `Nội dung mục ${i + 1}`,
                    },
                  ],
                },
              ],
            });
          }
        } else if (itemCount < current) {
          for (let i = current - 1; i >= itemCount; i--) {
            accordion.components().at(i).remove();
          }
        }
      },
    },

    isComponent: (el) => {
      if (el.classList && el.classList.contains("accordion-container")) {
        return {
          type: opts.name,
        };
      }
    },

    view: defaultView.extend({
      init({ model }) {
        this.listenTo(model, "change:itemCount", this.updateScript);
        this.listenTo(model, "change:multipleOpen", this.updateScript);
        this.listenTo(model, "change:collapsible", this.updateScript);
        this.listenTo(model, "change:animationSpeed", this.updateScript);
        this.listenTo(model, "change:headerStyle", this.updateScript);
      },
      updateScript() {
        this.reloadAccordion();
      },
      reloadAccordion() {
        const el = this.el;
        if (!el) return;
        const script = this.model.get("script");
        if (script && typeof script === "function") {
          script.call(el);
        }
      },
    }),
  });
};
