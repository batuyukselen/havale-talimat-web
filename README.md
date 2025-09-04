# Havale Talimat Sistemi - Web

Toplu havale talimatları oluşturma sistemi. Tamamen web tabanlı, platform bağımsız.

## Özellikler

- 📊 Excel'den hesap listesi yükleme
- 📝 Word formatında talimat oluşturma
- 🏦 Banka ve firma bazlı filtreleme
- 💱 Para birimi kontrolü
- 🎯 Onboarding flow ile kolay seçim
- 📤 Custom ödeme ekleme
- 🖼️ Firma logoları desteği

## Teknolojiler

- **Frontend**: Next.js / React
- **Backend**: Supabase
- **Deployment**: Netlify
- **Dosya İşleme**: Client-side JavaScript

## Kurulum

```bash
npm install
npm run dev
```

## Çevre Değişkenleri

`.env.local` dosyası oluşturun:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

Netlify üzerinden otomatik deployment yapılmaktadır.