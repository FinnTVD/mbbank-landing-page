/* eslint-disable no-undef */
/* eslint-disable import/no-anonymous-default-export */

export default (editor, opts = {}) => {
  const dc = editor.DomComponents;
  const defaultType = dc.getType("default");
  const defaultView = defaultType.view;

  dc.addType(opts.name, {
    model: {
      defaults: {
        traits: [
          {
            type: "checkbox",
            name: "dynamicProgress",
            label: "Dynamic Progress",
            changeProp: 1,
          },
          {
            type: "select",
            name: "progressType",
            label: "Progress Type",
            changeProp: 1,
            options: [
              { value: "bullets", name: "Bullets" },
              { value: "fraction", name: "Fraction" },
              { value: "progressbar", name: "Progressbar" },
            ],
          },
          {
            type: "checkbox",
            name: "loop",
            label: "Loop",
            changeProp: 1,
          },
          {
            type: "number",
            name: "speed",
            label: "Speed (ms)",
            changeProp: 1,
            placeholder: "300",
          },
          {
            type: "number",
            name: "spaceBetween",
            label: "Space Between (px)",
            changeProp: 1,
            placeholder: "30",
          },
          {
            type: "checkbox",
            name: "centeredSlides",
            label: "Centered Slides",
            changeProp: 1,
          },
          {
            type: "number",
            name: "slidesPerView",
            label: "Slides Per View",
            changeProp: 1,
            placeholder: "1",
          },
          {
            type: "checkbox",
            name: "autoplay",
            label: "Autoplay",
            changeProp: 1,
          },
          {
            type: "number",
            name: "autoplayDelay",
            label: "Autoplay Delay (ms)",
            changeProp: 1,
            placeholder: "2500",
          },
        ],
        script: function () {
          const dynamicProgress = "{[ dynamicProgress ]}" === "true";
          const autoplay = "{[ autoplay ]}" === "true";

          const progressType = "{[ progressType ]}";
          const loop = "{[ loop ]}" === "true";
          const speed = parseInt("{[ speed ]}") || 300;
          const spaceBetween = parseInt("{[ spaceBetween ]}") || 30;
          const centeredSlides = "{[ centeredSlides ]}" === "true";
          const slidesPerView = parseInt("{[ slidesPerView ]}") || 1;
          const autoplayDelay = parseInt("{[ autoplayDelay ]}") || 2500;

          const initLib = () => {
            if (this.swiperInstance && this.swiperInstance.destroy) {
              this.swiperInstance.destroy(true, true);
            }
            this.swiperInstance = new Swiper(".mySwiper", {
              spaceBetween,
              slidesPerView,
              speed,
              loop,
              centeredSlides: centeredSlides,
              autoplay: autoplay
                ? {
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                  }
                : false,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: dynamicProgress,
                type: progressType,
              },
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
            });
          };

          if (typeof Swiper == "undefined") {
            const script = document.createElement("script");
            const link = document.createElement("link");

            script.onload = initLib.bind(this);
            script.src =
              "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";

            link.rel = "stylesheet";
            link.href =
              "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";

            document.head.appendChild(link);
            document.body.appendChild(script);
          } else {
            initLib.call(this);
          }
        },
      },
    },

    isComponent: (el) => {
      if (el.classList && el.classList.contains("swiper-container")) {
        return {
          type: opts.name,
        };
      }
    },

    view: defaultView.extend({
      init({ model }) {
        this.listenTo(model, "change:dynamicProgress", this.updateScript);
        this.listenTo(model, "change:progressType", this.updateScript);
        // Lắng nghe thêm các trait khác để cập nhật Swiper khi thay đổi
        this.listenTo(model, "change:loop", this.updateScript);
        this.listenTo(model, "change:speed", this.updateScript);
        this.listenTo(model, "change:spaceBetween", this.updateScript);
        this.listenTo(model, "change:centeredSlides", this.updateScript);
        this.listenTo(model, "change:slidesPerView", this.updateScript);
        this.listenTo(model, "change:autoplay", this.updateScript);
        this.listenTo(model, "change:autoplayDelay", this.updateScript);
      },
      reloadSwiper() {
        // Lấy element HTML thật
        const el = this.el;
        if (!el) return;

        // Hủy slider cũ nếu có
        if (window.sliderSwiper && window.sliderSwiper.destroy) {
          window.sliderSwiper.destroy(true, true);
        }

        // Gọi lại script() tương đương như trong model
        const script = this.model.get("script");
        if (script && typeof script === "function") {
          script.call(el);
        }
      },
    }),
  });
};
