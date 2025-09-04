import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Onboarding from '../components/Onboarding'
import AccountList from '../components/AccountList'
import TransferForm from '../components/TransferForm'
import CustomPayment from '../components/CustomPayment'

export default function Home() {
  const [accounts, setAccounts] = useState([])
  const [selectedSender, setSelectedSender] = useState(null)
  const [selectedReceivers, setSelectedReceivers] = useState([])
  const [customPayments, setCustomPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [error, setError] = useState(null)

  // Hesapları yükle
  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('firma', { ascending: true })

      if (error) throw error
      setAccounts(data || [])
    } catch (err) {
      console.error('Error fetching accounts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = (sender) => {
    setSelectedSender(sender)
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Hata</h2>
          <p>{error}</p>
          <button 
            onClick={fetchAccounts}
            className="mt-4 btn btn-primary"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="card mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Havale Talimat Sistemi
          </h1>
          <p className="text-gray-600">
            Toplu havale talimatlarınızı kolayca oluşturun
          </p>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <Onboarding 
            accounts={accounts}
            onComplete={handleOnboardingComplete}
            onSkip={() => setShowOnboarding(false)}
          />
        )}

        {/* Main Content */}
        {!showOnboarding && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sol Panel - Gönderen */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Gönderen Hesap</h2>
              <AccountList
                accounts={accounts}
                selectedAccount={selectedSender}
                onSelect={setSelectedSender}
                type="sender"
              />
              <button
                onClick={() => setShowOnboarding(true)}
                className="mt-4 btn btn-secondary w-full"
              >
                Hesap Seç (Onboarding)
              </button>
            </div>

            {/* Sağ Panel - Alıcılar */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Alıcı Hesaplar</h2>
                <CustomPayment
                  onAdd={(payments) => setCustomPayments([...customPayments, ...payments])}
                />
              </div>
              
              {selectedSender ? (
                <AccountList
                  accounts={accounts.filter(a => 
                    a.id !== selectedSender?.id && 
                    a.para_birimi === selectedSender?.para_birimi
                  )}
                  selectedAccounts={selectedReceivers}
                  onSelect={(account) => {
                    const exists = selectedReceivers.find(r => r.id === account.id)
                    if (exists) {
                      setSelectedReceivers(selectedReceivers.filter(r => r.id !== account.id))
                    } else {
                      setSelectedReceivers([...selectedReceivers, { ...account, tutar: '' }])
                    }
                  }}
                  type="receiver"
                  customPayments={customPayments}
                  onRemoveCustom={(index) => {
                    setCustomPayments(customPayments.filter((_, i) => i !== index))
                  }}
                  onUpdateAmount={(accountId, amount) => {
                    setSelectedReceivers(selectedReceivers.map(r => 
                      r.id === accountId ? { ...r, tutar: amount } : r
                    ))
                  }}
                />
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Önce gönderen hesabı seçin
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alt Panel - Özet ve İşlemler */}
        {!showOnboarding && selectedSender && (
          <TransferForm
            sender={selectedSender}
            receivers={selectedReceivers.filter(r => r.tutar)}
            customPayments={customPayments}
            onSuccess={() => {
              setSelectedReceivers([])
              setCustomPayments([])
              alert('Talimat başarıyla oluşturuldu!')
            }}
          />
        )}
      </div>
    </div>
  )
}