export default function AccountList({ 
  accounts, 
  selectedAccount, 
  selectedAccounts = [],
  onSelect, 
  type = 'sender',
  customPayments = [],
  onRemoveCustom,
  onUpdateAmount
}) {
  const isSender = type === 'sender'
  
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {/* Custom ödemeler */}
      {!isSender && customPayments.length > 0 && (
        <>
          <div className="bg-yellow-50 p-2 rounded-lg font-semibold text-yellow-800">
            Custom Ödemeler
          </div>
          {customPayments.map((payment, index) => (
            <div
              key={`custom-${index}`}
              className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
            >
              <div className="font-semibold">{payment.firma}</div>
              <div className="text-sm text-gray-600">{payment.iban}</div>
              <div className="text-sm text-gray-500 mt-1">{payment.aciklama}</div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={payment.tutar}
                  disabled
                  className="input flex-1 bg-yellow-100"
                  placeholder="Tutar"
                />
                <button
                  onClick={() => onRemoveCustom(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
          <hr className="my-4" />
        </>
      )}

      {/* Normal hesaplar */}
      {accounts.map(account => {
        const isSelected = isSender 
          ? selectedAccount?.id === account.id
          : selectedAccounts.find(a => a.id === account.id)
          
        return (
          <div
            key={account.id}
            onClick={() => !isSender || onSelect(account)}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              isSelected
                ? isSender
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">{account.firma}</div>
            <div className="text-sm text-gray-600">
              {account.banka} - {account.para_birimi}
            </div>
            <div className="text-xs text-gray-500 mt-1">{account.iban}</div>
            
            {!isSender && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!isSelected}
                  onChange={(e) => {
                    e.stopPropagation()
                    onSelect(account)
                  }}
                  className="w-4 h-4"
                />
                <input
                  type="text"
                  value={isSelected?.tutar || ''}
                  onChange={(e) => onUpdateAmount(account.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={() => {
                    if (!isSelected) onSelect(account)
                  }}
                  className="input flex-1"
                  placeholder="Tutar girin"
                />
              </div>
            )}
          </div>
        )
      })}
      
      {accounts.length === 0 && customPayments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {isSender ? 'Hesap bulunamadı' : 'Uygun alıcı hesap yok'}
        </div>
      )}
    </div>
  )
}