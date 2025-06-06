"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var traitInputAttr = {
  placeholder: 'bijv. Tekst hier'
};
var _default = exports.default = {
  assetManager: {
    addButton: 'Afbeelding toevoegen',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Selecteer afbeelding',
    uploadTitle: 'Zet bestanden hier neer of klik om te uploaden'
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Categorie Label',
    }
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: 'Tekst',
      comment: 'Commentaar',
      image: 'Afbeelding',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Kaart',
      tfoot: 'Tabel foot',
      tbody: 'Tabel body',
      thead: 'Tabel head',
      table: 'Tabel',
      row: 'Tabel rij',
      cell: 'Tabel cel'
    }
  },
  deviceManager: {
    device: 'Apparaat',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Mobile Landscape',
      mobilePortrait: 'Mobile Portrait'
    }
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Voorbeeld',
        fullscreen: 'Volledig scherm',
        'sw-visibility': 'Bekijk componenten',
        'export-template': 'Bekijk code',
        'open-sm': 'Open Stijl Manager',
        'open-tm': 'Instellingen',
        'open-layers': 'Open Laag Manager',
        'open-blocks': 'Open Blocks'
      }
    }
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Selecteer',
    emptyState: '- Status -',
    states: {
      hover: 'Zweven',
      active: 'Klik',
      'nth-of-type(2n)': 'Even/oneven'
    }
  },
  styleManager: {
    empty: 'Selecteer een element voordat je Stijl Manager kan gebruiken.',
    layer: 'Laag',
    fileButton: 'Afbeeldingen',
    sectors: {
      general: 'Algemeen',
      layout: 'Indeling',
      typography: 'Typografie',
      decorations: 'Decoraties',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Afmetingen'
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Uitlijning',
      display: 'Weergave',
      position: 'Positie',
      top: 'Boven',
      right: 'Rechts',
      left: 'Links',
      bottom: 'Onder',
      width: 'Breedte',
      height: 'Hoogte',
      'max-width': 'Breedte max.',
      'max-height': 'Hoogte max.',
      margin: 'Buiten afstand',
      'margin-top': 'Buiten afstand boven',
      'margin-right': 'Buiten afstand rechts',
      'margin-left': 'Buiten afstand links',
      'margin-bottom': 'Buiten afstand onder',
      padding: 'Binnen afstand',
      'padding-top': 'Binnen afstand boven',
      'padding-left': 'Binnen afstand links',
      'padding-right': 'Binnen afstand rechts',
      'padding-bottom': 'Binnen afstand onder',
      'font-family': 'Lettertype',
      'font-size': 'Lettergrootte',
      'font-weight': 'Letter dikte',
      'letter-spacing': 'Letter afstand',
      color: 'Kleur',
      'line-height': 'Regelafstand',
      'text-align': 'Tekst richting',
      'text-shadow': 'Tekst schaduw',
      'text-shadow-h': 'Tekst schaduw: horizontaal',
      'text-shadow-v': 'Tekst schaduw: verticaal',
      'text-shadow-blur': 'Tekst schaduw: vervagen',
      'text-shadow-color': 'Tekst schaduw: kleur',
      'border-top-left': 'Rand boven links',
      'border-top-right': 'Rand boven rechts',
      'border-bottom-left': 'Rand onder links',
      'border-bottom-right': 'Rand onder rechts',
      'border-radius-top-left': 'Rand straal boven links',
      'border-radius-top-right': 'Rand straal boven rechts',
      'border-radius-bottom-left': 'Rand straal onder links',
      'border-radius-bottom-right': 'Rand straal onder rechts',
      'border-radius': 'Rand straal',
      border: 'Rand',
      'border-width': 'Rand breedte',
      'border-style': 'Rand stijl',
      'border-color': 'Rand kleur',
      'box-shadow': 'Box schaduw',
      'box-shadow-h': 'Box schaduw: Horizontaal',
      'box-shadow-v': 'Box schaduw: Verticaal',
      'box-shadow-blur': 'Box schaduw: Vervagen',
      'box-shadow-spread': 'Box schaduw: Verspreiding',
      'box-shadow-color': 'Box schaduw: Kleur',
      'box-shadow-type': 'Box schaduw: Type',
      background: 'Achtergrond',
      'background-image': 'Achtergrond afbeelding',
      'background-repeat': 'Achtergrond herhalen',
      'background-position': 'Achtergrond positie',
      'background-attachment': 'Achtergrond bijlage',
      'background-size': 'Achtergrond grootte',
      'background-color': 'Achtergrond kleur',
      transition: 'Overgang',
      'transition-property': 'Overgang: Type',
      'transition-duration': 'Overgang: Duur',
      'transition-timing-function': 'Overgang: Timing',
      perspective: 'Perspectief',
      transform: 'Transformatie',
      'transform-rotate-x': 'Transformatie: Rotatie x',
      'transform-rotate-y': 'Transformatie: Rotatie y',
      'transform-rotate-z': 'Transformatie: Rotatie z',
      'transform-scale-x': 'Transformatie: Schalen x',
      'transform-scale-y': 'Transformatie: Schalen y',
      'transform-scale-z': 'Transformatie: Schalen z',
      'flex-direction': 'Uitlijning Flex',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Uitlijning',
      'align-items': 'Element uitlijning',
      'align-content': 'Content uitlijning',
      order: 'Volgorde',
      'flex-basis': 'Flex basis',
      'flex-grow': 'Flex groei',
      'flex-shrink': 'Flex krimp',
      'align-self': 'Lijn jezelf uit'
    }
  },
  traitManager: {
    empty: 'Selecteer een element voordat je Trait Manager kan gebruiken.',
    label: 'Component instellingen',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'ID',
        alt: 'Tekst alternatief',
        title: 'Titel',
        href: 'Link'
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: {
          placeholder: 'Bijv. https://google.com'
        }
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Dit scherm',
          _blank: 'Nieuw scherm'
        }
      }
    }
  }
};