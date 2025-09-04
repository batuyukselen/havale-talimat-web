import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, BorderStyle, WidthType, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'

export async function generateWordDocument(sender, receivers) {
  // Toplam tutarı hesapla
  let totalAmount = 0
  receivers.forEach(r => {
    totalAmount += parseFloat(r.tutar?.replace(',', '.') || 0)
  })

  // Tablo satırlarını oluştur
  const tableRows = [
    // Başlık satırı
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'ÜNVAN', alignment: AlignmentType.CENTER, bold: true })],
          shading: { fill: 'E0E0E0' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'BANKA', alignment: AlignmentType.CENTER, bold: true })],
          shading: { fill: 'E0E0E0' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'IBAN', alignment: AlignmentType.CENTER, bold: true })],
          shading: { fill: 'E0E0E0' }
        }),
        new TableCell({
          children: [new Paragraph({ text: 'TUTAR', alignment: AlignmentType.CENTER, bold: true })],
          shading: { fill: 'E0E0E0' }
        })
      ]
    }),
    // Veri satırları
    ...receivers.map(receiver => 
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: receiver.firma || '', alignment: AlignmentType.LEFT })]
          }),
          new TableCell({
            children: [new Paragraph({ text: (receiver.banka || 'ZIRAAT').toUpperCase(), alignment: AlignmentType.LEFT })]
          }),
          new TableCell({
            children: [new Paragraph({ text: formatIBAN(receiver.iban || ''), alignment: AlignmentType.LEFT })]
          }),
          new TableCell({
            children: [new Paragraph({ 
              text: `${formatCurrency(receiver.tutar)} ${receiver.para_birimi || sender.para_birimi}`,
              alignment: AlignmentType.LEFT 
            })]
          })
        ]
      })
    )
  ]

  // Word belgesi oluştur
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Firma adı (logo yerine)
        new Paragraph({
          text: sender.firma,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 }
        }),
        
        // Banka bilgileri
        new Paragraph({
          children: [
            new TextRun({ text: sender.banka.toUpperCase(), bold: true }),
            new TextRun({ text: '\n' + (sender.sube || 'MERKEZ').toUpperCase() + ' TİCARİ ŞUBESİ' }),
            new TextRun({ text: '\n' + (sender.sehir || 'İSTANBUL').toUpperCase() })
          ],
          spacing: { after: 200 }
        }),
        
        // Tarih
        new Paragraph({
          text: new Date().toLocaleDateString('tr-TR'),
          alignment: AlignmentType.RIGHT,
          bold: true,
          spacing: { after: 400 }
        }),
        
        // Açıklama metni
        new Paragraph({
          text: `Nezdinizde bulunan ${sender.firma}'nin ${sender.hesap_no || ''} nolu ${sender.para_birimi} hesabımızdan aşağıda bilgileri verilen hesaplara transfer edilmesini rica ederiz.`,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),
        
        // Transfer tablosu
        new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 }
          }
        }),
        
        // Boş satır
        new Paragraph({ text: '', spacing: { after: 400 } }),
        
        // Toplam tutar
        new Paragraph({
          text: `TOPLAM TUTAR: ${formatCurrency(totalAmount.toString())} ${sender.para_birimi}`,
          alignment: AlignmentType.RIGHT,
          bold: true,
          size: 24,
          spacing: { after: 600 }
        }),
        
        // Saygılarımızla
        new Paragraph({
          text: 'Saygılarımızla',
          alignment: AlignmentType.LEFT
        })
      ]
    }]
  })

  // Belgeyi indir
  const blob = await Packer.toBlob(doc)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
  const filename = `talimat_${sender.firma.replace(/\s+/g, '_')}_${timestamp}.docx`
  saveAs(blob, filename)
}

// IBAN formatla
function formatIBAN(iban) {
  const clean = iban.replace(/\s/g, '')
  return clean.match(/.{1,4}/g)?.join(' ') || iban
}

// Para birimi formatla
function formatCurrency(amount) {
  const num = parseFloat(amount?.toString().replace(',', '.') || 0)
  return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}