function getCardFormatLabel(format) {
  if (format === 'qr') {
    return 'QR card';
  }

  if (format === 'ean13') {
    return 'Barcode';
  }

  return 'Card';
}

export default getCardFormatLabel;
