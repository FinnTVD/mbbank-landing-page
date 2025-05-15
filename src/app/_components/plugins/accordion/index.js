import grapesjs from "grapesjs";
import loadComponents from "./components";
import loadBlocks from "./blocks";

export default grapesjs.plugins.add(
  "accordionComponent",
  (editor, opts = {}) => {
    let options = {
      label: "Accordion",
      name: "custom-accordion",
      category: "MB Bank Custom",
    };
    for (let name in options) {
      if (!(name in opts)) opts[name] = options[name];
    }

    loadBlocks(editor, options);
    loadComponents(editor, opts);
  }
);
