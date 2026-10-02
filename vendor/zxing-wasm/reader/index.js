// src/bindings/barcodeFormat.ts
var BCF = [
  // name               sym  var  flags    zint  hri-label                  
  ["All", "*", "*", "     ", 0, "All"],
  ["AllReadable", "*", "r", "     ", 0, "All Readable"],
  ["AllCreatable", "*", "w", "     ", 0, "All Creatable"],
  ["AllLinear", "*", "l", "     ", 0, "All Linear"],
  ["AllMatrix", "*", "m", "     ", 0, "All Matrix"],
  ["AllGS1", "*", "G", "     ", 0, "All GS1"],
  ["AllRetail", "*", "R", "     ", 0, "All Retail"],
  ["AllIndustrial", "*", "I", "     ", 0, "All Industrial"],
  ["Codabar", "F", " ", "lrw  ", 18, "Codabar"],
  ["Code39", "A", " ", "lrw I", 8, "Code 39"],
  ["Code39Std", "A", "s", "lrw I", 8, "Code 39 Standard"],
  ["Code39Ext", "A", "e", "lr  I", 9, "Code 39 Extended"],
  ["Code32", "A", "2", "lr  I", 129, "Code 32"],
  ["PZN", "A", "p", "lr  I", 52, "Pharmazentralnummer"],
  ["Code93", "G", " ", "lrw I", 25, "Code 93"],
  ["Code128", "C", " ", "lrwGI", 20, "Code 128"],
  ["ITF", "I", " ", "lrw I", 3, "ITF"],
  ["ITF14", "I", "4", "lr  I", 89, "ITF-14"],
  ["DataBar", "e", " ", "lr GR", 29, "DataBar"],
  ["DataBarOmni", "e", "o", "lr GR", 29, "DataBar Omni"],
  ["DataBarStk", "e", "s", "lr GR", 79, "DataBar Stacked"],
  ["DataBarStkOmni", "e", "O", "lr GR", 80, "DataBar Stacked Omni"],
  ["DataBarLtd", "e", "l", "lr GR", 30, "DataBar Limited"],
  ["DataBarExp", "e", "e", "lr GR", 31, "DataBar Expanded"],
  ["DataBarExpStk", "e", "E", "lr GR", 81, "DataBar Expanded Stacked"],
  ["EANUPC", "E", " ", "lr  R", 15, "EAN/UPC"],
  ["EAN13", "E", "1", "lrw R", 15, "EAN-13"],
  ["EAN8", "E", "8", "lrw R", 10, "EAN-8"],
  ["EAN5", "E", "5", "l   R", 12, "EAN-5"],
  ["EAN2", "E", "2", "l   R", 11, "EAN-2"],
  ["ISBN", "E", "i", "lr  R", 69, "ISBN"],
  ["UPCA", "E", "a", "lrw R", 34, "UPC-A"],
  ["UPCE", "E", "e", "lrw R", 37, "UPC-E"],
  ["Telepen", "B", " ", "lr  I", 32, "Telepen"],
  ["TelepenAlpha", "B", "0", "lr  I", 32, "Telepen Alpha"],
  ["TelepenNumeric", "B", "1", "lr  I", 87, "Telepen Numeric"],
  ["OtherBarcode", "X", " ", " r   ", 0, "Other barcode"],
  ["DXFilmEdge", "X", "x", "lr   ", 147, "DX Film Edge"],
  ["PDF417", "L", " ", "mrw  ", 55, "PDF417"],
  ["CompactPDF417", "L", "c", "mr   ", 56, "Compact PDF417"],
  ["MicroPDF417", "L", "m", "mr   ", 84, "MicroPDF417"],
  ["Aztec", "z", " ", "mr G ", 92, "Aztec"],
  ["AztecCode", "z", "c", "mrwG ", 92, "Aztec Code"],
  ["AztecRune", "z", "r", "mr   ", 128, "Aztec Rune"],
  ["QRCode", "Q", " ", "mrwG ", 58, "QR Code"],
  ["QRCodeModel1", "Q", "1", "mr   ", 0, "QR Code Model 1"],
  ["QRCodeModel2", "Q", "2", "mr   ", 58, "QR Code Model 2"],
  ["MicroQRCode", "Q", "m", "mr   ", 97, "Micro QR Code"],
  ["RMQRCode", "Q", "r", "mr G ", 145, "rMQR Code"],
  ["DataMatrix", "d", " ", "mrwG ", 71, "Data Matrix"],
  ["MaxiCode", "U", " ", "mr   ", 57, "MaxiCode"]
];
var ALIASES = {
  /**
   * @deprecated Use `DataBarExp` instead.
   */
  DataBarExpanded: "DataBarExp",
  /**
   * @deprecated Use `DataBarLtd` instead.
   */
  DataBarLimited: "DataBarLtd",
  /**
   * @deprecated Use `AllLinear` instead.
   */
  "Linear-Codes": "AllLinear",
  /**
   * @deprecated Use `AllMatrix` instead.
   */
  "Matrix-Codes": "AllMatrix",
  /**
   * @deprecated Use `All` instead.
   */
  Any: "All",
  rMQRCode: "RMQRCode"
};
var BARCODE_HRI_LABELS = BCF.map((e) => e[5]);
var BARCODE_META_FORMAT_ENTRIES = BCF.filter((e) => e[1] === "*");
var BARCODE_META_FORMATS = BARCODE_META_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var BARCODE_FORMAT_ENTRIES = BCF.filter((e) => e[1] !== "*");
var BARCODE_FORMATS = BARCODE_FORMAT_ENTRIES.map((e) => e[0]);
var barcodeFormats = BARCODE_FORMATS;
var BARCODE_SYMBOLOGY_ENTRIES = BCF.filter((e) => e[2] === " ");
var BARCODE_SYMBOLOGIES = BARCODE_SYMBOLOGY_ENTRIES.map((e) => e[0]);
var LINEAR_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][0] === "l"
);
var LINEAR_BARCODE_FORMATS = LINEAR_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var linearBarcodeFormats = LINEAR_BARCODE_FORMATS;
var MATRIX_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][0] === "m"
);
var MATRIX_BARCODE_FORMATS = MATRIX_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var matrixBarcodeFormats = MATRIX_BARCODE_FORMATS;
var READABLE_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][1] === "r"
);
var READABLE_BARCODE_FORMATS = READABLE_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var CREATABLE_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][2] === "w" || e[4] !== 0
);
var CREATABLE_BARCODE_FORMATS = CREATABLE_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var GS1_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][3] === "G"
);
var GS1_BARCODE_FORMATS = GS1_BARCODE_FORMAT_ENTRIES.map((e) => e[0]);
var RETAIL_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][4] === "R"
);
var RETAIL_BARCODE_FORMATS = RETAIL_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
var INDUSTRIAL_BARCODE_FORMAT_ENTRIES = BCF.filter(
  (e) => e[3][4] === "I"
);
var INDUSTRIAL_BARCODE_FORMATS = INDUSTRIAL_BARCODE_FORMAT_ENTRIES.map(
  (e) => e[0]
);
function symbologyToFormats(symbology) {
  const formats = [];
  let sym;
  for (const entry of BCF) {
    if (entry[1] === "*") {
      continue;
    }
    if (!sym) {
      if (entry[0] === symbology) {
        formats.push(entry[0]);
        sym = entry[1];
      }
    } else if (entry[1] === sym) {
      formats.push(entry[0]);
    } else {
      break;
    }
  }
  return formats;
}
function formatToSymbology(format) {
  let currentSymbology;
  for (const entry of BCF) {
    if (entry[1] === "*") {
      continue;
    }
    if (entry[2] === " ") {
      currentSymbology = entry[0];
    }
    if (entry[0] === format) {
      return currentSymbology;
    }
  }
  return void 0;
}
function formatToLabel(format) {
  const normalized = ALIASES[format] ?? format;
  for (const entry of BCF) {
    if (entry[0] === normalized || entry[5] === normalized) {
      return entry[5];
    }
  }
  return void 0;
}
function encodeFormat(format) {
  return ALIASES[format] ?? format;
}
function encodeFormats(formats) {
  return formats.map(encodeFormat).join(",");
}
if (void 0) {
  const { describe, it, expect } = void 0;
  describe("barcode format helpers", () => {
    it("normalizes deprecated aliases", () => {
      expect(encodeFormat("Any")).toBe("All");
      expect(encodeFormat("Linear-Codes")).toBe("AllLinear");
      expect(encodeFormat("Matrix-Codes")).toBe("AllMatrix");
      expect(encodeFormat("DataBarExpanded")).toBe("DataBarExp");
      expect(encodeFormat("DataBarLimited")).toBe("DataBarLtd");
      expect(encodeFormat("rMQRCode")).toBe("RMQRCode");
    });
    it("encodes format lists as comma separated values", () => {
      expect(encodeFormats(["QRCode", "Any", "DataBarLimited"])).toBe(
        "QRCode,All,DataBarLtd"
      );
    });
    it("maps between symbology and formats", () => {
      expect(symbologyToFormats("EANUPC")).toEqual([
        "EANUPC",
        "EAN13",
        "EAN8",
        "EAN5",
        "EAN2",
        "ISBN",
        "UPCA",
        "UPCE"
      ]);
      expect(formatToSymbology("UPCA")).toBe("EANUPC");
      expect(formatToSymbology("RMQRCode")).toBe("QRCode");
      expect(formatToSymbology("MicroPDF417")).toBe("PDF417");
      expect(formatToSymbology("TelepenNumeric")).toBe("Telepen");
    });
    it("includes industrial barcode formats", () => {
      expect(INDUSTRIAL_BARCODE_FORMATS).toContain("Code39");
      expect(INDUSTRIAL_BARCODE_FORMATS).toContain("Telepen");
    });
  });
}

// src/bindings/binarizer.ts
var BINARIZERS = [
  "LocalAverage",
  "GlobalHistogram",
  "FixedThreshold",
  "BoolCast"
];
var binarizers = BINARIZERS;
function encodeBinarizer(binarizer) {
  return BINARIZERS.indexOf(binarizer);
}

// src/bindings/characterSet.ts
var CHARACTER_SETS = [
  "Unknown",
  "ASCII",
  "ISO8859_1",
  "ISO8859_2",
  "ISO8859_3",
  "ISO8859_4",
  "ISO8859_5",
  "ISO8859_6",
  "ISO8859_7",
  "ISO8859_8",
  "ISO8859_9",
  "ISO8859_10",
  "ISO8859_11",
  "ISO8859_13",
  "ISO8859_14",
  "ISO8859_15",
  "ISO8859_16",
  "Cp437",
  "Cp1250",
  "Cp1251",
  "Cp1252",
  "Cp1256",
  "Shift_JIS",
  "Big5",
  "GB2312",
  "GB18030",
  "EUC_JP",
  "EUC_KR",
  "UTF16BE",
  "UTF8",
  "UTF16LE",
  "UTF32BE",
  "UTF32LE",
  "BINARY"
];
var characterSets = CHARACTER_SETS;
function encodeCharacterSet(characterSet) {
  if (characterSet === "UnicodeBig") {
    return CHARACTER_SETS.indexOf("UTF16BE");
  }
  return CHARACTER_SETS.indexOf(characterSet);
}

// src/bindings/contentType.ts
var CONTENT_TYPES = [
  "Text",
  "Binary",
  "Mixed",
  "GS1",
  "ISO15434",
  "UnknownECI"
];
var contentTypes = CONTENT_TYPES;
function decodeContentType(number) {
  return CONTENT_TYPES[number];
}

// src/bindings/eanAddOnSymbol.ts
var EAN_ADD_ON_SYMBOLS = ["Ignore", "Read", "Require"];
var eanAddOnSymbols = EAN_ADD_ON_SYMBOLS;
function encodeEanAddOnSymbol(eanAddOnSymbol) {
  return EAN_ADD_ON_SYMBOLS.indexOf(eanAddOnSymbol);
}

// src/bindings/textMode.ts
var TEXT_MODES = [
  "Plain",
  "ECI",
  "HRI",
  "Escaped",
  "Hex",
  "HexECI"
];
var textModes = TEXT_MODES;
function encodeTextMode(textMode) {
  return TEXT_MODES.indexOf(textMode);
}

// src/bindings/readerOptions.ts
var defaultReaderOptions = {
  formats: [],
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
  tryDownscale: true,
  tryDenoise: false,
  binarizer: "LocalAverage",
  isPure: false,
  downscaleFactor: 3,
  downscaleThreshold: 500,
  minLineCount: 2,
  maxNumberOfSymbols: 255,
  validateOptionalChecksum: false,
  returnErrors: false,
  eanAddOnSymbol: "Ignore",
  textMode: "HRI",
  characterSet: "Unknown",
  tryCode39ExtendedMode: true
};
function readerOptionsToZXingReaderOptions(readerOptions) {
  return {
    ...readerOptions,
    formats: encodeFormats(readerOptions.formats),
    binarizer: encodeBinarizer(readerOptions.binarizer),
    eanAddOnSymbol: encodeEanAddOnSymbol(readerOptions.eanAddOnSymbol),
    textMode: encodeTextMode(readerOptions.textMode),
    characterSet: encodeCharacterSet(readerOptions.characterSet),
    tryCode39ExtendedMode: readerOptions.tryCode39ExtendedMode ?? true
  };
}

// src/bindings/readResult.ts
function zxingReadResultToReadResult(zxingReadResult) {
  return {
    ...zxingReadResult,
    orientation: zxingReadResult.rotation,
    format: zxingReadResult.format,
    symbology: zxingReadResult.symbology,
    contentType: decodeContentType(zxingReadResult.contentType)
  };
}

// src/bindings/writerOptions.ts
if (void 0) {
  const { describe, it, expect } = void 0;
  describe("writerOptionsToZXingWriterOptions", () => {
    it("maps legacy with* aliases when add* is missing", () => {
      const mapped = writerOptionsToZXingWriterOptions({
        withHRT: true,
        withQuietZones: false
      });
      expect(mapped.addHRT).toBe(true);
      expect(mapped.addQuietZones).toBe(false);
    });
    it("prefers add* over with* when both are provided", () => {
      const mapped = writerOptionsToZXingWriterOptions({
        addHRT: false,
        withHRT: true,
        addQuietZones: true,
        withQuietZones: false
      });
      expect(mapped.addHRT).toBe(false);
      expect(mapped.addQuietZones).toBe(true);
    });
    it("translates deprecated fields into options tokens", () => {
      const mapped = writerOptionsToZXingWriterOptions({
        options: "gs1",
        readerInit: true,
        forceSquareDataMatrix: true,
        ecLevel: "Q"
      });
      expect(mapped.options).toContain("gs1");
      expect(mapped.options).toContain("readerInit");
      expect(mapped.options).toContain("forceSquare");
      expect(mapped.options).toContain("ecLevel=Q");
    });
    it("maps sizeHint to negative scale when scale is omitted", () => {
      const mapped = writerOptionsToZXingWriterOptions({ sizeHint: 123 });
      expect(mapped.scale).toBe(-123);
    });
    it("keeps explicit scale over sizeHint", () => {
      const mapped = writerOptionsToZXingWriterOptions({
        scale: 5,
        sizeHint: 999
      });
      expect(mapped.scale).toBe(5);
    });
  });
}

// src/share.ts
var ZXING_WASM_VERSION = "3.1.4";
var ZXING_CPP_COMMIT = "0b2d9a8fc81f420f369928c24331091ff0525976";
var DEFAULT_MODULE_OVERRIDES = false ? {
  instantiateWasm() {
    throw Error(
      `To use zxing-wasm in a WeChat Mini Program, you must provide a custom "instantiateWasm" function, e.g.:

prepareZXingModule({
  overrides: {
    instantiateWasm(imports, successCallback) {
      WXWebAssembly.instantiate("path/to/zxing_full.wasm", imports).then(({ instance }) =>
        successCallback(instance),
      );
      return {};
    },
  }
});

Learn more:
- https://developers.weixin.qq.com/miniprogram/dev/framework/performance/wasm.html
- https://emscripten.org/docs/api_reference/module.html#Module.instantiateWasm
- https://github.com/Sec-ant/zxing-wasm#integrating-in-non-web-runtimes
`
    );
  }
} : true ? {
  locateFile: (path, prefix) => {
    const match = path.match(/_(.+?)\.wasm$/);
    if (match) {
      return `https://fastly.jsdelivr.net/npm/zxing-wasm@${"3.1.4"}/dist/${match[1]}/${path}`;
    }
    return prefix + path;
  }
} : {
  locateFile: (path, prefix) => {
    const match = path.match(/_(.+?)\.wasm$/);
    if (match) {
      return `/src/${match[1]}/${path}`;
    }
    return prefix + path;
  }
};
var __CACHE__ = /* @__PURE__ */ new WeakMap();
function shallow(a, b) {
  return Object.is(a, b) || Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(
    (key) => Object.hasOwn(b, key) && a[key] === b[key]
  );
}
function prepareZXingModuleWithFactory(zxingModuleFactory, {
  overrides,
  equalityFn = shallow,
  fireImmediately = false
} = {}) {
  const [cachedOverrides, cachedPromise] = __CACHE__.get(zxingModuleFactory) ?? [DEFAULT_MODULE_OVERRIDES];
  const resolvedOverrides = overrides ?? cachedOverrides;
  let cacheHit;
  if (fireImmediately) {
    if (cachedPromise && (cacheHit = equalityFn(cachedOverrides, resolvedOverrides))) {
      return cachedPromise;
    }
    const modulePromise = zxingModuleFactory({
      ...resolvedOverrides
    });
    __CACHE__.set(zxingModuleFactory, [resolvedOverrides, modulePromise]);
    return modulePromise;
  }
  if (!(cacheHit ?? equalityFn(cachedOverrides, resolvedOverrides))) {
    __CACHE__.set(zxingModuleFactory, [resolvedOverrides]);
  }
}
function purgeZXingModuleWithFactory(zxingModuleFactory) {
  __CACHE__.delete(zxingModuleFactory);
}
function rgbaToGrayscale(data) {
  const pixelCount = data.byteLength >> 2;
  const lum = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const offset = i << 2;
    lum[i] = 306 * data[offset] + 601 * data[offset + 1] + 117 * data[offset + 2] + 512 >> 10;
  }
  return lum;
}
async function readBarcodesWithFactory(zxingModuleFactory, input, readerOptions = defaultReaderOptions) {
  const requiredReaderOptions = {
    ...defaultReaderOptions,
    ...readerOptions
  };
  const zxingModule = await prepareZXingModuleWithFactory(zxingModuleFactory, {
    fireImmediately: true
  });
  let zxingReadResultVector;
  let bufferPtr;
  if ("width" in input && "height" in input && "data" in input) {
    const { data, width, height } = input;
    const lumBuffer = rgbaToGrayscale(data);
    const lumSize = lumBuffer.byteLength;
    bufferPtr = zxingModule._malloc(lumSize);
    if (!bufferPtr) {
      throw new Error(`Failed to allocate ${lumSize} bytes in WASM memory`);
    }
    try {
      zxingModule.HEAPU8.set(lumBuffer, bufferPtr);
      zxingReadResultVector = zxingModule.readBarcodesFromPixmap(
        bufferPtr,
        width,
        height,
        readerOptionsToZXingReaderOptions(requiredReaderOptions)
      );
    } finally {
      zxingModule._free(bufferPtr);
    }
  } else {
    let size;
    let buffer;
    if ("buffer" in input) {
      [size, buffer] = [input.byteLength, input];
    } else if ("byteLength" in input) {
      [size, buffer] = [input.byteLength, new Uint8Array(input)];
    } else if ("size" in input) {
      [size, buffer] = [input.size, new Uint8Array(await input.arrayBuffer())];
    } else {
      throw new TypeError("Invalid input type");
    }
    bufferPtr = zxingModule._malloc(size);
    if (!bufferPtr) {
      throw new Error(`Failed to allocate ${size} bytes in WASM memory`);
    }
    try {
      zxingModule.HEAPU8.set(buffer, bufferPtr);
      zxingReadResultVector = zxingModule.readBarcodesFromImage(
        bufferPtr,
        size,
        readerOptionsToZXingReaderOptions(requiredReaderOptions)
      );
    } finally {
      zxingModule._free(bufferPtr);
    }
  }
  const readResults = [];
  for (let i = 0; i < zxingReadResultVector.size(); ++i) {
    readResults.push(
      zxingReadResultToReadResult(zxingReadResultVector.get(i))
    );
  }
  return readResults;
}
if (false) {
  globalThis.Blob ?? (globalThis.Blob = (_a = class {
    constructor(blobParts, options) {
      __privateAdd(this, _blobParts);
      __privateAdd(this, _options);
      __privateAdd(this, _zeroUint8Array, new Uint8Array());
      console.error(
        "For the sake of robustness, a properly implemented Blob polyfill is required."
      );
      __privateSet(this, _blobParts, blobParts);
      __privateSet(this, _options, options);
    }
    get size() {
      return ((_b = (_a = __privateGet(this, _blobParts)) == null ? void 0 : _a[0]) == null ? void 0 : _b.byteLength) ?? 0;
    }
    get type() {
      return ((_a = __privateGet(this, _options)) == null ? void 0 : _a.type) ?? "";
    }
    async arrayBuffer() {
      return ((_b = (_a = __privateGet(this, _blobParts)) == null ? void 0 : _a[0]) == null ? void 0 : _b.buffer) ?? __privateGet(this, _zeroUint8Array).buffer;
    }
    async bytes() {
      return ((_a = __privateGet(this, _blobParts)) == null ? void 0 : _a[0]) ?? __privateGet(this, _zeroUint8Array);
    }
    slice() {
      throw new Error("Not implemented");
    }
    stream() {
      throw new Error("Not implemented");
    }
    text() {
      throw new Error("Not implemented");
    }
    get [Symbol.toStringTag]() {
      return "Blob";
    }
  }, _blobParts = new WeakMap(), _options = new WeakMap(), _zeroUint8Array = new WeakMap(), _a));
}

// src/reader/zxing_reader.js
var ZXing = (() => {
  var _scriptDir = import.meta.url;
  return (function(moduleArg = {}) {
    var Module = moduleArg;
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = typeof window == "object";
    var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
    var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      {
        read_ = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.error.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    if (typeof WebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module["HEAP8"] = HEAP8 = new Int8Array(b);
      Module["HEAP16"] = HEAP16 = new Int16Array(b);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
      Module["HEAP32"] = HEAP32 = new Int32Array(b);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      var _a;
      runDependencies++;
      (_a = Module["monitorRunDependencies"]) == null ? void 0 : _a.call(Module, runDependencies);
    }
    function removeRunDependency(id) {
      var _a;
      runDependencies--;
      (_a = Module["monitorRunDependencies"]) == null ? void 0 : _a.call(Module, runDependencies);
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      var _a;
      (_a = Module["onAbort"]) == null ? void 0 : _a.call(Module, what);
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -sASSERTIONS for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
    var wasmBinaryFile;
    if (Module["locateFile"]) {
      wasmBinaryFile = "zxing_reader.wasm";
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
    } else {
      wasmBinaryFile = new URL("zxing_reader.wasm", import.meta.url).href;
    }
    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw "both async and sync fetching of the wasm failed";
    }
    function getBinaryPromise(binaryFile) {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
          return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + binaryFile + "'";
            }
            return response["arrayBuffer"]();
          }).catch(() => getBinarySync(binaryFile));
        }
      }
      return Promise.resolve().then(() => getBinarySync(binaryFile));
    }
    function instantiateArrayBuffer(binaryFile, imports, receiver) {
      return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then((instance) => instance).then(receiver, (reason) => {
        err(`failed to asynchronously prepare wasm: ${reason}`);
        abort(reason);
      });
    }
    function instantiateAsync(binary, binaryFile, imports, callback) {
      if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
        return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
          var result = WebAssembly.instantiateStreaming(response, imports);
          return result.then(callback, function(reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err("falling back to ArrayBuffer instantiation");
            return instantiateArrayBuffer(binaryFile, imports, callback);
          });
        });
      }
      return instantiateArrayBuffer(binaryFile, imports, callback);
    }
    function createWasm() {
      var info = { "a": wasmImports };
      function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        wasmMemory = wasmExports["qa"];
        updateMemoryViews();
        wasmTable = wasmExports["ua"];
        addOnInit(wasmExports["ra"]);
        removeRunDependency("wasm-instantiate");
        return wasmExports;
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      if (Module["instantiateWasm"]) {
        try {
          return Module["instantiateWasm"](info, receiveInstance);
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`);
          readyPromiseReject(e);
        }
      }
      instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
      return {};
    }
    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var noExitRuntime = Module["noExitRuntime"] || true;
    var exceptionCaught = [];
    var uncaughtExceptionCount = 0;
    var ___cxa_begin_catch = (ptr) => {
      var info = new ExceptionInfo(ptr);
      if (!info.get_caught()) {
        info.set_caught(true);
        uncaughtExceptionCount--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(info);
      ___cxa_increment_exception_refcount(info.excPtr);
      return info.get_exception_ptr();
    };
    var exceptionLast = 0;
    var ___cxa_end_catch = () => {
      _setThrew(0, 0);
      var info = exceptionCaught.pop();
      ___cxa_decrement_exception_refcount(info.excPtr);
      exceptionLast = 0;
    };
    class ExceptionInfo {
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
      set_type(type) {
        HEAPU32[this.ptr + 4 >> 2] = type;
      }
      get_type() {
        return HEAPU32[this.ptr + 4 >> 2];
      }
      set_destructor(destructor) {
        HEAPU32[this.ptr + 8 >> 2] = destructor;
      }
      get_destructor() {
        return HEAPU32[this.ptr + 8 >> 2];
      }
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[this.ptr + 12 >> 0] = caught;
      }
      get_caught() {
        return HEAP8[this.ptr + 12 >> 0] != 0;
      }
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[this.ptr + 13 >> 0] = rethrown;
      }
      get_rethrown() {
        return HEAP8[this.ptr + 13 >> 0] != 0;
      }
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
      }
      get_adjusted_ptr() {
        return HEAPU32[this.ptr + 16 >> 2];
      }
      get_exception_ptr() {
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return HEAPU32[this.excPtr >> 2];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      }
    }
    var ___resumeException = (ptr) => {
      if (!exceptionLast) {
        exceptionLast = ptr;
      }
      throw exceptionLast;
    };
    var findMatchingCatch = (args) => {
      var thrown = exceptionLast;
      if (!thrown) {
        setTempRet0(0);
        return 0;
      }
      var info = new ExceptionInfo(thrown);
      info.set_adjusted_ptr(thrown);
      var thrownType = info.get_type();
      if (!thrownType) {
        setTempRet0(0);
        return thrown;
      }
      for (var arg in args) {
        var caughtType = args[arg];
        if (caughtType === 0 || caughtType === thrownType) {
          break;
        }
        var adjusted_ptr_addr = info.ptr + 16;
        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);
          return thrown;
        }
      }
      setTempRet0(thrownType);
      return thrown;
    };
    var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);
    var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);
    var ___cxa_find_matching_catch_4 = (arg0, arg1) => findMatchingCatch([arg0, arg1]);
    var ___cxa_get_exception_ptr = (ptr) => {
      var rtn = new ExceptionInfo(ptr).get_exception_ptr();
      return rtn;
    };
    var ___cxa_rethrow = () => {
      var info = exceptionCaught.pop();
      if (!info) {
        abort("no exception to throw");
      }
      var ptr = info.excPtr;
      if (!info.get_rethrown()) {
        exceptionCaught.push(info);
        info.set_rethrown(true);
        info.set_caught(false);
        uncaughtExceptionCount++;
      }
      exceptionLast = ptr;
      throw exceptionLast;
    };
    var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw exceptionLast;
    };
    var structRegistrations = {};
    var runDestructors = (destructors) => {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    };
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAP32[pointer >> 2]);
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var InternalError;
    var throwInternalError = (message) => {
      throw new InternalError(message);
    };
    var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
      myTypes.forEach(function(type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters2) {
        var myTypeConverters = getTypeConverters(typeConverters2);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach((dt, i) => {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(() => {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    };
    var __embind_finalize_value_object = (structType) => {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords.map((field) => field.getterReturnType).concat(fieldRecords.map((field) => field.setterArgumentType));
      whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes2) => {
        var fields = {};
        fieldRecords.forEach((field, i) => {
          var fieldName = field.fieldName;
          var getterReturnType = fieldTypes2[i];
          var getter = field.getter;
          var getterContext = field.getterContext;
          var setterArgumentType = fieldTypes2[i + fieldRecords.length];
          var setter = field.setter;
          var setterContext = field.setterContext;
          fields[fieldName] = { read: (ptr) => getterReturnType["fromWireType"](getter(getterContext, ptr)), write: (ptr, o) => {
            var destructors = [];
            setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
            runDestructors(destructors);
          } };
        });
        return [{ name: reg.name, "fromWireType": (ptr) => {
          var rv = {};
          for (var i in fields) {
            rv[i] = fields[i].read(ptr);
          }
          rawDestructor(ptr);
          return rv;
        }, "toWireType": (destructors, o) => {
          for (var fieldName in fields) {
            if (!(fieldName in o)) {
              throw new TypeError(`Missing field: "${fieldName}"`);
            }
          }
          var ptr = rawConstructor();
          for (fieldName in fields) {
            fields[fieldName].write(ptr, o[fieldName]);
          }
          if (destructors !== null) {
            destructors.push(rawDestructor, ptr);
          }
          return ptr;
        }, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: rawDestructor }];
      });
    };
    var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
    };
    var embind_init_charCodes = () => {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    };
    var embind_charCodes;
    var readLatin1String = (ptr) => {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    };
    var BindingError;
    var throwBindingError = (message) => {
      throw new BindingError(message);
    };
    function sharedRegisterType(rawType, registeredInstance, options = {}) {
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError(`Cannot register type '${name}' twice`);
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }
    function registerType(rawType, registeredInstance, options = {}) {
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      }
      return sharedRegisterType(rawType, registeredInstance, options);
    }
    var GenericWireTypeSize = 8;
    var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": function(wt) {
        return !!wt;
      }, "toWireType": function(destructors, o) {
        return o ? trueValue : falseValue;
      }, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": function(pointer) {
        return this["fromWireType"](HEAPU8[pointer]);
      }, destructorFunction: null });
    };
    var shallowCopyInternalPointer = (o) => ({ count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType });
    var throwInstanceAlreadyDeleted = (obj) => {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    };
    var finalizationRegistry = false;
    var detachFinalizer = (handle) => {
    };
    var runDestructor = ($$) => {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    };
    var releaseClassHandle = ($$) => {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    };
    var downcastPointer = (ptr, ptrClass, desiredClass) => {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (void 0 === desiredClass.baseClass) {
        return null;
      }
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    };
    var registeredPointers = {};
    var getInheritedInstanceCount = () => Object.keys(registeredInstances).length;
    var getLiveInheritedInstances = () => {
      var rv = [];
      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }
      return rv;
    };
    var deletionQueue = [];
    var flushPendingDeletes = () => {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    };
    var delayFunction;
    var setDelayFunction = (fn) => {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    };
    var init_embind = () => {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    };
    var registeredInstances = {};
    var getBasestPointer = (class_, ptr) => {
      if (ptr === void 0) {
        throwBindingError("ptr should not be undefined");
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }
      return ptr;
    };
    var getInheritedInstance = (class_, ptr) => {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    };
    var makeClassHandle = (prototype, record) => {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }));
    };
    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (void 0 !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
        }
      }
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
      }
    }
    var attachFinalizer = (handle) => {
      if ("undefined" === typeof FinalizationRegistry) {
        attachFinalizer = (handle2) => handle2;
        return handle;
      }
      finalizationRegistry = new FinalizationRegistry((info) => {
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle2) => {
        var $$ = handle2.$$;
        var hasSmartPtr = !!$$.smartPtr;
        if (hasSmartPtr) {
          var info = { $$ };
          finalizationRegistry.register(handle2, info, handle2);
        }
        return handle2;
      };
      detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
      return attachFinalizer(handle);
    };
    var init_ClassHandle = () => {
      Object.assign(ClassHandle.prototype, { "isAliasOf"(other) {
        if (!(this instanceof ClassHandle)) {
          return false;
        }
        if (!(other instanceof ClassHandle)) {
          return false;
        }
        var leftClass = this.$$.ptrType.registeredClass;
        var left = this.$$.ptr;
        other.$$ = other.$$;
        var rightClass = other.$$.ptrType.registeredClass;
        var right = other.$$.ptr;
        while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
        }
        while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
        }
        return leftClass === rightClass && left === right;
      }, "clone"() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
        } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
        }
      }, "delete"() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        detachFinalizer(this);
        releaseClassHandle(this.$$);
        if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = void 0;
          this.$$.ptr = void 0;
        }
      }, "isDeleted"() {
        return !this.$$.ptr;
      }, "deleteLater"() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        deletionQueue.push(this);
        if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
        this.$$.deleteScheduled = true;
        return this;
      } });
    };
    function ClassHandle() {
    }
    var createNamedFunction = (name, body) => Object.defineProperty(body, "name", { value: name });
    var ensureOverloadTable = (proto, methodName, humanName) => {
      if (void 0 === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function() {
          if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
            throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${arguments.length}) - expects one of (${proto[methodName].overloadTable})!`);
          }
          return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    };
    var exposePublicSymbol = (name, value, numArguments) => {
      if (Module.hasOwnProperty(name)) {
        if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) {
          throwBindingError(`Cannot register public name '${name}' twice`);
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (void 0 !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    };
    var char_0 = 48;
    var char_9 = 57;
    var makeLegalFunctionName = (name) => {
      if (void 0 === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return `_${name}`;
      }
      return name;
    };
    function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
    var upcastPointer = (ptr, ptrClass, desiredClass) => {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    };
    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
      if (!handle || !handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      if (this.isSmartPointer) {
        if (void 0 === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }
        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
            }
            break;
          case 1:
            ptr = handle.$$.smartPtr;
            break;
          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(ptr, Emval.toHandle(() => clonedHandle["delete"]()));
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }
      return ptr;
    }
    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function readPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }
    var init_RegisteredPointer = () => {
      Object.assign(RegisteredPointer.prototype, { getPointee(ptr) {
        if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
        }
        return ptr;
      }, destructor(ptr) {
        var _a;
        (_a = this.rawDestructor) == null ? void 0 : _a.call(this, ptr);
      }, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": readPointer, "fromWireType": RegisteredPointer_fromWireType });
    };
    function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
      if (!isSmartPointer && registeredClass.baseClass === void 0) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }
    var replacePublicSymbol = (name, value, numArguments) => {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };
    var dynCallLegacy = (sig, ptr, args) => {
      var f = Module["dynCall_" + sig];
      return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
    };
    var wasmTableMirror = [];
    var wasmTable;
    var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    };
    var dynCall = (sig, ptr, args) => {
      if (sig.includes("j")) {
        return dynCallLegacy(sig, ptr, args);
      }
      var rtn = getWasmTableEntry(ptr).apply(null, args);
      return rtn;
    };
    var getDynCaller = (sig, ptr) => {
      var argCache = [];
      return function() {
        argCache.length = 0;
        Object.assign(argCache, arguments);
        return dynCall(sig, ptr, argCache);
      };
    };
    var embind__requireFunction = (signature, rawFunction) => {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes("j")) {
          return getDynCaller(signature, rawFunction);
        }
        return getWasmTableEntry(rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp != "function") {
        throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
      }
      return fp;
    };
    var extendError = (baseErrorType, errorName) => {
      var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== void 0) {
          this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
        if (this.message === void 0) {
          return this.name;
        } else {
          return `${this.name}: ${this.message}`;
        }
      };
      return errorClass;
    };
    var UnboundTypeError;
    var getTypeName = (type) => {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    };
    var throwUnboundTypeError = (message, types) => {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
    };
    var __embind_register_class = (rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) => {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      upcast && (upcast = embind__requireFunction(upcastSignature, upcast));
      downcast && (downcast = embind__requireFunction(downcastSignature, downcast));
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function() {
        throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
      });
      whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
        var _a;
        base = base[0];
        var baseClass;
        var basePrototype;
        if (baseClassRawType) {
          baseClass = base.registeredClass;
          basePrototype = baseClass.instancePrototype;
        } else {
          basePrototype = ClassHandle.prototype;
        }
        var constructor = createNamedFunction(name, function() {
          if (Object.getPrototypeOf(this) !== instancePrototype) {
            throw new BindingError("Use 'new' to construct " + name);
          }
          if (void 0 === registeredClass.constructor_body) {
            throw new BindingError(name + " has no accessible constructor");
          }
          var body = registeredClass.constructor_body[arguments.length];
          if (void 0 === body) {
            throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
          }
          return body.apply(this, arguments);
        });
        var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
        if (registeredClass.baseClass) {
          (_a = registeredClass.baseClass).__derivedClasses ?? (_a.__derivedClasses = []);
          registeredClass.baseClass.__derivedClasses.push(registeredClass);
        }
        var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
        var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
        var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
        registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter];
      });
    };
    var heap32VectorToArray = (count, firstElement) => {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAPU32[firstElement + i * 4 >> 2]);
      }
      return array;
    };
    function usesDestructorStack(argTypes) {
      for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
          return true;
        }
      }
      return false;
    }
    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = usesDestructorStack(argTypes);
      var returns = argTypes[0].name !== "void";
      var expectedArgCount = argCount - 2;
      var argsWired = new Array(expectedArgCount);
      var invokerFuncArgs = [];
      var destructors = [];
      var invokerFn = function() {
        if (arguments.length !== expectedArgCount) {
          throwBindingError(`function ${humanName} called with ${arguments.length} arguments, expected ${expectedArgCount}`);
        }
        destructors.length = 0;
        var thisWired;
        invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
        invokerFuncArgs[0] = cppTargetFunc;
        if (isClassMethodFunc) {
          thisWired = argTypes[1]["toWireType"](destructors, this);
          invokerFuncArgs[1] = thisWired;
        }
        for (var i = 0; i < expectedArgCount; ++i) {
          argsWired[i] = argTypes[i + 2]["toWireType"](destructors, arguments[i]);
          invokerFuncArgs.push(argsWired[i]);
        }
        var rv = cppInvokerFunc.apply(null, invokerFuncArgs);
        function onDone(rv2) {
          if (needsDestructorStack) {
            runDestructors(destructors);
          } else {
            for (var i2 = isClassMethodFunc ? 1 : 2; i2 < argTypes.length; i2++) {
              var param = i2 === 1 ? thisWired : argsWired[i2 - 2];
              if (argTypes[i2].destructorFunction !== null) {
                argTypes[i2].destructorFunction(param);
              }
            }
          }
          if (returns) {
            return argTypes[0]["fromWireType"](rv2);
          }
        }
        return onDone(rv);
      };
      return createNamedFunction(humanName, invokerFn);
    }
    var __embind_register_class_constructor = (rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = `constructor ${classType.name}`;
        if (void 0 === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        }
        classType.registeredClass.constructor_body[argCount - 1] = () => {
          throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
        };
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
          return [];
        });
        return [];
      });
    };
    var getFunctionName = (signature) => {
      signature = signature.trim();
      const argsIndex = signature.indexOf("(");
      if (argsIndex !== -1) {
        return signature.substr(0, argsIndex);
      } else {
        return signature;
      }
    };
    var __embind_register_class_function = (rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = `${classType.name}.${methodName}`;
        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
          if (void 0 === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
          return [];
        });
        return [];
      });
    };
    class HandleAllocator {
      constructor() {
        this.allocated = [void 0];
        this.freelist = [];
      }
      get(id) {
        return this.allocated[id];
      }
      has(id) {
        return this.allocated[id] !== void 0;
      }
      allocate(handle) {
        var id = this.freelist.pop() || this.allocated.length;
        this.allocated[id] = handle;
        return id;
      }
      free(id) {
        this.allocated[id] = void 0;
        this.freelist.push(id);
      }
    }
    var emval_handles = new HandleAllocator();
    var __emval_decref = (handle) => {
      if (handle >= emval_handles.reserved && 0 === --emval_handles.get(handle).refcount) {
        emval_handles.free(handle);
      }
    };
    var count_emval_handles = () => {
      var count = 0;
      for (var i = emval_handles.reserved; i < emval_handles.allocated.length; ++i) {
        if (emval_handles.allocated[i] !== void 0) {
          ++count;
        }
      }
      return count;
    };
    var init_emval = () => {
      emval_handles.allocated.push({ value: void 0 }, { value: null }, { value: true }, { value: false });
      Object.assign(emval_handles, { reserved: emval_handles.allocated.length }), Module["count_emval_handles"] = count_emval_handles;
    };
    var Emval = { toValue: (handle) => {
      if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle);
      }
      return emval_handles.get(handle).value;
    }, toHandle: (value) => {
      switch (value) {
        case void 0:
          return 1;
        case null:
          return 2;
        case true:
          return 3;
        case false:
          return 4;
        default: {
          return emval_handles.allocate({ refcount: 1, value });
        }
      }
    } };
    var EmValType = { name: "emscripten::val", "fromWireType": (handle) => {
      var rv = Emval.toValue(handle);
      __emval_decref(handle);
      return rv;
    }, "toWireType": (destructors, value) => Emval.toHandle(value), "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: null };
    var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
    var embindRepr = (v) => {
      if (v === null) {
        return "null";
      }
      var t = typeof v;
      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    };
    var floatReadValueFromPointer = (name, width) => {
      switch (width) {
        case 4:
          return function(pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };
        case 8:
          return function(pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${width}): ${name}`);
      }
    };
    var __embind_register_float = (rawType, name, size) => {
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": (value) => value, "toWireType": (destructors, value) => value, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": floatReadValueFromPointer(name, size), destructorFunction: null });
    };
    var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) => {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      name = getFunctionName(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(name, function() {
        throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
      }, argCount - 1);
      whenDependentTypesAreResolved([], argTypes, function(argTypes2) {
        var invokerArgsArray = [argTypes2[0], null].concat(argTypes2.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
        return [];
      });
    };
    var integerReadValueFromPointer = (name, width, signed) => {
      switch (width) {
        case 1:
          return signed ? (pointer) => HEAP8[pointer >> 0] : (pointer) => HEAPU8[pointer >> 0];
        case 2:
          return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];
        case 4:
          return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];
        default:
          throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };
    var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var fromWireType = (value) => value;
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = (value) => value << bitshift >>> bitshift;
      }
      var isUnsignedType = name.includes("unsigned");
      var checkAssertions = (value, toTypeName) => {
      };
      var toWireType;
      if (isUnsignedType) {
        toWireType = function(destructors, value) {
          checkAssertions(value, this.name);
          return value >>> 0;
        };
      } else {
        toWireType = function(destructors, value) {
          checkAssertions(value, this.name);
          return value;
        };
      }
      registerType(primitiveType, { name, "fromWireType": fromWireType, "toWireType": toWireType, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null });
    };
    var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
      var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        var size = HEAPU32[handle >> 2];
        var data = HEAPU32[handle + 4 >> 2];
        return new TA(HEAP8.buffer, data, size);
      }
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": decodeMemoryView, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true });
    };
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
    var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
    var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return str;
    };
    var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    var __embind_register_std_string = (rawType, name) => {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, { name, "fromWireType"(value) {
        var length = HEAPU32[value >> 2];
        var payload = value + 4;
        var str;
        if (stdStringIsUTF8) {
          var decodeStartPtr = payload;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = payload + i;
            if (i == length || HEAPU8[currentBytePtr] == 0) {
              var maxRead = currentBytePtr - decodeStartPtr;
              var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
              if (str === void 0) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + 1;
            }
          }
        } else {
          var a = new Array(length);
          for (var i = 0; i < length; ++i) {
            a[i] = String.fromCharCode(HEAPU8[payload + i]);
          }
          str = a.join("");
        }
        _free(value);
        return str;
      }, "toWireType"(destructors, value) {
        if (value instanceof ArrayBuffer) {
          value = new Uint8Array(value);
        }
        var length;
        var valueIsOfTypeString = typeof value == "string";
        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
          throwBindingError("Cannot pass non-string to std::string");
        }
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          length = lengthBytesUTF8(value);
        } else {
          length = value.length;
        }
        var base = _malloc(4 + length + 1);
        var ptr = base + 4;
        HEAPU32[base >> 2] = length;
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          stringToUTF8(value, ptr, length + 1);
        } else {
          if (valueIsOfTypeString) {
            for (var i = 0; i < length; ++i) {
              var charCode = value.charCodeAt(i);
              if (charCode > 255) {
                _free(ptr);
                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
              }
              HEAPU8[ptr + i] = charCode;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              HEAPU8[ptr + i] = value[i];
            }
          }
        }
        if (destructors !== null) {
          destructors.push(_free, base);
        }
        return base;
      }, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": readPointer, destructorFunction(ptr) {
        _free(ptr);
      } });
    };
    var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
    var UTF16ToString = (ptr, maxBytesToRead) => {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      var str = "";
      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
        var codeUnit = HEAP16[ptr + i * 2 >> 1];
        if (codeUnit == 0) break;
        str += String.fromCharCode(codeUnit);
      }
      return str;
    };
    var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ?? (maxBytesToWrite = 2147483647);
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    };
    var lengthBytesUTF16 = (str) => str.length * 2;
    var UTF32ToString = (ptr, maxBytesToRead) => {
      var i = 0;
      var str = "";
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[ptr + i * 4 >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    };
    var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ?? (maxBytesToWrite = 2147483647);
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    };
    var lengthBytesUTF32 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }
      return len;
    };
    var __embind_register_std_wstring = (rawType, charSize, name) => {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = () => HEAPU16;
        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = () => HEAPU32;
        shift = 2;
      }
      registerType(rawType, { name, "fromWireType": (value) => {
        var length = HEAPU32[value >> 2];
        var HEAP = getHeap();
        var str;
        var decodeStartPtr = value + 4;
        for (var i = 0; i <= length; ++i) {
          var currentBytePtr = value + 4 + i * charSize;
          if (i == length || HEAP[currentBytePtr >> shift] == 0) {
            var maxReadBytes = currentBytePtr - decodeStartPtr;
            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
            if (str === void 0) {
              str = stringSegment;
            } else {
              str += String.fromCharCode(0);
              str += stringSegment;
            }
            decodeStartPtr = currentBytePtr + charSize;
          }
        }
        _free(value);
        return str;
      }, "toWireType": (destructors, value) => {
        if (!(typeof value == "string")) {
          throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
        }
        var length = lengthBytesUTF(value);
        var ptr = _malloc(4 + length + charSize);
        HEAPU32[ptr >> 2] = length >> shift;
        encodeString(value, ptr + 4, length + charSize);
        if (destructors !== null) {
          destructors.push(_free, ptr);
        }
        return ptr;
      }, "argPackAdvance": GenericWireTypeSize, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction(ptr) {
        _free(ptr);
      } });
    };
    var __embind_register_value_object = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) => {
      structRegistrations[rawType] = { name: readLatin1String(name), rawConstructor: embind__requireFunction(constructorSignature, rawConstructor), rawDestructor: embind__requireFunction(destructorSignature, rawDestructor), fields: [] };
    };
    var __embind_register_value_object_field = (structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) => {
      structRegistrations[structType].fields.push({ fieldName: readLatin1String(fieldName), getterReturnType, getter: embind__requireFunction(getterSignature, getter), getterContext, setterArgumentType, setter: embind__requireFunction(setterSignature, setter), setterContext });
    };
    var __embind_register_void = (rawType, name) => {
      name = readLatin1String(name);
      registerType(rawType, { isVoid: true, name, "argPackAdvance": 0, "fromWireType": () => void 0, "toWireType": (destructors, o) => void 0 });
    };
    var emval_methodCallers = [];
    var __emval_call = (caller, handle, destructorsRef, args) => {
      caller = emval_methodCallers[caller];
      handle = Emval.toValue(handle);
      return caller(null, handle, destructorsRef, args);
    };
    var emval_symbols = {};
    var getStringOrSymbol = (address) => {
      var symbol = emval_symbols[address];
      if (symbol === void 0) {
        return readLatin1String(address);
      }
      return symbol;
    };
    var emval_get_global = () => {
      if (typeof globalThis == "object") {
        return globalThis;
      }
      function testGlobal(obj) {
        obj["$$$embind_global$$$"] = obj;
        var success = typeof $$$embind_global$$$ == "object" && obj["$$$embind_global$$$"] == obj;
        if (!success) {
          delete obj["$$$embind_global$$$"];
        }
        return success;
      }
      if (typeof $$$embind_global$$$ == "object") {
        return $$$embind_global$$$;
      }
      if (typeof global == "object" && testGlobal(global)) {
        $$$embind_global$$$ = global;
      } else if (typeof self == "object" && testGlobal(self)) {
        $$$embind_global$$$ = self;
      }
      if (typeof $$$embind_global$$$ == "object") {
        return $$$embind_global$$$;
      }
      throw Error("unable to get global object.");
    };
    var __emval_get_global = (name) => {
      if (name === 0) {
        return Emval.toHandle(emval_get_global());
      } else {
        name = getStringOrSymbol(name);
        return Emval.toHandle(emval_get_global()[name]);
      }
    };
    var emval_addMethodCaller = (caller) => {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    };
    var requireRegisteredType = (rawType, humanName) => {
      var impl = registeredTypes[rawType];
      if (void 0 === impl) {
        throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }
      return impl;
    };
    var emval_lookupTypes = (argCount, argTypes) => {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAPU32[argTypes + i * 4 >> 2], "parameter " + i);
      }
      return a;
    };
    var reflectConstruct = Reflect.construct;
    var emval_returnValue = (returnType, destructorsRef, handle) => {
      var destructors = [];
      var result = returnType["toWireType"](destructors, handle);
      if (destructors.length) {
        HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
      }
      return result;
    };
    var __emval_get_method_caller = (argCount, argTypes, kind) => {
      var types = emval_lookupTypes(argCount, argTypes);
      var retType = types.shift();
      argCount--;
      var argN = new Array(argCount);
      var invokerFunction = (obj, func, destructorsRef, args) => {
        var offset = 0;
        for (var i = 0; i < argCount; ++i) {
          argN[i] = types[i]["readValueFromPointer"](args + offset);
          offset += types[i]["argPackAdvance"];
        }
        var rv = kind === 1 ? reflectConstruct(func, argN) : func.apply(obj, argN);
        return emval_returnValue(retType, destructorsRef, rv);
      };
      var functionName = `methodCaller<(${types.map((t) => t.name).join(", ")}) => ${retType.name}>`;
      return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
    };
    var __emval_incref = (handle) => {
      if (handle > 4) {
        emval_handles.get(handle).refcount += 1;
      }
    };
    var __emval_run_destructors = (handle) => {
      var destructors = Emval.toValue(handle);
      runDestructors(destructors);
      __emval_decref(handle);
    };
    var __emval_take_value = (type, arg) => {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](arg);
      return Emval.toHandle(v);
    };
    var _abort = () => {
      abort("");
    };
    var getHeapMax = () => 2147483648;
    var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {
      }
    };
    var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    };
    var _llvm_eh_typeid_for = (type) => type;
    InternalError = Module["InternalError"] = class InternalError extends Error {
      constructor(message) {
        super(message);
        this.name = "InternalError";
      }
    };
    embind_init_charCodes();
    BindingError = Module["BindingError"] = class BindingError extends Error {
      constructor(message) {
        super(message);
        this.name = "BindingError";
      }
    };
    init_ClassHandle();
    init_embind();
    init_RegisteredPointer();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
    init_emval();
    var wasmImports = { r: ___cxa_begin_catch, C: ___cxa_end_catch, a: ___cxa_find_matching_catch_2, i: ___cxa_find_matching_catch_3, k: ___cxa_find_matching_catch_4, E: ___cxa_get_exception_ptr, V: ___cxa_rethrow, p: ___cxa_throw, e: ___resumeException, la: __embind_finalize_value_object, Y: __embind_register_bigint, ca: __embind_register_bool, ka: __embind_register_class, ja: __embind_register_class_constructor, G: __embind_register_class_function, ba: __embind_register_emval, S: __embind_register_float, W: __embind_register_function, x: __embind_register_integer, s: __embind_register_memory_view, R: __embind_register_std_string, K: __embind_register_std_wstring, H: __embind_register_value_object, ma: __embind_register_value_object_field, da: __embind_register_void, oa: __emval_call, pa: __emval_decref, D: __emval_get_global, X: __emval_get_method_caller, J: __emval_incref, na: __emval_run_destructors, O: __emval_take_value, Q: _abort, aa: _emscripten_resize_heap, ha: invoke_dii, U: invoke_diii, z: invoke_diiidd, b: invoke_ii, A: invoke_iidi, fa: invoke_iif, c: invoke_iii, M: invoke_iiidd, h: invoke_iiii, j: invoke_iiiii, q: invoke_iiiiii, N: invoke_iiiiiid, v: invoke_iiiiiii, P: invoke_iiiiiiii, B: invoke_iiiiiiiii, Z: invoke_iiijj, m: invoke_v, d: invoke_vi, ea: invoke_vid, f: invoke_vii, $: invoke_viid, T: invoke_viiddddii, L: invoke_viidi, g: invoke_viii, I: invoke_viiiddi, l: invoke_viiii, ga: invoke_viiiifff, n: invoke_viiiii, y: invoke_viiiiii, F: invoke_viiiiiii, w: invoke_viiiiiiii, t: invoke_viiiiiiiii, o: invoke_viiiiiiiiii, ia: invoke_viiiiiiiiiiiiiiii, _: invoke_viijjijjjjjj, u: _llvm_eh_typeid_for };
    var wasmExports = createWasm();
    var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["ra"])();
    var _free = Module["_free"] = (a0) => (_free = Module["_free"] = wasmExports["sa"])(a0);
    var _malloc = Module["_malloc"] = (a0) => (_malloc = Module["_malloc"] = wasmExports["ta"])(a0);
    var ___cxa_free_exception = (a0) => (___cxa_free_exception = wasmExports["__cxa_free_exception"])(a0);
    var ___getTypeName = (a0) => (___getTypeName = wasmExports["va"])(a0);
    var _setThrew = (a0, a1) => (_setThrew = wasmExports["wa"])(a0, a1);
    var setTempRet0 = (a0) => (setTempRet0 = wasmExports["xa"])(a0);
    var stackSave = () => (stackSave = wasmExports["ya"])();
    var stackRestore = (a0) => (stackRestore = wasmExports["za"])(a0);
    var ___cxa_increment_exception_refcount = (a0) => (___cxa_increment_exception_refcount = wasmExports["Aa"])(a0);
    var ___cxa_decrement_exception_refcount = (a0) => (___cxa_decrement_exception_refcount = wasmExports["Ba"])(a0);
    var ___cxa_can_catch = (a0, a1, a2) => (___cxa_can_catch = wasmExports["Ca"])(a0, a1, a2);
    var ___cxa_is_pointer_type = (a0) => (___cxa_is_pointer_type = wasmExports["Da"])(a0);
    var dynCall_viijjijjjjjj = Module["dynCall_viijjijjjjjj"] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19) => (dynCall_viijjijjjjjj = Module["dynCall_viijjijjjjjj"] = wasmExports["Ea"])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19);
    var dynCall_iiijj = Module["dynCall_iiijj"] = (a0, a1, a2, a3, a4, a5, a6) => (dynCall_iiijj = Module["dynCall_iiijj"] = wasmExports["Fa"])(a0, a1, a2, a3, a4, a5, a6);
    function invoke_vi(index, a1) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_v(index) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_dii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiid(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iidi(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_diii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiddddii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiifff(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iif(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiidd(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_diiidd(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vid(index, a1, a2) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiddi(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viidi(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viid(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viijjijjjjjj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19) {
      var sp = stackSave();
      try {
        dynCall_viijjijjjjjj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiijj(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        return dynCall_iiijj(index, a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run() {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
          setTimeout(function() {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();
    return moduleArg.ready;
  });
})();
var zxing_reader_default = ZXing;

// src/bindings/exposedReaderBindings.ts
var defaultReaderOptions2 = {
  ...defaultReaderOptions,
  formats: [...defaultReaderOptions.formats]
};

// src/reader/index.ts
function prepareZXingModule(options) {
  return prepareZXingModuleWithFactory(zxing_reader_default, options);
}
function purgeZXingModule() {
  return purgeZXingModuleWithFactory(zxing_reader_default);
}
function getZXingModule(zxingModuleOverrides) {
  return prepareZXingModule({
    overrides: zxingModuleOverrides,
    equalityFn: Object.is,
    fireImmediately: true
  });
}
function setZXingModuleOverrides(zxingModuleOverrides) {
  prepareZXingModule({
    overrides: zxingModuleOverrides,
    equalityFn: Object.is,
    fireImmediately: false
  });
}
async function readBarcodes(input, readerOptions) {
  return readBarcodesWithFactory(zxing_reader_default, input, readerOptions);
}
async function readBarcodesFromImageFile(imageFile, readerOptions) {
  return readBarcodes(imageFile, readerOptions);
}
async function readBarcodesFromImageData(imageData, readerOptions) {
  return readBarcodes(imageData, readerOptions);
}
var ZXING_WASM_SHA256 = "5ea662e4860f485a10c3bc2af02a8a7770abbc118d75bbc64274d23036925c58";
export {
  BARCODE_FORMATS,
  BARCODE_HRI_LABELS,
  BARCODE_META_FORMATS,
  BARCODE_SYMBOLOGIES,
  BINARIZERS,
  CHARACTER_SETS,
  CONTENT_TYPES,
  CREATABLE_BARCODE_FORMATS,
  EAN_ADD_ON_SYMBOLS,
  GS1_BARCODE_FORMATS,
  INDUSTRIAL_BARCODE_FORMATS,
  LINEAR_BARCODE_FORMATS,
  MATRIX_BARCODE_FORMATS,
  READABLE_BARCODE_FORMATS,
  RETAIL_BARCODE_FORMATS,
  TEXT_MODES,
  ZXING_CPP_COMMIT,
  ZXING_WASM_SHA256,
  ZXING_WASM_VERSION,
  barcodeFormats,
  binarizers,
  characterSets,
  contentTypes,
  defaultReaderOptions2 as defaultReaderOptions,
  eanAddOnSymbols,
  encodeFormat,
  encodeFormats,
  formatToLabel,
  formatToSymbology,
  getZXingModule,
  linearBarcodeFormats,
  matrixBarcodeFormats,
  prepareZXingModule,
  purgeZXingModule,
  readBarcodes,
  readBarcodesFromImageData,
  readBarcodesFromImageFile,
  setZXingModuleOverrides,
  symbologyToFormats,
  textModes
};
