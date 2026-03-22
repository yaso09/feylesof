[![GitHub](https://img.shields.io/badge/GitHub-yaso09%2Ffeylesof-1a1814?style=flat-square&logo=github)](https://github.com/yaso09/feylesof)
[![License](https://img.shields.io/badge/Lisans-GPL--3.0-6c6760?style=flat-square)](https://github.com/yaso09/feylesof/blob/main/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Tarayıcı-1a4c8b?style=flat-square&logo=googlechrome&logoColor=white)](https://yaso09.github.io/feylesof)

# Feylesof · Teorem Kanıtlayıcı

Önerme mantığı için tarayıcı tabanlı, Türkçe söz dizimine sahip interaktif bir teorem kanıtlayıcı. Herhangi bir kurulum veya sunucu gerektirmez; tek bir HTML dosyasından oluşur.

---

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Dosya Yapısı](#dosya-yapısı)
- [Kullanım](#kullanım)
  - [Temel Giriş Biçimi](#temel-giriş-biçimi)
  - [Aksiyom Tanımlama](#aksiyom-tanımlama)
  - [Hedef Belirtme](#hedef-belirtme)
  - [Söz Dizimi Referansı](#söz-dizimi-referansı)
  - [Niceleyici Aksiyomlar](#niceleyici-aksiyomlar)
  - [Eşitlik ve Sayısal Değerlendirme](#eşitlik-ve-sayısal-değerlendirme)
  - [Matematiksel Önermeler](#matematiksel-önermeler)
  - [Yorumlar](#yorumlar)
- [Kanıt Yöntemleri](#kanıt-yöntemleri)
  - [Doğal Çıkarım](#doğal-çıkarım)
  - [Çözünürlük](#çözünürlük)
  - [Analitik Çizelge](#analitik-çizelge)
  - [Doğruluk Tablosu](#doğruluk-tablosu)
- [Örnekler](#örnekler)
- [Teknik Mimari](#teknik-mimari)
- [Sınırlılıklar](#sınırlılıklar)
- [Geliştirici](#geliştirici)

---

## Genel Bakış

Feylesof, önerme mantığı teoremlerini dört farklı yöntemle eş zamanlı kanıtlayan bir araçtır. Kullanıcı aksiyomlarını ve kanıtlamak istediği önermeyi Türkçe uyumlu bir söz dizimi ile girer; araç otomatik olarak:

1. Doğal çıkarım zinciri oluşturur ve her adımı gerekçesiyle listeler,
2. Çözünürlük yöntemiyle CNF refütasyonu üretir,
3. Analitik çizelge ağacını çizer,
4. Doğruluk tablosunu hesaplar.

Tüm hesaplama istemci tarafında gerçekleşir; sunucu bağlantısı gerekmez.

---

## Özellikler

- **Saf tarayıcı uygulaması** — ağ bağlantısı olmaksızın çalışır, tek dosya
- **Türkçe söz dizimi** — `her x >= 0, P`, `bazı x elemanıdır A, P`, `=>`, `<=>`, `&&`, `||`
- **Otomatik sembol dönüşümü** — `=>` → `→`, `&&` → `∧`, `>=` → `≥` vb.
- **Niceleyici örnekleme** — `her x >= 0, x elemanıdır N` + `a = 5` → `a∈N` otomatik türetilir
- **Eşitlik zinciri** — `a = 5` tanımlanmışsa `a > 0` hedefi `5 > 0` olarak değerlendirilir
- **Serbest atom adları** — `isPrime(n)`, `x≥0`, `Sokrates_ölümlüdür`, `A₁` hepsi geçerli
- **Canlı önizleme** — giriş yazılırken formüller anlık ayrıştırılır ve hata gösterilir
- **Aksiyom isimlendirme** — `A1:`, `Teorem:`, `Hipotez:` gibi özel isimler
- **Dört kanıt yöntemi** eş zamanlı, tek tıkla
- **Adım adım kanıt listesi** — satır numaralı, gerekçeli Fitch tarzı sunum
- **Karşı model** — çizelge açık kalırsa aksiyomları yanlışlayan bir atama gösterilir
- **Türetilen önermeler paneli** — niceleyici örnekleri ve sayısal hesaplamalar görünür

---

## Dosya Yapısı

```
proje/
├── index.html                  # Ana sayfa (README.md içeriğini gösterir)
├── onerme-olusturucu.html      # Teorem kanıtlayıcı uygulaması
└── README.md                   # Bu dosya
```

`index.html`, `README.md` dosyasını `fetch` ile otomatik çekip `marked.js` ile işleyerek gösterir. İki dosya aynı dizinde olmalıdır.

---

## Kullanım

Tarayıcıda `onerme-olusturucu.html` dosyasını açın. Sol panele aksiyomları ve hedefi girin; ardından **Kanıtla** düğmesine tıklayın veya `Ctrl + Enter` tuşlarına basın.

### Temel Giriş Biçimi

```
// Yorum satırı
A1: <önerme>        ← aksiyom tanımı
A2: <önerme>
|- <önerme>         ← kanıtlanacak hedef
```

Her satır ya bir aksiyom ya bir hedef ya da yorum olmalıdır. Boş satırlar yok sayılır.

---

### Aksiyom Tanımlama

Aksiyomlar `İsim: Formül` biçiminde tanımlanır. İsim herhangi bir alfasayısal karakter dizisi olabilir.

```
A1: P => Q
A2: Q => R
Teorem3: (P && Q) => R
Hipotez: ~P || Q
```

Birden fazla aksiyom alt alta yazılır. Aksiyomların sırası kanıtta göründükleri sırayı belirler.

---

### Hedef Belirtme

Hedef aşağıdaki biçimlerden biriyle belirtilir:

```
|- P => R          // Standart (önerilen)
⊢ P => R           // Unicode sembolü
kanıtla: P => R    // Türkçe anahtar kelime
```

Giriş metninde yalnızca **bir** hedef bulunabilir.

**Virgül-noktalı virgül kısayolu:**

```
P => Q, Q => R; P => R
```

Bu ifade şuna eşdeğerdir:

```
H1: P => Q
H2: Q => R
|- P => R
```

---

### Söz Dizimi Referansı

| Yazım | Anlamı | Sembol | Okunuşu |
|---|---|---|---|
| `P => Q` | Koşullu / Eğer-Şart | `P → Q` | P ise Q |
| `P <=> Q` | Çift Koşullu | `P ↔ Q` | P ancak ve ancak Q |
| `P === Q` | Denklik | `P ≡ Q` | P denktir Q'ya |
| `P && Q` | Bağlaç | `P ∧ Q` | P ve Q |
| `P \|\| Q` | Ayrıştırma | `P ∨ Q` | P veya Q |
| `~P` | Olumsuzlama | `¬P` | P değil |
| `a >= b` | Büyük eşit | `a ≥ b` | a büyük eşit b |
| `a <= b` | Küçük eşit | `a ≤ b` | a küçük eşit b |
| `her x KOŞUL, SONUÇ` | Tümel niceleyici | `∀x(KOŞUL → SONUÇ)` | Her x için |
| `bazı x KOŞUL, SONUÇ` | Tikel niceleyici | `∃x(KOŞUL ∧ SONUÇ)` | Bazı x için |
| `t elemanıdır A` | Küme üyeliği | `t ∈ A` | t, A'nın elemanıdır |

**Öncelik sırası** (yüksekten düşüğe):

```
¬  (en yüksek)
∧
∨
→
↔  (en düşük)
```

Önceliği değiştirmek için parantez kullanın: `(P || Q) && R`

---

### Niceleyici Aksiyomlar

Niceleyici aksiyomlar, bilinen terimler üzerinde otomatik olarak örneklenir.

#### Koşullu niceleyici (karşılaştırma koruması)

```
her x >= 0, x elemanıdır N
a = 5
|- a elemanıdır N
```

Sistem şu adımları gerçekleştirir:
1. `a = 5` eşitliğini kaydeder.
2. `her x >= 0` koşulunu bilinen terimler için dener: `a >= 0` → `5 >= 0` → **doğru**.
3. `x` yerine `a` koyarak `a elemanıdır N` önermesini türetir.
4. Kanıt tamamlanır.

#### Küme üyeliği koruması

```
A1: her x elemanıdır A, x > 0
A2: 5 elemanıdır A
|- 5 > 0
```

Sistem `5 ∈ A` gerçeğini bulur, `x = 5` örneğini oluşturur, `A1[5]: 5>0` türetir.

#### Koşulsuz niceleyici

```
her x, P(x) => Q(x)
P(a)
|- Q(a)
```

Koşulsuz formda bilinen tüm terimler için örnekleme yapılır.

#### Desteklenen koşul biçimleri

| Yazım | Anlamı |
|---|---|
| `her x >= 0, P` | `∀x(x≥0 → P)` |
| `her x > 0, P` | `∀x(x>0 → P)` |
| `her x elemanıdır A, P` | `∀x∈A, P` |
| `her x, P` | `∀x, P` (koşulsuz) |
| `bazı x >= 0, P` | `∃x(x≥0 ∧ P)` — uygun terim yoksa tanık değişkeni oluşturulur |

---

### Eşitlik ve Sayısal Değerlendirme

`a = 5` gibi eşitlik gerçekleri tanımlandığında araç, tüm oluşturulan önermelerde bu eşitliği uygular ve sayısal karşılaştırmaları değerlendirir.

```
a = 5
|- a > 0
```

**İşlem akışı:**
1. `a = 5` eşitliği kaydedilir.
2. Hedef `a>0` atomunda `a` → `5` uygulanır: `5>0`.
3. `5>0` sayısal olarak **doğru** değerlendirilir.
4. `Hesap[a>0]: a>0` sentetik aksiyomu oluşturulur.
5. Kanıt tamamlanır.

**Desteklenen eşitlik örnekleri:**

| Giriş | Değerlendirme | Sonuç |
|---|---|---|
| `a=5`, `|- a>0` | `5>0` | ✓ Kanıtlandı |
| `a=5`, `b=3`, `|- a>b` | `5>3` | ✓ Kanıtlandı |
| `n=3`, `|- n>=2` | `3>=2` | ✓ Kanıtlandı |
| `x=0`, `|- x>0` | `0>0` | ✗ Kanıtlanamaz |

> **Not:** Eşitlik yalnızca **tek yönlüdür** (`a→5`). Simetrik substitüsyon (`5→a`) döngüye yol açacağından uygulanmaz.

---

### Matematiksel Önermeler

Atom adları (değişkenler) herhangi bir metin dizisi olabilir; aşağıdaki karakterler **dışında**:

```
( ) ↔ → ∧ ∨ ¬
```

Geçerli atom adı örnekleri:

```
P
isPrime(n)
x>=0
Sokrates_ölümlüdür
n_mod_2=0
A₁
```

Araç **önerme mantığı** düzeyinde çalışır; `isPrime(n)` atomu içsel yapısıyla değil, bir bütün olarak işlenir.

**Örnek — Modus Ponens matematiksel bağlamda:**

```
A1: isPrime(2)
A2: isPrime(2) => sonsuzMuPrime
|- sonsuzMuPrime
```

---

### Yorumlar

Satır sonuna veya satır başına `//` ile yorum eklenebilir:

```
// Bu bir açıklama satırıdır
A1: P => Q   // P doğruysa Q doğrudur
```

---

## Kanıt Yöntemleri

### Doğal Çıkarım

Fitch tarzı satır numaralı kanıt. Her adım şu bilgileri içerir:

```
1.  P → Q          Aksiyom
2.  Q → R          Aksiyom
3.  | P            Varsayım
4.  | Q            →E (1, 3)
5.  | R            →E (2, 4)
6.  P → R          →I (3, 5)       ◀ Hedef
```

**Desteklenen kurallar:**

| Kural | Açıklama |
|---|---|
| **→E** (Modus Ponens) | `A`, `A→B` ⊢ `B` |
| **→I** (Koşullu Kanıt) | `[A] ... B` ⊢ `A→B` |
| **∧E** (Ve-Elim) | `A∧B` ⊢ `A` ve `A∧B` ⊢ `B` |
| **∧I** (Ve-Giriş) | `A`, `B` ⊢ `A∧B` |
| **∨E** (Durum Ayrımı) | `A∨B`, `[A]→C`, `[B]→C` ⊢ `C` |
| **∨I** (Veya-Giriş) | `A` ⊢ `A∨B` |
| **↔E** (Denklik-Elim) | `A↔B` ⊢ `A→B` ve `B→A` |
| **↔I** (Denklik-Giriş) | `A→B`, `B→A` ⊢ `A↔B` |
| **¬I / RAA** | `[A] ... ⊥` ⊢ `¬A` |
| **¬¬E** | `¬¬A` ⊢ `A` |
| **MT** (Modus Tollens) | `A→B`, `¬B` ⊢ `¬A` |
| **DS** (Seçici Silogizm) | `A∨B`, `¬A` ⊢ `B` |
| **HS** (Hipotetik Silogizm) | `A→B`, `B→C` ⊢ `A→C` |
| **De Morgan** | `¬(A∧B)` ⊢ `¬A∨¬B` ve `¬(A∨B)` ⊢ `¬A∧¬B` |

Kanıt bulunamazsa "Doğal çıkarım kanıtı bulunamadı" uyarısı gösterilir; diğer yöntemlerin sonuçlarına bakılabilir.

---

### Çözünürlük

Robinson çözünürlük yöntemi. Aksiyomlar ve `¬Hedef` CNF'e dönüştürülür, ardından boş kloz `⊥` elde edilene kadar çözünürlük uygulanır.

**Dönüşüm adımları:**

1. `↔` eleme — `A↔B` → `(A→B)∧(B→A)`
2. `→` eleme — `A→B` → `¬A∨B`
3. De Morgan — `¬` iç baskı
4. Dağılım — `∨`'nin `∧` üzerine dağıtılması
5. Kloz toplama

**Çıktı biçimi:**

```
CNF (Aksiyomlar)
1.  ¬P∨Q              Aksiyom
2.  ¬Q∨R              Aksiyom

CNF (¬Hedef)
3.  P                 ¬Hedef
4.  ¬R                ¬Hedef

Çözünürlük Adımları
5.  Q                 Çözünürlük (1, 3, "P" üzerinden)
6.  R                 Çözünürlük (2, 5, "Q" üzerinden)
7.  ⊥ (Boş Kloz)      Çözünürlük (4, 6, "R" üzerinden)
```

---

### Analitik Çizelge

Aksiyomlar ve `¬Hedef`, analitik çizelge ağacına yerleştirilir. α (doğrusal) ve β (dallandırıcı) kurallar uygulanır.

**Kural tablosu:**

| Formül | Tür | Sonuç |
|---|---|---|
| `A∧B` | α | Alt satırlara `A`, `B` |
| `¬(A∨B)` | α | Alt satırlara `¬A`, `¬B` |
| `¬(A→B)` | α | Alt satırlara `A`, `¬B` |
| `¬¬A` | α | Alt satıra `A` |
| `A∨B` | β | Sol dala `A`, sağ dala `B` |
| `¬(A∧B)` | β | Sol dala `¬A`, sağ dala `¬B` |
| `A→B` | β | Sol dala `¬A`, sağ dala `B` |
| `A↔B` | β | Sol: `A,B` / Sağ: `¬A,¬B` |

**Gösterim:**

```
✓  = çözümlendi (kural uygulandı)
✕(r,s) = kapalı yol (r. ve s. satır çelişkiyor)
○  = açık yol (karşı model mevcut)
```

---

### Doğruluk Tablosu

Aksiyomlar ve hedefin tüm değer atamalarını listeler. Satırlar şu şekilde renklenir:

- **Yeşil** — aksiyomlar doğru ve hedef doğru
- **Kırmızı** — aksiyomlar doğru ama hedef yanlış *(karşı örnek)*

Aksiyom yoksa formülün statüsü belirlenir:

| Statü | Açıklama |
|---|---|
| **Totoloji** | Tüm satırlarda D |
| **Olumsal** | Bazı satırlarda D, bazılarında Y |
| **Çelişki** | Tüm satırlarda Y |

---

## Örnekler

### Örnek 1 — Hipotetik Silogizm

```
A1: P => Q
A2: Q => R
|- P => R
```

### Örnek 2 — Modus Tollens

```
A1: Yağmur_yağıyor => Zemin_ıslak
A2: ~Zemin_ıslak
|- ~Yağmur_yağıyor
```

### Örnek 3 — De Morgan

```
A1: ~(P && Q)
|- ~P || ~Q
```

### Örnek 4 — Totoloji Denetimi

```
|- P => (Q => P)
```

*Sonuç: Totoloji — tüm satırlarda doğru.*

### Örnek 5 — Denklik

```
A1: P <=> Q
|- (P => Q) && (Q => P)
```

### Örnek 6 — Geçersiz Çıkarım

```
A1: P => Q
|- Q => P
```

*Sonuç: Kanıtlanamıyor — doğruluk tablosunda kırmızı satır görünür.*

### Örnek 7 — Koşullu Niceleyici

```
her x >= 0, x elemanıdır N
a = 5
|- a elemanıdır N
```

*Sistem `5 >= 0` değerlendirmesinden `a∈N` türetir.*

### Örnek 8 — Küme Üyeliği Niceleyicisi

```
A1: her x elemanıdır A, x > 0
A2: 5 elemanıdır A
|- 5 > 0
```

### Örnek 9 — Sayısal Eşitlik Zinciri

```
a = 5
b = 3
|- a > b
```

*`5 > 3` sayısal olarak değerlendirilir.*

### Örnek 10 — Karmaşık İç İçe Yapı

```
A1: (P && Q) => R
A2: P
A3: Q
|- R
```

### Örnek 11 — Çelişkiden Her Şey Çıkar (Ex Falso)

```
A1: P
A2: ~P
|- Q
```

*Aksiyomlar çelişkili olduğundan tüm çizelge yolları otomatik kapanır.*

### Örnek 12 — Varoluşsal Niceleyici

```
bazı x > 0, isPrime(x)
|- isPrime(_w_x)
```

*Uygun terim bulunamazsa `_w_x` tanık değişkeni otomatik oluşturulur.*

---

## Teknik Mimari

### Bileşenler

```
onerme-olusturucu.html
├── 1.  Metin Normalizer          Türkçe söz dizimi → Unicode sembolleri
├── 2a. detectQuantifier()        Niceleyici satırlarını ayrıştırır
├── 2b. Editor Parser             Aksiyom/hedef satırlarını ayrıştırır
├── 2c. instantiateQuantifiers()  Niceleyici örneklemesi üretir
├── 2d. computeNumericFacts()     Eşitlik zinciri + sayısal değerlendirme
├── 3.  Formula Parser            Recursive descent parser → AST
├── 4.  Logic Core                ev(), cvars(), dep(), allSubs(), allAssigns()
├── 5.  Natural Deduction         Geriye dönük zincirleme + ileri doyum
├── 6.  CNF Converter             Bikonditional → implication → NNF → CNF
├── 7.  Resolution                Robinson çözünürlüğü, BFS kloz üretimi
├── 8.  Analytic Tableau          α/β kural uygulaması, dallanma
└── 9.  Truth Table               Tüm değer atamaları, alt ifade hesaplama
```

---

### AST Düğüm Tipleri

```javascript
{ type: 'var',  name: 'P' }               // Atom
{ type: 'not',  value: <node> }           // ¬A
{ type: 'and',  left: <node>, right: <node> }  // A∧B
{ type: 'or',   left: <node>, right: <node> }  // A∨B
{ type: 'imp',  left: <node>, right: <node> }  // A→B
{ type: 'iff',  left: <node>, right: <node> }  // A↔B
```

---

### Aksiyom Nesne Yapısı

Her aksiyom ayrıştırıldıktan sonra aşağıdaki türlerden biri olarak temsil edilir:

```javascript
// Sıradan aksiyom
{ name: 'A1', raw: '(P→Q)', ast: <AST>, err: null }

// Niceleyici aksiyom
{
  name: 'A1', type: 'forall',
  quantVar: 'x',
  guardType: 'cond',          // 'cond' | 'member' | 'none'
  guardTemplate: 'x>=0',
  concTemplate: 'x elemanıdır N',
  domain: null,               // 'member' tipinde doldurulur
  raw: '∀x(x≥0 → x∈N)',
  displayFull: '∀x(x≥0 → x∈N)',
  ast: null
}

// Örneklenmiş aksiyom (instance)
{
  name: 'A1[a]', type: 'instance',
  raw: 'a∈N',
  derivedFrom: 'A1', term: 'a',
  src: '(x>=0 sağlandı)',
  ast: <AST>
}

// Sayısal hesap aksiyomu
{
  name: 'Hesap[a>0]', type: 'computed',
  raw: 'a>0',
  derivedFrom: '5>0',
  ast: <AST>
}
```

---

### Metin Normalleştirme Sırası

`normalizeFormula()` fonksiyonu her girişe şu sırayla uygulanır:

```
1. // yorum satırları → boş
2. <=>  →  ↔
3. =>   →  →
4. ||   →  ∨
5. &&   →  ∧
6. ~    →  ¬
7. >=   →  ≥
8. <=   →  ≤
9. "x > 0"  →  "x>0"   (boşluklar kaldırılır)
10. "her x"  →  ∀x
11. "bazı x" →  ∃x
12. "t elemanıdır A" →  t∈A
```

---

### Niceleyici Örnekleme Algoritması

```
detectQuantifier(name, body):
  body başında "her" / "bazı" var mı?
  Evet → değişkeni ve korucu ifadeyi çıkar
    Korucu tür tespiti:
      "elemanıdır SET, SONUÇ"   → guardType = 'member'
      "RELOP VAL, SONUÇ"        → guardType = 'cond'
      ", SONUÇ"                 → guardType = 'none'

instantiateQuantifiers(axioms):
  gf = collectGroundFacts(axioms)
    → memberships: {term, domain}[]
    → equalities:  Map<variable, value>  (tek yönlü)
    → allTerms:    Set<string>

  Her niceleyici aksiyom için:
    if guardType === 'member':
      memberships'te domain eşleşenler → aday
    if guardType === 'cond':
      allTerms'teki her t için:
        expr = substVar(guardTemplate, x, t)
        expr = applyEqualities(expr, equalities)  ← tek geçiş
        evalNumericCond(expr) === 'true' → aday
    if guardType === 'none':
      allTerms'teki her t → aday

  Her aday t için:
    concInst = substVar(concTemplate, x, t)
    normalizeFormula(concInst) → parseFormula()
```

---

### Eşitlik Zinciri ve Sayısal Değerlendirme

```
collectGroundFacts(axioms):
  Tüm AST atomlarını tara:
    "t∈SET" → memberships'e ekle
    "VAR=VAL" → equalities.set(VAR, VAL)  ← sadece tek yön
    "VAL=VAR" → equalities.set(VAR, VAL)  ← sayı=değişken

computeNumericFacts(axioms, goal):
  Tüm AST'lardan atom isimlerini topla (seenAtoms)
  Her atom için:
    substituted = equalities ile tek geçiş uygula
    evalNumericCond(substituted):
      REL_OPS sırasıyla dene: >=, <=, ≥, ≤, ≠, >, <, =
      Her iki taraf parseFloat ile sayı ise → karşılaştır
      Sonuç true → sentetik aksiyom ekle

evalNumericCond("5>3"):
  op = '>'  lhs = 5  rhs = 3  → 5 > 3 → true
```

---

### Doğal Çıkarım Algoritması

Geriye dönük **hedef yönlü** arama + ileri **doyum** (saturation):

```
prove(hedef, düzey, derinlik):
  saturate(düzey):
    ¬¬E, ∧E, ↔E, De Morgan, →E (MP), MT, DS, HS — hepsi uygulanır
    fixed-point'e kadar tekrar (max 50 iterasyon)

  if has(hedef): return true   ← zaten türetildi

  match hedef.type:
    'imp' → →I:  assume left, prove right
    'and' → ∧I:  prove left ∧ right
    'or'  → ∨I:  prove left veya right
    'iff' → ↔I:  prove A→B ve B→A
    'not' → ¬I (RAA): assume inner, findContradiction()

  ∨E:  mevcut A∨B için case split → prove goal her dalda

  Snap/Rollback: başarısız dallar geri alınır
```

---

### CNF Dönüşümü

```
toCNF(n):
  1. elBi:    A↔B  →  (A→B)∧(B→A)
  2. elImp:   A→B  →  ¬A∨B
  3. pushNeg: ¬¬A → A
              ¬(A∧B) → ¬A∨¬B
              ¬(A∨B) → ¬A∧¬B
  4. dist:    A∨(B∧C) → (A∨B)∧(A∨C)
  5. getClauses: ∧ düğümlerini ayır, her yaprak → literal listesi
  6. Totolojik klozları filtrele (aynı değişkenin hem + hem − versiyonu)
```

---

### Performans Sınırları

| Parametre | Değer | Açıklama |
|---|---|---|
| ND adım sınırı | 800 | `ctr.n > LIMIT` kontrolü |
| ND derinlik sınırı | 8 | Özyineleme derinliği |
| ND doyum iterasyonu | 50 | Her saturate() çağrısında |
| Çözünürlük kloz sınırı | 500 | BFS genişlemesi |
| Analitik çizelge düğüm sınırı | 400 | `rc.n > TAB_LIMIT` |
| Doğruluk tablosu değişken sınırı | 14 | 2¹⁴ = 16 384 satır |
| Eşitlik uygulama geçişi | 1 | Döngüyü önlemek için tek geçiş |
| Niceleyici doyum iterasyonu | 10 | `applyEqualities` için |

---

## Sınırlılıklar

- **Birinci derece mantık değil** — `her x` niceleyicisi, gerçek ∀ mantığı yerine bilinen terimler üzerinde örnekleme ile simüle edilir. Sonsuz etki alanı teoremlerini kanıtlayamaz.
- **Aritmetik ifadeler** — `x + 1 > x` gibi ifadelerin içsel yapısı hesaplanamaz; ancak `x=3` verilmişse `3+1>3` atom olarak ele alınır (sayısal değerlendirme yalnızca basit iki-operandlı formlar için çalışır).
- **Büyük önermeler** — çok sayıda değişken veya derin iç içe yapılarda bazı kanıt yöntemleri adım/derinlik sınırına ulaşabilir.
- **Tek dosya** — tüm mantık tek HTML dosyasında saf JavaScript ile yazılmıştır; harici kütüphane bağımlılığı yoktur.
- **Doğruluk tablosu** — yalnızca boolean değişkenler için çalışır. Niceleyici örneklerinden türetilen sayısal atomlar doğruluk tablosunda P/Q gibi bağımsız boolean değişkenler olarak görünür.

---

## Geliştirici

**Yasir Eymen Kayabaşı**

[![GitHub](https://img.shields.io/badge/GitHub-yaso09-1a1814?style=flat-square&logo=github)](https://github.com/yaso09)

Bu proje, önerme mantığı derslerinde kullanılmak üzere geliştirilmiştir.