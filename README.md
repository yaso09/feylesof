# Feylesof · Teorem Kanıtlayıcı

[![GitHub](https://img.shields.io/badge/GitHub-yaso09%2Ffeylesof-1a1814?style=flat-square&logo=github)](https://github.com/yaso09/feylesof)
[![Lisans](https://img.shields.io/badge/Lisans-GPL--3.0-6c6760?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Tarayıcı%20%2F%20Node.js-1a4c8b?style=flat-square)](https://feylesof.vercel.app)
[![Versiyon](https://img.shields.io/badge/feylesof.js-v1.0.0-7a1f1f?style=flat-square)](#)

> Önerme mantığı için **tamamen tarayıcı tabanlı**, Türkçe söz dizimine sahip interaktif bir teorem kanıtlayıcı.  
> Kurulum gerektirmez. Sunucu gerektirmez. Tek bir HTML dosyasından çalışır.

---

## İçindekiler

1. [Projeye Genel Bakış](#1-projeye-genel-bakış)
2. [Hızlı Başlangıç](#2-hızlı-başlangıç)
3. [Dosya Yapısı](#3-dosya-yapısı)
4. [Arayüz Rehberi](#4-arayüz-rehberi)
5. [Söz Dizimi Referansı](#5-söz-dizimi-referansı)
   - 5.1 [Operatörler ve Öncelik](#51-operatörler-ve-öncelik)
   - 5.2 [Aksiyom Tanımlama](#52-aksiyom-tanımlama)
   - 5.3 [Hedef Belirtme](#53-hedef-belirtme)
   - 5.4 [Kısayol Söz Dizimi](#54-kısayol-söz-dizimi)
   - 5.5 [Niceleyici Aksiyomlar](#55-niceleyici-aksiyomlar)
   - 5.6 [Eşitlik ve Sayısal Değerlendirme](#56-eşitlik-ve-sayısal-değerlendirme)
   - 5.7 [Atom İsimleri](#57-atom-i̇simleri)
   - 5.8 [Yorumlar](#58-yorumlar)
6. [Kanıt Yöntemleri — Ayrıntılı](#6-kanıt-yöntemleri--ayrıntılı)
   - 6.1 [Doğal Çıkarım](#61-doğal-çıkarım)
   - 6.2 [Çözünürlük (CNF)](#62-çözünürlük-cnf)
   - 6.3 [Analitik Çizelge](#63-analitik-çizelge)
   - 6.4 [Doğruluk Tablosu](#64-doğruluk-tablosu)
7. [Örnekler Kütüphanesi](#7-örnekler-kütüphanesi)
8. [Kod Mimarisi — Derinlemesine](#8-kod-mimarisi--derinlemesine)
   - 8.1 [Mimari Katmanlar](#81-mimari-katmanlar)
   - 8.2 [Veri Akış Boru Hattı](#82-veri-akış-boru-hattı)
   - 8.3 [Normalleştirici](#83-normalleştirici)
   - 8.4 [Niceleyici Tespiti](#84-niceleyici-tespiti)
   - 8.5 [Editör Ayrıştırıcı](#85-editör-ayrıştırıcı)
   - 8.6 [Niceleyici Örnekleme Motoru](#86-niceleyici-örnekleme-motoru)
   - 8.7 [Sayısal Gerçek Hesaplayıcı](#87-sayısal-gerçek-hesaplayıcı)
   - 8.8 [Formül Ayrıştırıcı (Recursive Descent)](#88-formül-ayrıştırıcı-recursive-descent)
   - 8.9 [Mantık Çekirdeği](#89-mantık-çekirdeği)
   - 8.10 [Doğal Çıkarım Motoru](#810-doğal-çıkarım-motoru)
   - 8.11 [CNF Dönüştürücü](#811-cnf-dönüştürücü)
   - 8.12 [Çözünürlük Motoru](#812-çözünürlük-motoru)
   - 8.13 [Analitik Çizelge Motoru](#813-analitik-çizelge-motoru)
   - 8.14 [Doğruluk Tablosu Motoru](#814-doğruluk-tablosu-motoru)
   - 8.15 [UI Render Katmanı](#815-ui-render-katmanı)
9. [Veri Yapıları — Tam Şema](#9-veri-yapıları--tam-şema)
10. [API Referansı](#10-api-referansı)
11. [Performans Sınırları ve Tasarım Kararları](#11-performans-sınırları-ve-tasarım-kararları)
12. [Bilinen Sınırlılıklar](#12-bilinen-sınırlılıklar)
13. [Geliştirme Rehberi](#13-geliştirme-rehberi)
14. [Geliştirici](#14-geliştirici)

---

## 1. Projeye Genel Bakış

**Feylesof**, önerme mantığı teoremlerini dört farklı yöntemle **eş zamanlı** kanıtlayan, Türkçe söz dizimine sahip bir web uygulamasıdır.

Kullanıcı aksiyomlarını ve kanıtlamak istediği önermeyi girer; uygulama otomatik olarak:

1. **Doğal çıkarım** zinciri oluşturur ve her adımı Fitch tarzında gerekçesiyle listeler
2. **Çözünürlük** (Robinson) yöntemiyle CNF refütasyonu üretir
3. **Analitik çizelge** ağacını α/β kurallarıyla inşa eder
4. **Doğruluk tablosunu** hesaplar ve geçerli/geçersiz satırları renklendirir

Kanıt bulunamazsa bir **karşı model** (counterexample) veya neden kanıtlanamadığına dair bilgi gösterilir.

### Felsefe ve Tasarım Prensipleri

- **Sıfır bağımlılık:** Harici JavaScript kütüphanesi kullanılmaz. Tüm mantık motoru elle yazılmış saf JS'dir.
- **Tek dosya dağıtımı:** `teorem-kanitlayici.html` dosyası hem UI'ı hem de mantık motorunu barındırır; USB bellekten bile çalışır.
- **Türkçe öncelikli söz dizimi:** `her x >= 0, P`, `bazı x elemanıdır A, P`, `=>`, `&&`, `||` gibi ASCII-friendly girişler Unicode sembollere otomatik dönüştürülür.
- **Eş zamanlı çok yöntem:** Her kanıt girişiminde dört motor paralel çalışır; birinin başarısız olduğu durumda diğeri sonuç verebilir.
- **Canlı önizleme:** Kullanıcı yazarken formüller anlık ayrıştırılır, niceleyici örneklemeleri ve hatalar gerçek zamanlı gösterilir.

---

## 2. Hızlı Başlangıç

### Çevrimiçi Kullanım

[**https://feylesof.vercel.app/teorem-kanitlayici.html**](https://feylesof.vercel.app/teorem-kanitlayici.html) adresini tarayıcınızda açın. Kurulum gerekmez.

### Yerel Kullanım

```bash
git clone https://github.com/yaso09/feylesof.git
cd feylesof
# Doğrudan tarayıcıda açın — HTTP sunucusu gerekmez
open teorem-kanitlayici.html          # macOS
xdg-open teorem-kanitlayici.html     # Linux
start teorem-kanitlayici.html        # Windows
```

### Node.js Modülü Olarak Kullanım

`feylesof.js`, UMD modülü olarak tasarlanmıştır ve Node.js ortamında da çalışır:

```javascript
const Feylesof = require('./feylesof.js');

const result = Feylesof.prove(`
  A1: P => Q
  A2: Q => R
  |- P => R
`);

console.log(result.proved);    // true
console.log(result.goalStr);   // "(P→R)"
```

### İlk Kanıt

Editöre şunu yazıp **Kanıtla**'ya tıklayın veya `Ctrl+Enter`'a basın:

```
A1: P => Q
A2: Q => R
|- P => R
```

Sağ panelde dört sekmeli çıktı belirir:
- **Doğal Çıkarım** sekmesi → adım adım Fitch kanıtı
- **Çözünürlük** sekmesi → CNF kloz türetimi
- **Analitik Çizelge** sekmesi → çizelge ağacı
- **Doğruluk Tablosu** sekmesi → tüm değer atamaları

---

## 3. Dosya Yapısı

```
feylesof/
│
├── index.html                  # Ana sayfa
│                               # README.md'yi fetch → marked.js ile render eder
│                               # "Araca Git" butonu teorem-kanitlayici.html'e yönlendirir
│
├── teorem-kanitlayici.html     # Ana uygulama (tek dosya dağıtımı)
│   ├── <style>                 # Tüm CSS (CSS değişkenleri, layout, bileşenler)
│   ├── <script> feylesof.js   # Mantık motoru — UMD sarmalayıcı içinde inline
│   └── <script> UI Layer      # DOM manipülasyonu, render fonksiyonları
│
├── feylesof.js                 # Mantık motoru — bağımsız modül
│                               # (teorem-kanitlayici.html içinde de inline mevcuttur)
│
├── package.json                # Proje meta verisi
├── .gitignore
├── LICENSE                     # GPL-3.0
├── README.md                   # Bu dosya
└── docs/                       # Ek dokümantasyon
```

### `index.html` Hakkında

`index.html`, `README.md`'yi `fetch()` ile çekip `marked.js` CDN kütüphanesi aracılığıyla HTML'e dönüştürür ve sayfada gösterir. Dinamik içerik yüklemesi için `index.html` ve `README.md` dosyalarının aynı dizinde olması gerekir. `file://` protokolünde `fetch` çalışmayabileceğinden bu sayfa için yerel bir HTTP sunucusu önerilebilir:

```bash
python3 -m http.server 8000
# Sonra: http://localhost:8000
```

`teorem-kanitlayici.html` ise `file://` protokolüyle doğrudan çalışır.

---

## 4. Arayüz Rehberi

Uygulama iki ana bölüme ayrılır: sol **editör paneli** ve sağ **çıktı paneli**.

### Sol Panel — Editör

Sol panel üç sekme içerir:

**Editör sekmesi:**
- Üstte çok satırlı metin alanı — aksiyomlar ve hedef buraya yazılır
- Altında **önizleme alanı** — her tuş basışında ayrıştırılmış formüller anlık gösterilir; niceleyici örneklemeleri girintili liste halinde, hatalar kırmızıyla işaretlenir
- En altta **Kanıtla** butonu (`Ctrl+Enter` kısayoluyla da çalışır)

**Örnekler sekmesi:**
- Kategorilere göre hazır örnek koleksiyonu
- Her örneğin üzerine tıklanınca editöre yüklenir
- `[geçerli]` (yeşil), `[geçersiz]` (kırmızı), `[niceleyici]` (mavi) rozetleri ile işaretlenmiştir

**Söz Dizimi sekmesi:**
- Operatörler, niceleyiciler ve özel anahtar kelimeler için hızlı başvuru tablosu
- Sayısal değerlendirme ve niceleyici örnekleme hakkında kısa açıklamalar

### Sağ Panel — Çıktı

Kanıt çalıştırılmadan önce `⊢` ikonlu bekleme ekranı gösterilir.

Kanıt çalıştırıldıktan sonra:

1. **Karar kutusu (Verdict):** Kanıtlandı (yeşil, ✓) veya Kanıtlanamıyor (kırmızı, ✗). Altında aksiyom dizisi ve hedef gösterilir; hangi yöntemlerin başarılı olduğu renkli noktalarla özetlenir.

2. **Türetilen Önermeler paneli** *(yalnızca niceleyici veya eşitlik varsa):*  
   - "Niceleyici örnekleme" bölümü — hangi aksiyomdan hangi terimin örneklendiğini listeler  
   - "Eşitlik & sayısal değerlendirme" bölümü — eşitlik zincirinden türetilen sentetik aksiyomları listeler

3. **Dört çıktı sekmesi:** Her sekmenin solunda renkli bir nokta bulunur: yeşil (kanıt bulundu), kırmızı (bulunamadı), gri (uygulanamaz).
   - **Doğal Çıkarım** — adım numaralı, kural ve bağımlılık etiketli Fitch kanıtı
   - **Çözünürlük** — CNF klozları ve boş kloza ulaşım adımları
   - **Analitik Çizelge** — ağaç görselleştirmesi; kapalı (✕) ve açık (○) yollar
   - **Doğruluk Tablosu** — renk kodlu satırlar; alt ifadelerin tüm sütunları

### Paylaş Butonu

Sağ üstteki **Paylaş** butonu mevcut sayfanın URL'sini panoya kopyalar.

---

## 5. Söz Dizimi Referansı

### 5.1 Operatörler ve Öncelik

Giriş metni Unicode'a normalleştirilmeden önce aşağıdaki ASCII yazımları kabul edilir:

| ASCII Yazım | Unicode Sembol | Ad | Öncelik (yüksek = sıkı bağlar) |
|---|---|---|---|
| `~P` | `¬P` | Olumsuzlama | **5** (en yüksek) |
| `P && Q` | `P ∧ Q` | Bağlaç (ve) | **4** |
| `P \|\| Q` | `P ∨ Q` | Ayrıştırma (veya) | **3** |
| `P => Q` | `P → Q` | Koşullu (içerim) | **2** |
| `P <=> Q` | `P ↔ Q` | Çift koşullu / denklik | **1** (en düşük) |
| `P === Q` | `P ≡ Q` | Denklik (alternatif) | **1** |

**Öncelik Örnekleri:**

```
~P && Q         →  (¬P) ∧ Q          (¬ en sıkı bağlar)
P && Q || R     →  (P∧Q) ∨ R         (∧, ∨'den önce gelir)
P || Q => R     →  (P∨Q) → R         (∨, →'dan önce gelir)
P => Q => R     →  P → (Q → R)       (→ sağdan ilişkilendirilir)
P <=> Q => R    →  P ↔ (Q → R)       (↔ en zayıf)
```

Önceliği değiştirmek için parantez kullanın: `(P || Q) && R`

**Karşılaştırma operatörleri** (atom isimlerinin parçası olarak işlenir):

| ASCII | Unicode |
|---|---|
| `>=` | `≥` |
| `<=` | `≤` |

### 5.2 Aksiyom Tanımlama

```
İsim: Formül
```

- **İsim** isteğe bağlıdır. Verilmezse `H1`, `H2`, … olarak otomatik atanır.
- İsim Türkçe karakterler dahil alfasayısal olabilir: `A1`, `Teorem`, `Hipotez`, `Öncül3`
- İsim aynı anda birden fazla aksiyomda kullanılabilir (tekrar eden isimler bağımsızdır)

```
A1: P => Q
A2: Q => R
Teorem: P => R
Hipotez: ~P || Q
Öncül1: (P && Q) => R
```

### 5.3 Hedef Belirtme

Aşağıdaki üç biçim kabul edilir:

```
|- P => R           # Standart (önerilen)
⊢ P => R            # Unicode ⊢ sembolü
kanıtla: P => R     # Türkçe anahtar kelime
```

Bir giriş metninde en fazla **bir** hedef bulunabilir. Hedef yoksa `prove()` çağrısı hata döner.

### 5.4 Kısayol Söz Dizimi

Virgül-noktalı virgül söz dizimi, öncülleri ve sonucu tek satırda yazmaya olanak tanır:

```
P => Q, Q => R; P => R
```

Bu ifade otomatik olarak şuna dönüştürülür:

```
H1: P => Q
H2: Q => R
|- P => R
```

Birden fazla öncül virgülle ayrılır; son noktalı virgülden sonraki kısım hedef olur.

### 5.5 Niceleyici Aksiyomlar

Niceleyici aksiyomlar, aksiyomlar kümesinden toplanan **somut terimler** üzerinde örnekleme yaparak yeni önermeler türetir. Bu, gerçek birinci-derece ∀/∃ mantığından farklıdır (bkz. [Sınırlılıklar](#12-bilinen-sınırlılıklar)).

#### Tümel Niceleyici — `her`

```
her <değişken> <koşul>, <sonuç>
```

**Koşul biçimleri:**

| Yazım | Anlamı | Örnek |
|---|---|---|
| `her x >= 0, P` | `∀x(x≥0 → P)` | `her n >= 1, f(n) > 0` |
| `her x > 0, P` | `∀x(x>0 → P)` | `her x > 0, x*x > 0` |
| `her x <= 5, P` | `∀x(x≤5 → P)` | `her k <= 10, k elemanıdır A` |
| `her x elemanıdır A, P` | `∀x∈A, P(x)` | `her x elemanıdır N, x >= 0` |
| `her x, P` | `∀x, P(x)` (koşulsuz) | `her x, P(x) => Q(x)` |

#### Tikel Niceleyici — `bazı`

```
bazı <değişken> <koşul>, <sonuç>
```

Uygun terim bulunamazsa `_w_<değişken>` adında bir **varoluş tanığı** otomatik oluşturulur.

```
bazı x > 0, isPrime(x)
|- isPrime(_w_x)    # tanık değişkeni
```

#### Örnekleme Mekanizması

Örnekleme şu adımlarla gerçekleşir:

1. Tüm aksiyomların AST'lerinden **zemin gerçekler** toplanır:
   - `t∈A` biçimindeki atomlar → üyelik listesi
   - `VAR=SAYI` biçimindeki atomlar → eşitlik haritası
   - Tüm atom isimleri → terim kümesi

2. Her niceleyici aksiyom için aday terimler belirlenir:
   - `guardType = 'member'` → aynı etki alanında üye olan terimler
   - `guardType = 'cond'` → koşulu sayısal olarak sağlayan terimler
   - `guardType = 'none'` → tüm bilinen terimler

3. Her aday `t` için: `concTemplate` içindeki niceleyici değişken `t` ile değiştirilir, normalleştirme uygulanır, AST üretilir, yeni bir `instance` aksiyomu oluşturulur.

**Örnek — Adım Adım:**

```
her x >= 0, x elemanıdır N    # guardType = 'cond', guardTemplate = 'x>=0', concTemplate = 'x elemanıdır N'
a = 5                          # eşitlik: a→5, allTerms = {'a', '5', 'N'}
|- a elemanıdır N
```

1. `allTerms` = `{a, 5, N}` (N bir atom adı olarak da işlenir)
2. `a` için guard değerlendirmesi: `substVar("x>=0", x, a)` → `"a>=0"` → eşitlik uygulanır → `"5>=0"` → `evalNumericCond("5>=0")` → `"true"` ✓
3. `concTemplate` örneklenir: `substVar("x elemanıdır N", x, a)` → `"a elemanıdır N"` → normalleştirme → `"a∈N"`
4. Yeni aksiyom: `{ name: 'A1[a]', type: 'instance', raw: 'a∈N', ... }`
5. Hedef `a∈N` artık türetilmiş aksiyomlar arasında → **kanıt tamamlanır**

### 5.6 Eşitlik ve Sayısal Değerlendirme

`computeNumericFacts()` fonksiyonu şu adımları gerçekleştirir:

1. Tüm AST'lerden atom isimlerini toplar (`seenAtoms`)
2. Her atom için eşitlik haritasını **tek geçiş** olarak uygular (döngüyü önlemek için)
3. `evalNumericCond()` ile sayısal karşılaştırmayı değerlendirir
4. Sonuç `true` ise sentetik `Hesap[atom]` aksiyomu oluşturur

```
evalNumericCond("5>3"):
  REL_OPS dizisini sırayla dene: >=, <=, ≥, ≤, !=, ≠, >, <, =
  op = '>'  lhs = "5"  rhs = "3"
  parseFloat("5") = 5  parseFloat("3") = 3  → her ikisi de sayı
  5 > 3 → true
```

**Desteklenen karşılaştırma operatörleri (öncelik sırasıyla):**

`>=` → `<=` → `≥` → `≤` → `!=` → `≠` → `>` → `<` → `=`

> **Önemli:** Eşitlik yalnızca **tek yönlüdür**: `a = 5` tanımlandığında `a → 5` substitüsyonu uygulanır ama `5 → a` uygulanmaz. Bu, döngüsel değiştirmeyi önler.

**Örnekler:**

```
a = 5           →  Hesap[a>0]: a>0  (5>0 doğru)
a = 5, b = 3    →  Hesap[a>b]: a>b  (5>3 doğru)
x = 0           →  Hesap[x>0] oluşmaz  (0>0 yanlış)
```

### 5.7 Atom İsimleri

Atom isimleri (değişkenler), şu karakterler **dışında** herhangi bir metin dizisi olabilir:

```
( ) ↔ → ∧ ∨ ¬
```

Bu operatörler ayrıştırıcı tarafından özel sembol olarak işlenir ve atom adının parçası olamaz.

**Geçerli atom adı örnekleri:**

```
P
Q17
isPrime(n)
Sokrates_ölümlüdür
x>=0
n_mod_2=0
A₁
insan(sokrates)
büyükTür_5
```

Araç, bu atomları **önerme mantığı düzeyinde** bütünsel semboller olarak işler. `isPrime(n)` içindeki `n`'yi ayrıca işlemez.

### 5.8 Yorumlar

Satır içi ve satır başı yorum desteklenir:

```
// Bu tam satır yorumdur
A1: P => Q   // Bu satır sonu yorumudur
```

`normalizeFormula()` fonksiyonu, `//` ile başlayan tüm satır uzantılarını boşa dönüştürür. Blok yorum (`/* */`) desteklenmez.

---

## 6. Kanıt Yöntemleri — Ayrıntılı

### 6.1 Doğal Çıkarım

**Algoritma:** Geriye dönük hedef yönlü arama + ileri doyum (saturation)

`ndProve(hyps, goal)` fonksiyonu iki katmanlı bir strateji kullanır:

**İleri Doyum (`saturate`):**  
Her `prove()` çağrısından önce uygulanır. Mevcut adımlar üzerinde fixed-point'e ulaşana kadar (max 50 iterasyon) ileri kuralları çalıştırır:
- Tekli kurallar: `¬¬E`, `∧E` (sol ve sağ), `↔E` (her iki yön), `De Morgan`
- İkili kurallar: `→E` (Modus Ponens), `MT` (Modus Tollens), `DS` (Seçici Silogizm), `HS` (Hipotetik Silogizm)

**Geriye Dönük Arama (`prove`):**  
Hedefin yapısına göre uygun giriş kuralını seçer:

```
prove(hedef, düzey, derinlik):
  saturate(düzey)
  if has(hedef): return true

  match hedef.type:
    'imp' (P→Q):
      h = add(P, "Varsayım", level+1)
      prove(Q, level+1, dv+1)     → →I

    'and' (P∧Q):
      prove(P, level, dv+1)
      prove(Q, level, dv+1)       → ∧I

    'or' (P∨Q):
      prove(P, ...) OR prove(Q, ...)  → ∨I

    'iff' (P↔Q):
      prove(P→Q, ...) AND prove(Q→P, ...)  → ↔I

    'not' (¬P):
      h = add(P, "Varsayım (RAA)", level+1)
      saturate(level+1)
      findContradiction()          → ¬I

  Disjunction Elimination (∨E):
    mevcut A∨B için her dalda hedefi kanıtla

  return false
```

**Snap/Rollback Mekanizması:**  
Başarısız her deneme için `snap()` ile mevcut durum kaydedilir, başarısızlık halinde `rollback(sn)` ile geri dönülür. Bu, backtracking'i olanaklı kılar.

**Fitch Çıktısı:**  
Her adım için:
- `num`: Sıra numarası
- `fstr`: Formül dizisi
- `rule`: Uygulanan kural (`Aksiyom`, `→E`, `∧I`, vs.)
- `deps`: Bağımlı satır numaraları
- `level`: Varsayım derinliği (girinti için)
- `hyp`: Varsayım satırı mı?

**Tüm desteklenen kurallar:**

| Kural | Tür | Koşul | Sonuç |
|---|---|---|---|
| **Aksiyom** | — | — | Verilen önerme |
| **→E** (MP) | İkili | `A→B`, `A` | `B` |
| **→I** | Giriş | `[A]…B` | `A→B` |
| **∧E** | Elim | `A∧B` | `A` veya `B` |
| **∧I** | Giriş | `A`, `B` | `A∧B` |
| **∨E** | Elim | `A∨B`, `[A]→C`, `[B]→C` | `C` |
| **∨I** | Giriş | `A` | `A∨B` veya `B∨A` |
| **↔E** | Elim | `A↔B` | `A→B` ve `B→A` |
| **↔I** | Giriş | `A→B`, `B→A` | `A↔B` |
| **¬I (RAA)** | Giriş | `[A]…⊥` | `¬A` |
| **¬¬E** | Elim | `¬¬A` | `A` |
| **MT** | İkili | `A→B`, `¬B` | `¬A` |
| **DS** | İkili | `A∨B`, `¬A` | `B` (veya `¬B`→`A`) |
| **HS** | İkili | `A→B`, `B→C` | `A→C` |
| **De Morgan** | Tekli | `¬(A∧B)` | `¬A∨¬B` |
| **De Morgan** | Tekli | `¬(A∨B)` | `¬A∧¬B` |

---

### 6.2 Çözünürlük (CNF)

**Algoritma:** Robinson çözünürlük refütasyonu

`resolutionProve(hyps, goal)` şu adımları izler:

**Aşama 1 — CNF Dönüşümü:**  
Her aksiyom ve `¬Hedef` ayrı ayrı `toCNF()` ile CNF'e dönüştürülür.

`toCNF(n)` beş aşamalı bir dönüşüm zinciri uygular:

```
1. elBi(n):    A↔B  →  (A→B)∧(B→A)
2. elImp(n):   A→B  →  ¬A∨B
3. pushNeg(n): ¬¬A  →  A
               ¬(A∧B)  →  ¬A∨¬B      (De Morgan)
               ¬(A∨B)  →  ¬A∧¬B      (De Morgan)
               ¬var    →  ¬var        (literal, değişmez)
4. dist(n):    A∨(B∧C)  →  (A∨B)∧(A∨C)   (dağılım yasası)
               (A∧B)∨C  →  (A∨C)∧(B∨C)   (dağılım yasası)
5. getClauses: ∧ düğümlerini ayır → kloz listesi
               Totolojik klozları filtrele (aynı değişkenin + ve − versiyonu)
               Tekrar eden literalleri temizle
```

**Aşama 2 — Çözünürlük BFS:**  
Tüm mevcut klozlar bir kloz kümesine eklenir. BFS ile kloz çiftleri denenir:

```
doResolve(c1, c2):
  for each literal l1 in c1:
    for each literal l2 in c2:
      if l1.name == l2.name AND l1.pos != l2.pos:
        merged = (c1 - {l1}) ∪ (c2 - {l2})
        deduplicate(merged)
        if not tautology(merged):
          yield { clause: merged, lit: l1.name }
```

Boş kloz `⊥` elde edildiğinde kanıt tamamlanır.

**Çıktı renk kodlaması:**
- Mavi: `Aksiyom` kökenli klozlar
- Kırmızı: `¬Hedef` kökenli klozlar
- Yeşil: Boş kloz `⊥`
- Normal: Türetilmiş çözünürlük adımları

---

### 6.3 Analitik Çizelge

**Algoritma:** Semantic Tableau (α/β kural ayrımı)

`buildTableau(hyps, goal)` şu adımları izler:

1. Tüm aksiyomlar + `¬Hedef` başlangıç kümesini oluşturur
2. `tBuild(segRows, allPath, proc, rc)` özyinelemeli olarak çağrılır

**`tRule(n)` — Kural Sınıflandırması:**

| Formül | Tür | Üretilen Formüller |
|---|---|---|
| `A∧B` | α (doğrusal) | `A`, `B` |
| `¬(A∨B)` | α | `¬A`, `¬B` |
| `¬(A→B)` | α | `A`, `¬B` |
| `¬¬A` | α | `A` |
| `A∨B` | β (dallandırıcı) | Sol: `A` / Sağ: `B` |
| `¬(A∧B)` | β | Sol: `¬A` / Sağ: `¬B` |
| `A→B` | β | Sol: `¬A` / Sağ: `B` |
| `A↔B` | β | Sol: `A, B` / Sağ: `¬A, ¬B` |
| `¬(A↔B)` | β | Sol: `A, ¬B` / Sağ: `¬A, B` |

**Kapatma Koşulu (`tContr`):**  
Mevcut yolda aynı atomun hem pozitif (`P`) hem negatif (`¬P`) formda bulunması.

**Açık Yol ve Karşı Model (`tGetModel`):**  
Tüm yollar kapanmazsa açık yoldan bir değerlendirme (model) çıkarılır:
- Yolda `P` → `P = true`
- Yolda `¬P` → `P = false`

**Gösterim sembolleri:**
- `✓` yanında — o satır bir kural uygulamasının kaynağı (işaretlenmiş/çözümlenmiş)
- `✕(r,s)` — r. ve s. satırlar çelişkili → yol kapalı
- `○` — açık yol (çelişki bulunamadı)

**`tMarkProc`:**  
Hangi satırların kural kaynağı olduğunu işaretler (görsel `✓` için).

---

### 6.4 Doğruluk Tablosu

**Algoritma:** Brute-force 2ⁿ değer ataması

`buildTruthTable(hyps, goal)` şu adımları izler:

1. Tüm AST'lerden değişkenleri toplar (`collectVars`)
2. `allAssignments(vars)` ile 2ⁿ atama üretir (gri kodu sıralaması)
3. Her atama için her alt formülü `evaluate()` ile değerlendirir
4. Alt formüller derinliğe göre sıralanır (daha basit formüller önce)

**Satır renklendirmesi:**
- Tüm aksiyomlar `true` ve hedef `true` → `r-ok` (yeşil arka plan)
- Tüm aksiyomlar `true` ve hedef `false` → `r-ko` (kırmızı arka plan, karşı örnek!)

**Statü belirleme** (aksiyom yoksa):
```
Totoloji:   tüm satırlarda hedef = true
Çelişki:    tüm satırlarda hedef = false
Olumsal:    bazı satırlarda true, bazılarında false
```

**Geçerlilik:**
```
proved = (validRows.length > 0) AND (validRows.every(r => r[goalStr]))
```
`validRows`, aksiyomların hepsinin doğru olduğu satırları içerir.

---

## 7. Örnekler Kütüphanesi

Uygulamanın Örnekler sekmesinde aşağıdaki örnekler yer alır. Doğrudan editöre yüklemek için üzerine tıklayın.

### Temel Geçerli Çıkarımlar

```
// Modus Ponens
A1: P => Q
A2: P
|- Q
```

```
// Modus Tollens
A1: P => Q
A2: ~Q
|- ~P
```

```
// Hipotetik Silogizm
A1: P => Q
A2: Q => R
|- P => R
```

```
// Seçici Silogizm
A1: P || Q
A2: ~P
|- Q
```

```
// Çift Olumsuzlama
A1: ~~P
|- P
```

```
// Bağlaç Dağıtımı
A1: P && (Q || R)
|- (P && Q) || (P && R)
```

### Totoloji Denetimleri

```
// Dışlanan Orta Yasası
|- P || ~P
```

```
// De Morgan Yasası
|- ~(P && Q) <=> (~P || ~Q)
```

```
// Koşullu İhraç (Export)
|- (P && Q => R) <=> (P => Q => R)
```

```
// Kontrapoze
|- (P => Q) <=> (~Q => ~P)
```

```
// Pierce Yasası (klasik mantık totolojisi)
|- ((P => Q) => P) => P
```

### Geçersiz Çıkarım Örnekleri (Kanıtlanamaz)

```
// Dönüşüm hatası — geçersiz
A1: P => Q
|- Q => P
```

```
// Eklemleme hatası — geçersiz
A1: P || Q
A2: P
|- ~Q
```

### Niceleyici Örnekler

```
// Koşullu niceleyici
her x >= 0, x elemanıdır N
a = 5
|- a elemanıdır N
```

```
// Küme üyeliği niceleyicisi
A1: her x elemanıdır A, x > 0
A2: 5 elemanıdır A
|- 5 > 0
```

```
// Matematiksel atom isimleri
A1: isPrime(2)
A2: isPrime(2) => sonsuzMuPrime
|- sonsuzMuPrime
```

```
// Sayısal eşitlik zinciri
a = 5
b = 3
|- a > b
```

```
// Ex Falso (Çelişkiden Her Şey Çıkar)
A1: P
A2: ~P
|- Q
```

---

## 8. Kod Mimarisi — Derinlemesine

### 8.1 Mimari Katmanlar

`teorem-kanitlayici.html` iki bağımsız katmandan oluşur:

```
┌─────────────────────────────────────────────────────┐
│              UI Katmanı (inline <script>)            │
│  switchEditorTab · updatePreview · runProve          │
│  renderNDSteps · renderResolution · renderTableau    │
│  renderTruthTable · makeOutTab · EXAMPLES dizisi     │
├─────────────────────────────────────────────────────┤
│         Feylesof.js — Mantık Motoru                 │
│  (UMD sarmalayıcı: browser window.Feylesof / Node)  │
├──────────────────────────────────┬──────────────────┤
│  Ayrıştırıcı Katman              │  Kanıt Katmanı    │
│  normalizeFormula()              │  ndProve()        │
│  detectQuantifier()              │  resolutionProve()│
│  parseEditorText()               │  buildTableau()   │
│  instantiateQuantifiers()        │  buildTruthTable()│
│  computeNumericFacts()           │                   │
│  parseFormula() / tokenize()     │                   │
├──────────────────────────────────┴──────────────────┤
│  Mantık Çekirdeği                                    │
│  evaluate() · collectVars() · allAssignments()       │
│  allSubformulas() · formulaToString() · neg()        │
│  eqs() · depth() · toCNF() · clauseToString()        │
└─────────────────────────────────────────────────────┘
```

**UMD Sarmalayıcı:**  
`feylesof.js`, hem tarayıcı hem Node.js ortamında çalışan UMD (Universal Module Definition) sarmalayıcısı kullanır:

```javascript
(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();         // Node.js
  } else {
    root.Feylesof = factory();          // Tarayıcı
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  // ... tüm mantık motoru ...
  return { prove, parseEditorText, parseFormula, ... };
});
```

### 8.2 Veri Akış Boru Hattı

`prove(inputText)` çağrıldığında şu boru hattı yürütülür:

```
Ham Metin (string)
      │
      ▼ parseEditorText(raw)
      │   └── her satır için:
      │         normalizeFormula(satır)      ← ASCII → Unicode
      │         detectQuantifier(name, body) ← niceleyici mi?
      │         parseFormula(raw)            ← AST üret
      │
      ▼ instantiateQuantifiers(axioms)
      │   └── collectGroundFacts(axioms)     ← terimler, eşitlikler, üyelikler
      │         evalGuard(template, ...)     ← koşul değerlendirme
      │         substVar(template, v, term)  ← örnekleme
      │
      ▼ computeNumericFacts(axioms, goalAst)
      │   └── gatherAtoms(ast)               ← atom topla
      │         applyEqualities(expr, ...)   ← eşitlik substitüsyonu
      │         evalNumericCond(expr)        ← sayısal karşılaştırma
      │
      ▼ allEffective = regularAxioms + instances + numFacts
      │
      ├──► ndProve(hyps, goal)           → AdımNesnesi[] | null
      ├──► resolutionProve(hyps, goal)   → KlozNesnesi[] | null
      ├──► buildTableau(hyps, goal)      → ÇizelgeNesnesi | null
      └──► buildTruthTable(hyps, goal)   → TabloNesnesi
      │
      ▼ prove() sonuç nesnesi döner
```

### 8.3 Normalleştirici

`normalizeFormula(text)` fonksiyonu düzenli ifadeler zinciriyle çalışır:

```javascript
text = text.replace(/\/\/.*$/gm, '');          // 1. Yorumları sil
text = text.replace(/<==>/g, '↔');             // 2. <=> → ↔
text = text.replace(/<=>/g, '↔');             //    (uzun önce!)
text = text.replace(/===/g, '≡');             // 3. === → ≡
text = text.replace(/=>/g, '→');              // 4. => → →
text = text.replace(/\|\|/g, '∨');            // 5. || → ∨
text = text.replace(/&&/g, '∧');              // 6. && → ∧
text = text.replace(/~(?=\S)/g, '¬');         // 7. ~ → ¬ (boşluksuz)
text = text.replace(/~(?=\s)/g, '¬');         //    ~ → ¬ (boşluklu)
text = text.replace(/>=/g, '≥');              // 8. >= → ≥
text = text.replace(/<=/g, '≤');              // 9. <= → ≤
// 10. Operatör çevresi boşlukları kaldır
text = text.replace(/(\S)\s+([><≥≤≠=!]+)\s+(\S)/g, (m,a,op,b) => a+op+b);
text = text.replace(/\bher\s+(\S+)/g, '∀$1');  // 11. her x → ∀x
text = text.replace(/\bbazı\s+(\S+)/g, '∃$1'); // 12. bazı x → ∃x
// 13. t elemanıdır A → t∈A
text = text.replace(/\b(\S+)\s+eleman[ıi]d[ıi]r\s+(\S+)/g, '$1∈$2');
```

> **Sıra önemlidir:** `<=>` dönüşümü `<=` dönüşümünden önce yapılmalıdır; aksi hâlde `<=>` içindeki `<=` yanlış dönüştürülür.

### 8.4 Niceleyici Tespiti

`detectQuantifier(name, body)` fonksiyonu bir aksiyom satırının niceleyici içerip içermediğini tespit eder ve niceleyici yapısını çözümler.

Algoritma:
1. `body` `her` veya `bazı` ile başlıyor mu? → `qtype = 'forall' | 'exists'`
2. İlk kelimeden değişken adını ayır: `qv`
3. Geri kalan `afterVar` kısmını analiz et:
   - `elemanıdır SET, SONUÇ` → `guardType = 'member'`, `domain = SET`
   - `RELOP VAL, SONUÇ` → `guardType = 'cond'`, guard normalleştir
   - `, SONUÇ` (guard yok) → `guardType = 'none'`
   - Virgül yok → `guardType = 'none'`, tüm kısım `concTemplate`

`findTopLevelComma(s)` yardımcı fonksiyonu, parantez derinliğini takip ederek en üst düzeydeki ilk virgülü bulur (parantez içindeki virgülleri atlar).

Dönüş nesnesi:
```javascript
{
  name, type,          // 'forall' | 'exists'
  quantVar,            // 'x'
  guardType,           // 'cond' | 'member' | 'none'
  guardTemplate,       // 'x>=0'
  concTemplate,        // 'x elemanıdır N'
  domain,              // 'A' (guardType='member' ise)
  raw,                 // '∀x(x≥0 → x∈N)'
  displayFull,         // gösterim için tam sembolik form
  ast: null,           // niceleyiciler için null (henüz örneklenmedi)
  err: null
}
```

### 8.5 Editör Ayrıştırıcı

`parseEditorText(raw)` satır satır çalışır:

```javascript
for each line:
  1. Yorum temizle, trim
  2. Boş satır → atla
  3. Noktalı virgül içeriyor ve "İsim:" biçimi değil?
       → kısayol söz dizimi: "P,Q;R" → H1:P, H2:Q, |-R
  4. /^(\|-|⊢|kanıtla\s*:)\s*(.+)$/ eşleşiyor mu?
       → goal = { raw, ast, err }
  5. /^([A-Za-zÇçĞğİıÖöŞşÜü][...]*)\s*:\s*(.+)$/ eşleşiyor mu?
       → detectQuantifier(isim, gövde)
  6. Hiçbiri değil → detectQuantifier('H'+n, satır)
```

Aksiyomlar için `detectQuantifier()` sonucu niceleyici değilse (normal aksiyom) `parseFormula()` çağrılır; hata varsa `err` alanına yazılır.

### 8.6 Niceleyici Örnekleme Motoru

`instantiateQuantifiers(axioms)` fonksiyonu:

**`collectGroundFacts(axioms)`:**
```javascript
// Tüm AST atomlarını gezer
gather(node):
  if node.type === 'var':
    allTerms.add(node.name)                // her atom adı terim adayı
    
    // t∈A biçimi → üyelik gerçeği
    match "(.+)∈(.+)":
      memberships.push({term, domain, srcName})
    
    // VAR=SAYI biçimi → eşitlik (tek yön)
    match "([A-Za-z_...][A-Za-z0-9_]*)=(.+)":
      equalities.set(lhs, rhs)
    
    // SAYI=VAR biçimi → eşitlik (ters)
    match "([0-9][^=]*)=([A-Za-z_...][...])":
      equalities.set(rhs_var, lhs_num)
```

**`evalGuard(guardTemplate, qv, term, equalities, memberships)`:**
1. `substVar(guardTemplate, qv, term)` → guard içindeki değişkeni değiştir
2. `applyEqualities(expr, equalities)` → eşitlikleri uygula
3. `evalNumericCond(expr)` → sayısal karşılaştırma
4. veya `t∈A` biçimi için üyelik listesini kontrol et

**`applyEqualities(expr, equalities, qv, term)`:**
1. Önce `substVar(expr, qv, term)` ile niceleyici değişkeni değiştir
2. Sonra eşitlik haritasını tek geçişle uygula (regex ile tam kelime eşleşmesi)

> Eşitlik uygulaması yalnızca **bir geçiş** yapar. `a=5, b=a` durumunda `b → a → 5` zinciri otomatik değil, sadece `b → a` uygulanır.

### 8.7 Sayısal Gerçek Hesaplayıcı

`computeNumericFacts(axioms, goalAst)`:

```javascript
// 1. Tüm AST'lerden (aksiyomlar + hedef) atom isimlerini topla
seenAtoms = Set<string>

// 2. Eşitlik haritasındaki değerleri de ekle
equalities.forEach((val, key) => {
  seenAtoms.add(key);
  seenAtoms.add(val);
});

// 3. Her atom için:
seenAtoms.forEach(atom => {
  // VAR=SAYI biçimindeki atomları atla (bunlar zaten eşitlik kaynağı)
  if (atom.match(/^[A-Za-z_][A-Za-z0-9_]*=[^=]/)) return;
  
  // Eşitlik substitüsyonu (tek geçiş)
  substituted = applyEqualities(atom, equalities);
  
  // Sayısal değerlendirme
  result = evalNumericCond(substituted);
  
  if (result === 'true') {
    // Sentetik aksiyom oluştur
    numFacts.push({
      name: 'Hesap[' + atom + ']',
      type: 'computed',
      raw: normalizeFormula(atom),
      derivedFrom: substituted,
      ast: parseFormula(normalizeFormula(atom))
    });
  }
});
```

### 8.8 Formül Ayrıştırıcı (Recursive Descent)

`parseFormula(str)` fonksiyonu iki aşamalıdır:

**Tokenleştirme (`tokenize(src)`):**

```javascript
Karakter akışını tüketir:
  boşluk       → atla
  ↔ | ≡        → { t: 'iff' }
  →            → { t: 'imp' }
  ∧            → { t: 'and' }
  ∨            → { t: 'or' }
  ¬            → { t: 'not' }
  (            → { t: 'lp' }
  )            → { t: 'rp' }
  diğer        → { t: 'id', v: <boşluk/parantez/operatör dışı karakter dizisi> }
  
  Atom isimleri: boşluk, (, ), ↔, →, ∧, ∨, ¬ karakterlerine kadar tüketilir.
```

**Özyinelemeli İniş Ayrıştırıcısı:**

```
pBi():    biconditional — pIm() (↔ pBi())?     [sağ ilişkilendirme]
pIm():    implication  — pOr() (→ pIm())?      [sağ ilişkilendirme]
pOr():    disjunction  — pAnd() (∨ pAnd())*    [sol ilişkilendirme]
pAnd():   conjunction  — pNot() (∧ pNot())*    [sol ilişkilendirme]
pNot():   negation     — ¬ pNot() | pAtom()
pAtom():  atom         — '(' pBi() ')' | id
```

Ayrıştırma sonrası kalan token varsa hata fırlatılır (`'Fazla simge'`).

### 8.9 Mantık Çekirdeği

**`evaluate(node, valuation)`:**  
AST düğümünü boolean değerlendirme haritası (`{P: true, Q: false, …}`) ile hesaplar.

```javascript
switch(node.type):
  'var':  return !!valuation[node.name]
  'not':  return !evaluate(node.value, v)
  'and':  return evaluate(left) && evaluate(right)
  'or':   return evaluate(left) || evaluate(right)
  'imp':  return !evaluate(left) || evaluate(right)
  'iff':  return evaluate(left) === evaluate(right)
```

**`formulaToString(node)`:**  
AST → string dönüşümü. Her düğüm tipi için parantez ekleme kuralı:
- `var`: yalnızca ad
- `not`: `¬(...)` (her zaman parantezli)
- diğerleri: `(sol OP sağ)` biçiminde parantezli

Bu "tam parantezli" çıktı, formül karşılaştırmalarında (`eqs()`) belirsizliği önler.

**`eqs(a, b)`:**  
İki AST düğümünün `formulaToString()` çıktılarını karşılaştırır. Yapısal eşitlik yerine string eşitliği kullanılır (yeterli ve daha hızlı).

**`allSubformulas(node, list, seen)`:**  
Bir AST'nin tüm alt formüllerini benzersiz string'lere göre toplar.

**`collectVars(asts)`:**  
Birden fazla AST'den tüm değişken adlarını toplar ve sıralar.

**`allAssignments(vars)`:**  
`vars` listesi için 2ⁿ tüm boolean atamalarını üretir. Bit manipülasyonu kullanır:

```javascript
for i from 0 to 2^n - 1:
  vars.forEach((v, j) => row[v] = Boolean((i >> j) & 1))
```

**`depth(node)`:**  
AST derinliğini hesaplar. Doğruluk tablosunda alt formülleri derinliğe göre sıralamak için kullanılır.

### 8.10 Doğal Çıkarım Motoru

`ndProve(hyps, goal)`:

**Adım deposu yönetimi:**
- `steps[]`: Tüm kanıt adımları dizisi
- `derived`: Set — türetilmiş formüllerin string anahtarları
- `add(ast, rule, deps, level, isHyp)`: Yeni adım ekle (zaten türetildiyse atla)
- `find(ast)`: Adım dizisinde formülü ara
- `has(ast)`: `derived` kümesinde formül var mı?
- `snap()`: `{len, der}` anlık görüntü al
- `rollback(sn)`: Anlık görüntüye geri dön

**`findContr()`:**  
Mevcut adımlar arasında `A` ve `¬A` çiftini arar; bulursa `[adım_A, adım_negA]` döner.

**Doyum iterasyon sayacı (`ctr.n`):**  
Her kural uygulaması `ctr.n`'yi artırır. `ctr.n > LIMIT (800)` olursa arama durur.

### 8.11 CNF Dönüştürücü

`toCNF(n)` alt fonksiyonları:

**`dd(clause)` — Tekrar kaldırma:**  
Her literal için `'+name'` veya `'-name'` anahtarı oluşturur; Set ile tekrar eden literalleri filtreler.

**`taut(clause)` — Totoloji denetimi:**  
Aynı değişkenin hem pozitif hem negatif versiyonunun bulunup bulunmadığını kontrol eder; totolojik klozlar CNF'e dahil edilmez.

**`clauseKey(clause)`:**  
Klozu kanonik stringe dönüştürür (`+P|-Q|+R` biçimi, sıralı). Kloz kümesinde tekrar denetimi için kullanılır.

### 8.12 Çözünürlük Motoru

`resolutionProve(hyps, goal)`:

```javascript
// 1. CNF'e dönüştür ve kloz kümesine ekle
hyps.forEach(h => toCNF(h).forEach(c => addClause(c, 'Aksiyom', ...)))
toCNF(neg(goal)).forEach(c => addClause(c, '¬Hedef', ...))

// 2. Boş kloz zaten var mı?
if (keySet.has(clauseKey([]))) return steps;

// 3. BFS genişlemesi
while (changed && steps.length < MAX_500) {
  for each pair (i, j) in steps:
    for each resolvent of (steps[i], steps[j]):
      addClause(resolvent, 'Çözünürlük', [i.num, j.num], lit)
      if boş kloz: return steps
}

return null; // kanıt bulunamadı
```

**`addClause(clause, rule, from, lit, src)`:**  
`clauseKey()` ile kanonik anahtar üretir; `keySet`'te varsa eklenmez.

### 8.13 Analitik Çizelge Motoru

`buildTableau(hyps, goal)`:

**`tBuild(segRows, allPath, proc, rc)`:**

```javascript
// 1. Çelişki denetle
ct = tContr(allPath)
if (ct) return { type: 'closed', rows: segRows, by: ct }

// 2. İşlenmemiş kural uygulanabilir formül bul (allPath'te, proc'ta değil)
toP = allPath.find(it => !proc.has(it.row) && tRule(it.ast))
if (!toP) return { type: 'open', rows: segRows }  // açık yol

// 3. Kuralı uygula
proc.add(toP.row)
rule = tRule(toP.ast)

if (rule.a):  // α — doğrusal genişleme
  newItems = rule.fs.map(f => { row: ++rc.n, ast: f, from: toP.row, sym: rule.sym })
  return { type: 'alpha', child: tBuild(newItems, allPath+newItems, proc, rc) }
else:          // β — dallanma
  leftItems = rule.l.map(...)
  rightItems = rule.r.map(...)
  return { type: 'beta',
    left:  tBuild(leftItems,  allPath+leftItems,  proc, rc),
    right: tBuild(rightItems, allPath+rightItems, proc, rc) }
```

**`allPath`** her özyinelemeli çağrıya taşınır; bu, yolun tüm geçmişini içerir. Çelişki denetimi her zaman tam yol üzerinde yapılır.

### 8.14 Doğruluk Tablosu Motoru

`buildTruthTable(hyps, goal)`:

**Alt formül toplama:**
```javascript
allAsts.forEach(a => {
  allSubformulas(a)
    .sort((x, y) => depth(x) - depth(y) || ps(x).localeCompare(ps(y)))
    .forEach(e => {
      if (!seen.has(ps(e))) {
        seen.add(ps(e));
        subformulas.push(e);  // değişkenler zaten seen'de, tekrar eklenmez
      }
    });
});
```

Bu sıralama, tabloda sütunların soldan sağa artan karmaşıklıkta görünmesini sağlar.

### 8.15 UI Render Katmanı

UI katmanı, `Feylesof` nesnesini kullanır ve yalnızca HTML üretiminden sorumludur.

**`updatePreview()`:**  
`Feylesof.parseEditorText()` ve `Feylesof.instantiateQuantifiers()` çağırarak canlı önizleme HTML'i oluşturur. Niceleyici örneklemeleri girintili olarak gösterilir.

**`runProve()`:**  
1. `prove-btn`'e `computing` sınıfı ekler (animasyon)
2. `setTimeout(..., 30)` ile UI güncellemesine fırsat verir
3. `Feylesof.prove(raw)` çağırır
4. Hata varsa kırmızı hata bloğu render eder
5. Başarılıysa verdict, türetilen önermeler ve dört sekme içeriğini oluşturur

**`renderNDSteps(ndSteps, goalStr)`:**  
Aksiyom satırlarının ardından bir çizgi ekler; son hedef satırını yeşil kalın fontla vurgular; varsayım satırlarını morla gösterir; girinti için `margin-left` hesaplar.

**`renderResolution(resSteps)`:**  
Klozları kaynak grubuna (Aksiyom / ¬Hedef / Çözünürlük Adımları) göre bölümler; her gruba başlık ekler; boş klozu yeşil renkle vurgular.

**`renderTableauNode(seg, procSet)`:**  
Özyinelemeli HTML render. α düğümleri için dikey liste, β düğümleri için yan yana div yapısı.

**`renderTruthTable(tt)`:**  
Alt formül sütunlarında `sp` sınıfıyla görsel bölücü çizgisi ekler; anahtar formülleri (`gh` sınıfı) koyu arka planla vurgular.

---

## 9. Veri Yapıları — Tam Şema

### Aksiyom Nesnesi

```typescript
interface AksiyomNesnesi {
  name: string;          // 'A1', 'Teorem', 'H1', ...
  raw: string;           // Normalleştirilmiş formül dizisi
  ast: ASTDügüm | null;  // Ayrıştırılmış AST (niceleyiciler için null)
  err: string | null;    // Ayrıştırma hatası
  // Niceleyici tipler için ek alanlar:
  type?: 'forall' | 'exists';
  quantVar?: string;
  guardType?: 'cond' | 'member' | 'none';
  guardTemplate?: string | null;
  concTemplate?: string;
  domain?: string | null;
  displayFull?: string;
}
```

### Örneklenmiş Aksiyom

```typescript
interface ÖrnekNesnesi {
  name: string;          // 'A1[a]'
  type: 'instance';
  raw: string;           // 'a∈N'
  derivedFrom: string;   // 'A1'
  quantType: 'forall' | 'exists';
  term: string;          // 'a'
  src: string;           // '(x>=0 sağlandı)'
  ast: ASTDügüm | null;
  err: string | null;
}
```

### Sayısal Aksiyom

```typescript
interface HesapNesnesi {
  name: string;          // 'Hesap[a>0]'
  type: 'computed';
  raw: string;           // 'a>0'
  derivedFrom: string;   // '5>0'
  ast: ASTDügüm;
  err: null;
}
```

### AST Düğümü

```typescript
type ASTDügüm =
  | { type: 'var';  name: string }
  | { type: 'not';  value: ASTDügüm }
  | { type: 'and';  left: ASTDügüm; right: ASTDügüm }
  | { type: 'or';   left: ASTDügüm; right: ASTDügüm }
  | { type: 'imp';  left: ASTDügüm; right: ASTDügüm }
  | { type: 'iff';  left: ASTDügüm; right: ASTDügüm }
```

### Doğal Çıkarım Adımı

```typescript
interface AdımNesnesi {
  num: number;           // Sıra numarası (1'den başlar)
  fkey: string;          // formulaToString(ast) — benzersizlik anahtarı
  fstr: string;          // Gösterilen formül dizisi
  ast: ASTDügüm;
  rule: string;          // 'Aksiyom' | '→E' | '∧I' | 'Varsayım' | ...
  deps: number[];        // Bağlı satır numaraları
  level: number;         // Girinti derinliği (0 = kök)
  hyp: boolean;          // Varsayım satırı mı?
}
```

### CNF Klozu ve Çözünürlük Adımı

```typescript
interface Literal {
  pos: boolean;          // true = pozitif, false = negatif
  name: string;          // Değişken adı
}

interface KlozNesnesi {
  clause: Literal[];
  rule: 'Aksiyom' | '¬Hedef' | 'Çözünürlük';
  from: number[];        // Kaynak kloz numaraları
  lit: string;           // Çözünürlük literali
  src: string | number;  // Aksiyom indeksi veya kaynak açıklaması
  num: number;           // Sıra numarası
}
```

### Çizelge Düğümü

```typescript
type ÇizelgeDügümü =
  | { type: 'closed'; rows: SatırItem[]; by: [number, number] }
  | { type: 'open';   rows: SatırItem[] }
  | { type: 'alpha';  rows: SatırItem[]; procRow: number; child: ÇizelgeDügümü }
  | { type: 'beta';   rows: SatırItem[]; procRow: number;
      left: ÇizelgeDügümü; right: ÇizelgeDügümü }

interface SatırItem {
  row: number;           // Satır numarası (benzersiz)
  ast: ASTDügüm;
  from: number | null;   // Kaynak satır numarası
  sym: string | null;    // Kural sembolü (∧, ∨, →, ↔, ...)
}
```

### Çizelge Sonuç Nesnesi

```typescript
interface ÇizelgeNesnesi {
  tree: ÇizelgeDügümü;
  closed: boolean;
  model: Record<string, boolean> | null;  // Karşı model (closed=false ise)
  processedRows: Set<number>;             // Kural uygulanmış satırlar (✓ için)
}
```

### Doğruluk Tablosu Sonucu

```typescript
interface TabloNesnesi {
  vars: string[];                              // Değişken adları (sıralı)
  subformulas: ASTDügüm[];                     // Alt formüller (derinliğe göre)
  hypStrs: string[];                           // Aksiyom string'leri
  goalStr: string | null;
  rows: Record<string, boolean>[];             // Her atama için tüm değerler
  validRows: Record<string, boolean>[];        // Aksiyomların doğru olduğu satırlar
  proved: boolean;
  status: 'tautology' | 'contingent' | 'contradiction' | null;
}
```

### `prove()` Dönüş Nesnesi

```typescript
interface KanıtSonucu {
  proved: boolean;
  goalStr: string | null;
  axioms: AksiyomNesnesi[];
  goal: { raw: string; ast: ASTDügüm | null; err: string | null } | null;
  instances: ÖrnekNesnesi[];
  numFacts: HesapNesnesi[];
  allEffective: (AksiyomNesnesi | ÖrnekNesnesi | HesapNesnesi)[];
  ndSteps: AdımNesnesi[] | null;
  resSteps: KlozNesnesi[] | null;
  tableau: ÇizelgeNesnesi | null;
  truthTable: TabloNesnesi | null;
  errors: string[];
}
```

---

## 10. API Referansı

### `Feylesof.prove(inputText)`

Ana giriş noktası. Ham metin alır, tüm boru hattını çalıştırır, `KanıtSonucu` döner.

```javascript
const result = Feylesof.prove("A1: P => Q\nA2: P\n|- Q");
if (result.errors.length) { /* hata işle */ }
console.log(result.proved);    // true
console.log(result.ndSteps);   // AdımNesnesi[] veya null
```

### `Feylesof.parseEditorText(rawText)`

Ham metni ayrıştırarak aksiyom ve hedef nesneleri döner. `prove()` çağrısından bağımsız kullanılabilir (önizleme için).

```javascript
const { axioms, goal } = Feylesof.parseEditorText("A1: P\n|- P");
```

### `Feylesof.parseFormula(str)`

Normalleştirilmiş bir formül dizisini AST'ye dönüştürür. Hata durumunda exception fırlatır.

```javascript
const ast = Feylesof.parseFormula("P∧Q→R");
// { type: 'imp', left: { type: 'and', ... }, right: { type: 'var', name: 'R' } }
```

### `Feylesof.normalizeFormula(str)`

ASCII söz dizimini Unicode sembollere dönüştürür.

```javascript
Feylesof.normalizeFormula("P => Q && R")
// → "P→Q∧R"
```

### `Feylesof.formulaToString(ast)`

AST'yi tam parantezli string'e dönüştürür.

```javascript
Feylesof.formulaToString({ type: 'imp', left: { type: 'var', name: 'P' }, right: { type: 'var', name: 'Q' } })
// → "(P→Q)"
```

### `Feylesof.ndProve(hyps, goal)`

AST dizisi ve hedef AST alır. Adım nesneleri dizisi veya `null` döner.

```javascript
const p = Feylesof.parseFormula;
const steps = Feylesof.ndProve([p("P→Q"), p("P")], p("Q"));
```

### `Feylesof.resolutionProve(hyps, goal)`

Kloz nesneleri dizisi veya `null` döner.

### `Feylesof.buildTableau(hyps, goal)`

Çizelge sonuç nesnesi veya `null` döner.

### `Feylesof.buildTruthTable(hyps, goal)`

Tablo sonuç nesnesi döner. (14+ değişkende exception fırlatır)

### `Feylesof.evaluate(ast, valuation)`

```javascript
Feylesof.evaluate(p("P∧Q"), { P: true, Q: false })  // → false
```

### `Feylesof.toCNF(ast)`

AST'yi kloz dizisine dönüştürür.

```javascript
Feylesof.toCNF(p("P→Q"))
// → [[{ pos: false, name: 'P' }, { pos: true, name: 'Q' }]]
```

### `Feylesof.clauseToString(clause)`

```javascript
Feylesof.clauseToString([{ pos: false, name: 'P' }, { pos: true, name: 'Q' }])
// → "¬P∨Q"
```

### `Feylesof.instantiateQuantifiers(axioms)`

Niceleyici aksiyomlardan örnek nesneleri üretir.

### `Feylesof.computeNumericFacts(axioms, goalAst)`

Eşitlik zincirinden sayısal gerçekler türetir.

### `Feylesof.collectVars(asts)`

Birden fazla AST'den benzersiz değişken adlarını sıralı olarak toplar.

### `Feylesof.version`

```javascript
Feylesof.version  // → "1.0.0"
```

---

## 11. Performans Sınırları ve Tasarım Kararları

| Parametre | Değer | Kontrol Yeri | Neden |
|---|---|---|---|
| ND adım sınırı | 800 | `ctr.n > LIMIT` | Sonsuz arama döngüsünü önler |
| ND özyineleme derinliği | 8 | `dv > 8` parametresi | Yığın taşmasını önler |
| ND doyum iterasyonu | 50 | `saturate()` içi while | Her doyum çağrısı için |
| Çözünürlük kloz sınırı | 500 | `steps.length < MAX` | Kloz patlamasını önler |
| Analitik çizelge düğüm sınırı | 400 | `rc.n > TAB_LIMIT` | Sonsuz dallanmayı önler |
| Doğruluk tablosu değişken sınırı | 14 | `vars.length > 14` | 2¹⁴ = 16 384 satır (kabul edilebilir) |
| Eşitlik substitüsyonu geçişi | 1 | `applyEqualities` tasarımı | `a=b, b=c` zincirini önler |
| Niceleyici doyum iterasyonu | 10 | `instantiateQuantifiers` tasarımı | Örnekleme döngüsünü önler |

**Neden 4 yöntem?**  
Doğal çıkarım, karmaşık iç içe yapılarda başarısız olabilir; çözünürlük ve çizelge, farklı şekillerde daha güçlüdür. Dört yöntemi aynı anda çalıştırmak, herhangi birinin başarılı olmasını sağlar.

**Neden tek geçiş eşitlik substitüsyonu?**  
`a = b` ve `b = a` gibi döngüsel eşitlikler, çok geçişli substitüsyonla sonsuz döngüye yol açar. Tek geçiş bu riski ortadan kaldırır.

**Neden tam parantezli `formulaToString`?**  
Öncelik belirsizlikleri olmadan iki formülün string karşılaştırmasıyla yapısal eşitlik denetimi yapılabilir. `eqs(a, b)` fonksiyonunun güvenilirliği buna bağlıdır.

---

## 12. Bilinen Sınırlılıklar

**Gerçek birinci-derece mantık değil:**  
`her x >= 0, P(x)` sonsuz etki alanında `∀x.P(x)` değil; yalnızca aksiyomlardan derlenen bilinen somut terimler için örnekleme yapar. `a = 5` tanımlanmamışsa `a` terimi bilinmez ve örnekleme gerçekleşmez.

**Eşitlik zinciri tek adımlı:**  
`a = b` ve `b = 5` verilse bile `a → 5` doğrudan türetilmez; yalnızca `a → b` ve `b → 5` ayrı ayrı uygulanır.

**Aritmetik ifadeler:**  
`x + 1 > x` gibi ifadelerin içsel yapısı hesaplanamaz. Sayısal değerlendirme yalnızca iki operandlı basit karşılaştırma atomlarında çalışır.

**Büyük önermeler:**  
Çok sayıda değişken (>14) doğruluk tablosunu devre dışı bırakır. Çok derin iç içe yapılar ND motorunda adım sınırına ulaşabilir.

**Yalnızca önerme mantığı:**  
`isPrime(n)` gibi yüklemler bütünsel atom olarak işlenir; iç yapısı dikkate alınmaz.

---

## 13. Geliştirme Rehberi

### Yeni Çıkarım Kuralı Ekleme

`ndProve()` içindeki `saturate()` fonksiyonuna yeni kural eklenebilir:

```javascript
// Örnek: Hipotetik Silogizm zaten var, yeni kural örneği
if (fi.type === 'not' && fi.value && fi.value.type === 'or') {
  // ¬(A∨B) → ¬A ve ¬B  (De Morgan — bu zaten mevcut)
  tryAdd({type:'and', left: neg(fi.value.left), right: neg(fi.value.right)}, 'De Morgan', [ni]);
}
```

### Yeni Örnek Ekleme

`EXAMPLES` dizisine nesne ekleyin:

```javascript
{
  title: 'Örnek Adı',
  badge: 'valid',          // 'valid' | 'invalid' | 'quant'
  desc: 'Kısa açıklama',
  code: 'A1: P\n|- P'
}
```

### `feylesof.js`'yi Bağımsız Kullanma

```javascript
// Node.js
const Feylesof = require('./feylesof.js');

// HTML'de harici script
<script src="feylesof.js"></script>
<script>
  const r = Feylesof.prove("P, P=>Q; Q");
  console.log(r.proved);  // true
</script>
```

### CSS Değişkenleri (Tema)

Tüm renkler `:root` CSS değişkenleriyle tanımlanmıştır:

```css
:root {
  --bg: #fafaf8;       /* Ana arka plan */
  --bg2: #f0ede6;      /* Panel arka planı */
  --bg3: #e8e4dc;      /* Kod arka planı */
  --text: #1a1814;     /* Ana metin */
  --text2: #6c6760;    /* İkincil metin */
  --text3: #9a9490;    /* Soluk metin / etiketler */
  --accent: #7a1f1f;   /* Kırmızı / hata / olumsuz */
  --green: #1a5c2a;    /* Onay / kanıtlandı */
  --border: #d4cfc7;
  --blue: #1a4c8b;     /* Niceleyici / bilgi */
  --pur: #5a1a7a;      /* Varsayım / mor */
}
```

---

## 14. Geliştirici

**Yasir Eymen Kayabaşı**

[![GitHub](https://img.shields.io/badge/GitHub-yaso09-1a1814?style=flat-square&logo=github)](https://github.com/yaso09)

Bu proje, önerme mantığı derslerinde ve kişisel öğrenim amacıyla kullanılmak üzere geliştirilmiştir.

Hata bildirimi, öneri veya katkı için: [github.com/yaso09/feylesof/issues](https://github.com/yaso09/feylesof/issues)

---

*GPL-3.0 lisansı altında dağıtılmaktadır.*