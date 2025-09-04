import { useState, useEffect } from 'react'

export default function Onboarding({ accounts, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFirma, setSelectedFirma] = useState(null)
  const [selectedBanka, setSelectedBanka] = useState(null)
  const [selectedParaBirimi, setSelectedParaBirimi] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Unique değerleri al
  const firmalar = [...new Set(accounts.map(a => a.firma))]
  const bankalar = selectedFirma 
    ? [...new Set(accounts.filter(a => a.firma === selectedFirma).map(a => a.banka))]
    : []
  const paraBirimleri = selectedFirma && selectedBanka
    ? [...new Set(accounts.filter(a => a.firma === selectedFirma && a.banka === selectedBanka).map(a => a.para_birimi))]
    : []
  const hesaplar = selectedFirma && selectedBanka && selectedParaBirimi
    ? accounts.filter(a => a.firma === selectedFirma && a.banka === selectedBanka && a.para_birimi === selectedParaBirimi)
    : []

  const handleFirmaSelect = (firma) => {
    setSelectedFirma(firma)
    setSelectedBanka(null)
    setSelectedParaBirimi(null)
    setSelectedAccount(null)
    setTimeout(() => setCurrentStep(2), 300)
  }

  const handleBankaSelect = (banka) => {
    setSelectedBanka(banka)
    setSelectedParaBirimi(null)
    setSelectedAccount(null)
    setTimeout(() => setCurrentStep(3), 300)
  }

  const handleParaBirimiSelect = (pb) => {
    setSelectedParaBirimi(pb)
    setSelectedAccount(null)
    setTimeout(() => setCurrentStep(4), 300)
  }

  const handleAccountSelect = (account) => {
    setSelectedAccount(account)
  }

  const handleComplete = () => {
    if (selectedAccount) {
      onComplete(selectedAccount)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-bold text-center">Gönderen Hesap Seçimi</h2>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-4 py-6">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step === currentStep 
                  ? 'bg-purple-600 scale-150' 
                  : step < currentStep 
                    ? 'bg-purple-300'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          {/* Step 1: Firma */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">Firma Seçin</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {firmalar.map(firma => (
                  <button
                    key={firma}
                    onClick={() => handleFirmaSelect(firma)}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      selectedFirma === firma 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{firma}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Banka */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">Banka Seçin</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bankalar.map(banka => (
                  <button
                    key={banka}
                    onClick={() => handleBankaSelect(banka)}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      selectedBanka === banka 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{banka}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Para Birimi */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">Para Birimi Seçin</h3>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {paraBirimleri.map(pb => (
                  <button
                    key={pb}
                    onClick={() => handleParaBirimiSelect(pb)}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      selectedParaBirimi === pb 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {pb === 'TL' ? '₺' : pb === 'USD' ? '$' : pb === 'EUR' ? '€' : pb}
                    </div>
                    <div className="text-sm font-medium">{pb}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Hesap */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">Hesap Seçin</h3>
              <div className="space-y-4">
                {hesaplar.map(hesap => (
                  <button
                    key={hesap.id}
                    onClick={() => handleAccountSelect(hesap)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-lg ${
                      selectedAccount?.id === hesap.id 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold">{hesap.hesap_adi}</div>
                    <div className="text-sm text-gray-600">Hesap No: {hesap.hesap_no}</div>
                    <div className="text-xs text-gray-500 mt-1">{hesap.iban}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 flex justify-between">
          <button
            onClick={onSkip}
            className="btn btn-secondary"
          >
            Atla
          </button>
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Geri
              </button>
            )}
            {currentStep === 4 && selectedAccount && (
              <button
                onClick={handleComplete}
                className="btn btn-primary"
              >
                Tamamla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}