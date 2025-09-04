# Supabase API Anahtarını Bulma

## Supabase Dashboard'da:

1. **https://supabase.com/dashboard** adresine gidin
2. Projenizi seçin (prvnvuyqnvgpwqwycgtw)
3. Sol menüden **Settings** (Ayarlar) tıklayın
4. **API** sekmesine tıklayın

## API Sayfasında Görecekleriniz:

### 1. Project URL ✅
```
https://prvnvuyqnvgpwqwycgtw.supabase.co
```
(Bunu zaten buldunuz)

### 2. Project API keys bölümünde:

**anon public** anahtarı lazım (açık anahtar):
- Uzun bir string, genelde `eyJ` ile başlar
- Bu güvenli, client-side kullanılabilir
- "Reveal" veya göz ikonuna tıklayın
- Tamamını kopyalayın

**service_role** anahtarı (gizli - kullanmayın):
- Bu sadece backend için
- Client-side'da KULLANMAYIN

## .env.local Dosyanızı Güncelleyin:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://prvnvuyqnvgpwqwycgtw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (buraya anon public key'i yapıştırın)
```

## Alternatif Yol:

Supabase Dashboard'da sağ üstte **"Connect"** butonu varsa:
1. Connect'e tıklayın
2. "App Frameworks" → "Next.js" seçin
3. Environment variables'ı direkt kopyalayın

## Görsel Yardım:

API sayfasında şöyle görünür:
```
Project URL
https://prvnvuyqnvgpwqwycgtw.supabase.co

Project API keys
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Reveal]
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [Reveal]
```

**anon public** anahtarını kopyalayıp bana gönderin, lib/supabase.js dosyasını güncelleyelim.