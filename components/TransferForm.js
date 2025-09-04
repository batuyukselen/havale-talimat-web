import { useState } from 'react'
import { generateWordDocument } from '../lib/wordGenerator'
import { supabase } from '../lib/supabase'

export default function TransferForm({ sender, receivers, customPayments, onSuccess }) {
  const [loading, setLoading] = useState(false)
  
  // Toplam tutarı hesapla
  const calculateTotal = () => {
    let total = 0
    receivers.forEach(r => {
      total += parseFloat(r.tutar?.replace(',', '.') || 0)
    })
    customPayments.forEach(p => {
      total += parseFloat(p.tutar?.replace(',', '.') || 0)
    })
    return total
  }

  const handleCreate = async () => {
    setLoading(true)
    try {
      // Alıcıları hazırla
      const allReceivers = [
        ...receivers,
        ...customPayments.map(cp => ({
          firma: cp.firma,
          banka: 'CUSTOM',
          iban: cp.iban,
          para_birimi: sender.para_birimi,
          tutar: cp.tutar,
          hesap_adi: cp.aciklama || ''
        }))
      ]

      // Word belgesi oluştur
      await generateWordDocument(sender, allReceivers)

      // Talimatı veritabanına kaydet
      const { error } = await supabase
        .from('transfer_orders')
        .insert({
          gonderen_hesap_id: sender.id,
          gonderen_firma: sender.firma,
          gonderen_banka: sender.banka,
          gonderen_iban: sender.iban,
          alicilar: allReceivers,
          toplam_tutar: calculateTotal(),
          para_birimi: sender.para_birimi
        })

      if (error) throw error

      onSuccess()
    } catch (error) {
      console.error('Error creating transfer:', error)
      alert('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const total = calculateTotal()
  const receiverCount = receivers.length + customPayments.length

  return (
    <div className="card mt-8">
      <h2 className="text-xl font-bold mb-4">Özet</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Gönderen</div>
          <div className="font-semibold">{sender.firma}</div>
          <div className="text-sm text-gray-500">{sender.banka}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Alıcı Sayısı</div>
          <div className="text-2xl font-bold text-purple-600">{receiverCount}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Toplam Tutar</div>
          <div className="text-2xl font-bold text-green-600">
            {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {sender.para_birimi}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Para Birimi</div>
          <div className="text-2xl font-bold">
            {sender.para_birimi === 'TL' ? '₺' : sender.para_birimi === 'USD' ? '$' : '€'}
            {sender.para_birimi}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreate}
          disabled={loading || receiverCount === 0}
          className={`btn btn-primary flex-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Oluşturuluyor...' : 'Talimat Oluştur'}
        </button>
      </div>
    </div>
  )
}