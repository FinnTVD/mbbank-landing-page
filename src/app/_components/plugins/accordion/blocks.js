/* eslint-disable import/no-anonymous-default-export */
export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const style = `<style>
    .accordion-container {
      width: 100%;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .accordion-item {
      border-bottom: 1px solid #ddd;
    }
    .accordion-item:last-child {
      border-bottom: none;
    }

    .accordion-header {
      background-color: #f4f4f4;
      padding: 15px;
      cursor: pointer;
      position: relative;
      font-weight: bold;
      box-sizing: border-box;
    }

    .accordion-header::after {
      content: '+';
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    .accordion-item.active .accordion-header::after {
      content: '-';
    }

    .accordion-content {
      padding: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 300ms ease-out, padding 300ms ease-out;
      box-sizing: border-box;
    }
    .accordion-item.active .accordion-content {
      padding: 15px;
      max-height: 500px;
    }

    .accordion-body {
      padding: 15px;
      box-sizing: border-box;
    }

    /* Header style options from trait */
    .header-default {
      border: 1px solid #ccc;
    }

    .header-rounded {
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .header-bordered {
      border: 2px solid #000;
    }
  </style>`;

  bm.add(opts.name, {
    label: `${opts.label}`,
    media: `
    <svg viewBox="0 0 24 24">
      <path d="M3 17h18v2H3v-2zm0-7h18v2H3v-2zm0-7h18v2H3V3z" fill-rule="nonzero"></path>
    </svg>
    `,
    category: opts.category,
    content: `<div class="accordion-container myAccordion"></div> ${style}`,
  });
};
