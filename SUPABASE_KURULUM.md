# Supabase Kurulum Kılavuzu

## 1. Supabase Hesabı Oluşturma

1. [https://supabase.com](https://supabase.com) adresine gidin
2. **"Start your project"** butonuna tıklayın
3. GitHub hesabınızla giriş yapın (veya email ile kayıt olun)

## 2. Yeni Proje Oluşturma

1. Dashboard'da **"New Project"** butonuna tıklayın
2. Proje bilgileri:
   - **Name**: havale-talimat
   - **Database Password**: Güçlü bir şifre belirleyin (KAYDEDIN!)
   - **Region**: Europe (Frankfurt) veya size yakın olanı seçin
3. **"Create new project"** tıklayın (1-2 dakika sürer)

## 3. API Anahtarlarını Alma

Proje oluştuktan sonra:

1. Sol menüden **"Settings"** → **"API"** gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGci...` (uzun bir string)

## 4. Veritabanı Tablolarını Oluşturma

Sol menüden **"SQL Editor"** açın ve aşağıdaki SQL'i çalıştırın:

```sql
-- Hesaplar tablosu
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  firma VARCHAR(255) NOT NULL,
  banka VARCHAR(255) NOT NULL,
  para_birimi VARCHAR(10) NOT NULL,
  hesap_adi VARCHAR(255),
  hesap_no VARCHAR(50),
  iban VARCHAR(50) NOT NULL,
  sube VARCHAR(255),
  sehir VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Custom ödemeler tablosu
CREATE TABLE custom_payments (
  id SERIAL PRIMARY KEY,
  firma VARCHAR(255) NOT NULL,
  iban VARCHAR(50) NOT NULL,
  tutar DECIMAL(15,2),
  aciklama TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Talimat kayıtları tablosu
CREATE TABLE transfer_orders (
  id SERIAL PRIMARY KEY,
  gonderen_hesap_id INTEGER REFERENCES accounts(id),
  alicilar JSONB,
  toplam_tutar DECIMAL(15,2),
  para_birimi VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Firma logoları için Storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true);
```

## 5. Storage Ayarları

1. Sol menüden **"Storage"** gidin
2. **"Create a new bucket"** tıklayın:
   - Name: `logos`
   - Public bucket: ✅ işaretleyin
3. **"Create bucket"** tıklayın

## 6. .env.local Dosyası Oluşturma

Proje klasöründe `.env.local` dosyası oluşturun:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

⚠️ **ÖNEMLİ**: Bu değerleri Supabase dashboard'ınızdan kopyalayın!

## 7. Örnek Veri Ekleme (Opsiyonel)

SQL Editor'de çalıştırın:

```sql
-- Örnek hesaplar ekle
INSERT INTO accounts (firma, banka, para_birimi, hesap_adi, hesap_no, iban, sube, sehir) VALUES
('Set Kurumsal', 'Akbank', 'TL', 'Merkez', '123456', 'TR00 0000 0000 0000 0000 0000 01', 'Gayrettepe', 'İstanbul'),
('Set Kurumsal', 'Akbank', 'USD', 'Döviz', '123457', 'TR00 0000 0000 0000 0000 0000 02', 'Gayrettepe', 'İstanbul'),
('Pikart Teknoloji', 'Ziraat', 'TL', 'Genel', '789012', 'TR00 0000 0000 0000 0000 0000 03', 'Merkez', 'İstanbul');
```

## 8. Test Etme

```bash
# Proje klasörüne gidin
cd /Users/batuhanyukselen/Desktop/havale-talimat-web

# Bağımlılıkları yükleyin
npm install

# Development server başlatın
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

## Sorun Giderme

### "Invalid API key" hatası
- API anahtarını doğru kopyaladığınızdan emin olun
- `.env.local` dosyasının doğru klasörde olduğunu kontrol edin

### Tablo bulunamadı hatası
- SQL komutlarının başarıyla çalıştığını kontrol edin
- Table Editor'den tabloların oluştuğunu doğrulayın

### CORS hatası
- Supabase Dashboard → Settings → API → CORS
- Allowed Origins'e `http://localhost:3000` ekleyin

## Destek

Sorun yaşarsanız:
1. Supabase Discord: https://discord.supabase.com
2. Dokümantasyon: https://supabase.com/docs