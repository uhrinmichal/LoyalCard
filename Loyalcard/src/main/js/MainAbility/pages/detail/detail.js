import router from '@system.router';
import cardStore from '../../common/cardStore.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';
import createQrRenderData from '../../common/qrRenderer.js';

const NORMAL_QR_SIZE = 140;
const SCAN_QR_SIZE = 210;

export default {
  data: {
    cardId: '',
    cardName: '',
    cardType: '',
    cardCode: '',
    hasBarcode: false,
    barcodeBars: [],
    hasQrImage: false,
    hasQrCode: false,
    qrModules: [],
    qrModuleSize: 0,
    qrContentSize: 0,
    qrOuterSize: 0,
    scanQrModuleSize: 0,
    scanQrContentSize: 0,
    scanQrOuterSize: 0,
    isScanMode: false,
    confirmDelete: false
  },

  onInit() {
    let params = router.getParams();
    if (params && params.cardId) {
      this.cardId = params.cardId;
    }
    this.loadCard();
  },

  onShow() {
    this.loadCard();
  },

  loadCard() {
    let card = cardStore.find(this.cardId);
    if (!card) {
      return;
    }

    this.cardName = card.name;
    this.cardType = getCardFormatLabel(card.format);
    this.cardCode = card.code;
    this.barcodeBars = createBarcodeBars(card.format, card.code);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrImage = card.format === 'qr' && !!card.qrAsset;
    this.hasQrCode = card.format === 'qr' && !card.qrAsset;

    if (this.hasQrCode) {
      let normalQr = createQrRenderData(card.code, NORMAL_QR_SIZE);
      let scanQr = createQrRenderData(card.code, SCAN_QR_SIZE);
      this.qrModules = normalQr.modules;
      this.qrModuleSize = normalQr.moduleSize;
      this.qrContentSize = normalQr.contentSize;
      this.qrOuterSize = normalQr.outerSize;
      this.scanQrModuleSize = scanQr.moduleSize;
      this.scanQrContentSize = scanQr.contentSize;
      this.scanQrOuterSize = scanQr.outerSize;
    }
  },

  toggleScanMode() {
    this.isScanMode = !this.isScanMode;
  },

  startEdit() {
    router.replace({
      url: 'pages/editor/editor',
      params: { cardId: this.cardId }
    });
  },

  requestDelete() {
    this.confirmDelete = true;
  },

  cancelDelete() {
    this.confirmDelete = false;
  },

  deleteCard() {
    cardStore.remove(this.cardId);
    router.replace({ url: 'pages/index/index' });
  },

  goBack() {
    router.replace({ url: 'pages/index/index' });
  },

  onSaveData(savedData) {
    savedData.cards = cardStore.serialize();
    return true;
  },

  onRestoreData(savedData) {
    cardStore.restore(savedData ? savedData.cards : null);
    this.loadCard();
  }
}
