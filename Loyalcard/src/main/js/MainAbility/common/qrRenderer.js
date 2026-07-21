import { generate } from './vendor/lean-qr-nano.min.js';

const QUIET_ZONE_MODULES = 4;

function createQrRenderData(code, targetSize) {
  if (!code) {
    return {
      modules: [],
      moduleSize: 0,
      contentSize: 0,
      outerSize: 0
    };
  }

  let qr = generate(code, { minCorrectionLevel: 1 });
  let moduleCount = qr.size;
  let moduleSize = Math.max(1, Math.floor(targetSize / (moduleCount + QUIET_ZONE_MODULES * 2)));
  let modules = [];

  for (let row = 0; row < moduleCount; row++) {
    for (let column = 0; column < moduleCount; column++) {
      modules.push({
        id: String(row) + '-' + String(column),
        dark: qr.get(column, row)
      });
    }
  }

  return {
    modules: modules,
    moduleSize: moduleSize,
    contentSize: moduleCount * moduleSize,
    outerSize: (moduleCount + QUIET_ZONE_MODULES * 2) * moduleSize
  };
}

export default createQrRenderData;
