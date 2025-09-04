import { useState } from 'react'
import * as XLSX from 'xlsx'

export default function CustomPayment({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false)
  const [payments, setPayments] = useState([
    { firma: '', iban: '', tutar: '', aciklama: '' }
  ])

  const handleAddRow = () => {
    setPayments([...payments, { firma: '', iban: '', tutar: '', aciklama: '' }])
  }

  const handleRemoveRow = (index) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index))
    }
  }

  const handleChange = (index, field, value) => {
    const updated = [...payments]
    updated[index][field] = value
    setPayments(updated)
  }

  const handleSave = () => {
    const validPayments = payments.filter(p => p.firma && p.iban && p.tutar)
    if (validPayments.length > 0) {
      onAdd(validPayments)
      setPayments([{ firma: '', iban: '', tutar: '', aciklama: '' }])
      setIsOpen(false)
    }
  }

  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)
      
      const newPayments = data.map(row => ({
        firma: row['Firma Ünvanı'] || row['Firma'] || '',
        iban: row['IBAN'] || '',
        tutar: row['Tutar'] || '',
        aciklama: row['Açıklama'] || ''
      }))
      
      setPayments(newPayments)
    }
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const template = [
      { 'Firma Ünvanı': 'Örnek Firma A.Ş.', 'IBAN': 'TR00 0000 0000 0000 0000 0000 00', 'Tutar': '1000', 'Açıklama': 'Ödeme açıklaması' }
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Şablon')
    XLSX.writeFile(wb, 'custom_odeme_sablonu.xlsx')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary text-sm"
      >
        + Custom Ödeme
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Custom Ödeme Ekle</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Excel İşlemleri */}
              <div className="flex gap-4">
                <button
                  onClick={downloadTemplate}
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  📥 Şablon İndir
                </button>
                <label className="btn bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                  📤 Excel Yükle
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Tablo */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Firma Ünvanı</th>
                      <th className="text-left p-2">IBAN</th>
                      <th className="text-left p-2">Tutar</th>
                      <th className="text-left p-2">Açıklama</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <input
                            type="text"
                            value={payment.firma}
                            onChange={(e) => handleChange(index, 'firma', e.target.value)}
                            className="input"
                            placeholder="Firma adı"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={payment.iban}
                            onChange={(e) => handleChange(index, 'iban', e.target.value)}
                            className="input"
                            placeholder="TR00 0000..."
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={payment.tutar}
                            onChange={(e) => handleChange(index, 'tutar', e.target.value)}
                            className="input"
                            placeholder="0,00"
                          />
                        </td>
                        <td className="p-2">
                          <textarea
                            value={payment.aciklama}
                            onChange={(e) => handleChange(index, 'aciklama', e.target.value)}
                            className="input"
                            rows="1"
                            placeholder="Açıklama"
                          />
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleRemoveRow(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleAddRow}
                className="btn bg-green-600 text-white hover:bg-green-700"
              >
                + Yeni Satır
              </button>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Ödemeleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}