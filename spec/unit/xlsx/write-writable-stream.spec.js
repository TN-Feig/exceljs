const ExcelJS = verquire('exceljs');

describe('Web-native streams', () => {
  it('can stream xlsx through a web-native TransformStream (readable/writable pair)', async function() {
    // eslint-disable-next-line no-use-before-define
    const TransformStream =
      typeof global.TransformStream === 'function'
        ? global.TransformStream
        : null;

    if (!TransformStream) {
      this.skip();
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;

    const wb2 = new ExcelJS.Workbook();
    const transform = new TransformStream();

    await wb.xlsx.write(transform.writable);
    await wb2.xlsx.read(transform.readable);

    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
});
