-- Hesaplar tablosu
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  firma VARCHAR(255) NOT NULL,
  banka VARCHAR(255) NOT NULL,
  para_birimi VARCHAR(10) NOT NULL,
  hesap_adi VARCHAR(255),
  hesap_no VARCHAR(50),
  iban VARCHAR(50) NOT NULL,
  sube VARCHAR(255),
  sehir VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom ödemeler tablosu
CREATE TABLE IF NOT EXISTS custom_payments (
  id SERIAL PRIMARY KEY,
  firma VARCHAR(255) NOT NULL,
  iban VARCHAR(50) NOT NULL,
  tutar DECIMAL(15,2),
  aciklama TEXT,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Talimat kayıtları tablosu
CREATE TABLE IF NOT EXISTS transfer_orders (
  id SERIAL PRIMARY KEY,
  gonderen_hesap_id INTEGER REFERENCES accounts(id),
  gonderen_firma VARCHAR(255),
  gonderen_banka VARCHAR(255),
  gonderen_iban VARCHAR(50),
  alicilar JSONB,
  toplam_tutar DECIMAL(15,2),
  para_birimi VARCHAR(10),
  document_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Firma logoları metadata tablosu
CREATE TABLE IF NOT EXISTS company_logos (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  logo_type VARCHAR(50) DEFAULT 'image',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Örnek veri ekleme
INSERT INTO accounts (firma, banka, para_birimi, hesap_adi, hesap_no, iban, sube, sehir) VALUES
('Set Kurumsal', 'Akbank', 'TL', 'Merkez Hesap', '123456', 'TR00 0000 0000 0000 0000 0000 01', 'Gayrettepe', 'İstanbul'),
('Set Kurumsal', 'Akbank', 'USD', 'Döviz Hesabı', '5555', 'TR00 0000 0000 0000 0000 5555', 'Gayrettepe', 'İstanbul'),
('Set Kurumsal', 'Akbank', 'EUR', 'Euro Hesabı', '7777', 'TR00 0000 0000 0000 0000 7777', 'Gayrettepe', 'İstanbul'),
('Set Personel', 'Garanti', 'TL', 'Personel Hesap', '234567', 'TR00 0000 0000 0000 0000 0000 02', 'Levent', 'İstanbul'),
('Setcard Filo', 'Ziraat', 'TL', 'Filo Hesap', '345678', 'TR00 0000 0000 0000 0000 0000 03', 'Merkez', 'Ankara'),
('Parleo', 'İş Bankası', 'TL', 'Genel Hesap', '456789', 'TR00 0000 0000 0000 0000 0000 04', 'Kadıköy', 'İstanbul'),
('PİKART TEKNOLOJİ HİZMETLERİ A.Ş.', 'Ziraat', 'TL', 'Teknoloji', '119631', 'TR31 0001 0021 8770 3930 7450 04', 'Şişli', 'İstanbul'),
('Pİ KONAKLAMA SEYAHAT VE KURUMSAL HİZMETLER ANONİM ŞİRKETİ', 'Yapı Kredi', 'TL', 'Konaklama', '567890', 'TR00 0000 0000 0000 0000 0000 05', 'Beşiktaş', 'İstanbul'),
('YENİCE E-TİCARET TARIM GIDA TOPTAN SATIŞ A. Ş.', 'Vakıfbank', 'TL', 'E-Ticaret', '678901', 'TR00 0000 0000 0000 0000 0000 06', 'Ataşehir', 'İstanbul')
ON CONFLICT DO NOTHING;

-- Firma logoları metadata
INSERT INTO company_logos (company_name, logo_url, logo_type) VALUES
('Set Kurumsal', '/logos/setcard_logo.png', 'image'),
('Set Personel', '/logos/setpys_logo.png', 'image'),
('Setcard Filo', '/logos/setcardfilo_logo.jpeg', 'image'),
('Parleo', '/logos/parleo_logo.png', 'image'),
('PİKART TEKNOLOJİ HİZMETLERİ A.Ş.', '/logos/pikart_logo.png', 'image'),
('Pİ KONAKLAMA SEYAHAT VE KURUMSAL HİZMETLER ANONİM ŞİRKETİ', NULL, 'text'),
('YENİCE E-TİCARET TARIM GIDA TOPTAN SATIŞ A. Ş.', NULL, 'text')
ON CONFLICT (company_name) DO NOTHING;

-- RLS (Row Level Security) politikaları
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_logos ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Public read access" ON accounts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_logos FOR SELECT USING (true);

-- Herkes oluşturabilir (demo için)
CREATE POLICY "Public insert access" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON custom_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON transfer_orders FOR INSERT WITH CHECK (true);