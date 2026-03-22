# Feylesof · Teorem Kanıtlayıcı

Önerme mantığı için tarayıcı tabanlı, Türkçe söz dizimine sahip interaktif bir teorem kanıtlayıcı. Herhangi bir kurulum gerektirmez; tek bir HTML dosyasından oluşur.

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
- **Türkçe söz dizimi** — `her x`, `bazı x`, `a elemanıdır B`, `=>`, `<=>`, `&&`, `||`
- **Otomatik sembol dönüşümü** — `=>` → `→`, `&&` → `∧`, `her x` → `∀x` vb.
- **Serbest atom adları** — `isPrime(n)`, `x≥0`, `Sokrates_ölümlüdür`, `A₁` hepsi geçerli
- **Canlı önizleme** — giriş yazılırken formüller anlık ayrıştırılır ve hata gösterilir
- **Aksiyom isimlendirme** — `A1:`, `Teorem:`, `Hipotez:` gibi özel isimler
- **Dört kanıt yöntemi** eş zamanlı, tek tıkla
- **Adım adım kanıt listesi** — satır numaralı, gerekçeli Fitch tarzı sunum
- **Karşı model** — çizelge açık kalırsa aksiyomları yanlışlayan bir atama gösterilir

---

## Dosya Yapısı

```
proje/
├── index.html                  # Ana sayfa (README.md içeriğini gösterir)
├── onerme-olusturucu.html      # Teorem kanıtlayıcı uygulaması
└── README.md                   # Bu dosya
```

`index.html`, `README.md` dosyasını otomatik olarak çekip işleyerek gösterir. İki dosya aynı dizinde olmalıdır.

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
MatAksiyom: x>=0 => x*x>=0
```

Birden fazla aksiyom alt alta yazılır. Aksiyomların sırası kanıtta göründükleri sırayı belirler.

---

### Hedef Belirtme

Hedef aşağıdaki üç biçimden biriyle belirtilir:

```
|- P => R          // Standart (önerilen)
⊢ P => R           // Unicode sembolü
kanıtla: P => R    // Türkçe anahtar kelime
```

Giriş metninde yalnızca **bir** hedef bulunabilir.

**Virgül-noktalı virgül kısayolu** — birden fazla öncülden doğrudan bir sonuç belirtmek için:

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
| `her x` | Tümel niceleyici | `∀x` | Her x için |
| `bazı x` | Tikel niceleyici | `∃x` | Bazı x için |
| `a elemanıdır B` | Küme üyeliği | `a ∈ B` | a, B'nin elemanıdır |

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
x*x>0
Sokrates_ölümlüdür
∀x.P(x)
n_mod_2=0
A₁
```

Bu sayede matematiksel önermeler doğrudan atom olarak kullanılabilir. Ancak unutmayın: araç **önerme mantığı** düzeyinde çalışır; `isPrime(n)` atomu içsel yapısıyla değil, bir bütün olarak işlenir.

**Örnek — Öklid teoremi benzeri:**

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

Robinson çözünürlük yöntemi. Aksiyomlar ve `¬Hedef` CNF'e (Konjonktif Normal Form) dönüştürülür, ardından boş kloz `⊥` elde edilene kadar çözünürlük uygulanır.

**Dönüşüm adımları:**

1. `↔` eleme — `A↔B` → `(A→B)∧(B→A)`
2. `→` elame — `A→B` → `¬A∨B`
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

Boş kloz `⊥` üretilirse teorem kanıtlanmış demektir.

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

Tüm yollar `✕` ile kapanırsa teorem kanıtlanmıştır. Açık yol kalırsa o yoldaki atomlardan bir **karşı model** üretilir.

---

### Doğruluk Tablosu

Aksiyomlar ve hedefin tüm değer atamalarını listeler. Satırlar şu şekilde renklenir:

- **Yeşil** — aksiyomlar doğru ve hedef doğru
- **Kırmızı** — aksiyomlar doğru ama hedef yanlış *(karşı örnek)*

Aksiyomların doğru olduğu her satırda hedef de doğruysa çıkarım **geçerlidir**.

Aksiyom yoksa (yalnızca hedef verilmişse) formülün statüsü belirlenir:

| Statü | Açıklama |
|---|---|
| **Totoloji** | Tüm satırlarda D |
| **Olumsal** | Bazı satırlarda D, bazılarında Y |
| **Çelişki** | Tüm satırlarda Y |

---

## Örnekler

### Örnek 1 — Hipotetik Silogizm

```
// P => Q, Q => R |- P => R
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

Aksiyom olmadan hedef belirtilirse formülün totoloji olup olmadığı denetlenir:

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

*Sonuç: Kanıtlanamıyor — çizelge açık kalır, doğruluk tablosunda kırmızı satır görünür.*

### Örnek 7 — Matematiksel Önermeler

```
A1: n>1 => ~isPrime(1)
A2: n>1
|- ~isPrime(1)
```

### Örnek 8 — Virgül Kısayolu

```
P => Q, Q => R, P; R
```

### Örnek 9 — Karmaşık İç İçe Yapı

```
A1: (P && Q) => R
A2: P
A3: Q
|- R
```

### Örnek 10 — Çelişkiden Her Şey Çıkar (Ex Falso)

```
A1: P
A2: ~P
|- Q
```

*Aksiyomlar çelişkili olduğundan tüm çizelge yolları otomatik kapanır.*

---

## Teknik Mimari

### Bileşenler

```
onerme-olusturucu.html
├── 1. Metin Normalizer     Türkçe söz dizimi → Unicode sembolleri
├── 2. Editor Parser        Aksiyom/hedef satırlarını ayrıştırır
├── 3. Formula Parser       Recursive descent parser → AST
├── 4. Logic Core           ev(), cvars(), dep(), allSubs(), allAssigns()
├── 5. Natural Deduction    Geriye dönük zincirleme + ileri doyum
├── 6. CNF Converter        Bikonditional → implication → NNF → CNF
├── 7. Resolution           Robinson çözünürlüğü, BFS kloz üretimi
├── 8. Analytic Tableau     α/β kural uygulaması, dallanma
└── 9. Truth Table          Tüm değer atamaları, alt ifade hesaplama
```

### AST Düğüm Tipleri

```javascript
{ type: 'var',  name: 'P' }
{ type: 'not',  value: <node> }
{ type: 'and',  left: <node>, right: <node> }
{ type: 'or',   left: <node>, right: <node> }
{ type: 'imp',  left: <node>, right: <node> }
{ type: 'iff',  left: <node>, right: <node> }
```

### Doğal Çıkarım Algoritması

Geriye dönük **hedef yönlü** arama ile çalışır. Her hedef tipi için özel bir giriş kuralı denenir; alt hedefler özyinelemeli olarak çözülür. Aynı zamanda ileri yönde **doyum** (saturation) döngüsü tüm mevcut türetim kurallarını uygular:

```
prove(hedef, düzey, derinlik):
  saturate()              ← mevcut adımlardan yeni adımlar türet
  if has(hedef): return   ← zaten türetildi
  match hedef.type:
    imp  → →I (koşullu kanıt)
    and  → ∧I (her iki konjünkti kanıtla)
    or   → ∨I (bir ayrıştırmayı kanıtla)
    iff  → ↔I (her iki yönü kanıtla)
    not  → ¬I/RAA (varsayımdan çelişki üret)
  try ∨E (ayrıştırma eleme)
```

### Performans Sınırları

| Parametre | Değer |
|---|---|
| Doğal çıkarım adım sınırı | 800 |
| Doğal çıkarım derinlik sınırı | 8 |
| Çözünürlük kloz sınırı | 500 |
| Analitik çizelge düğüm sınırı | 400 |
| Doğruluk tablosu değişken sınırı | 14 |

---

## Sınırlılıklar

- **Birinci derece mantık yok** — `her x`, `bazı x` yazımları atomik birimler olarak işlenir; niceleyici mantığı desteklenmez.
- **Aritmetik yok** — `x + 1 > x` gibi ifadelerin içsel doğruluğu hesaplanmaz; yalnızca atom olarak kullanılabilir.
- **Büyük önermeler** — çok sayıda değişken veya derin iç içe yapılarda bazı kanıt yöntemleri zaman aşımına uğrayabilir.
- **Tek dosya** — tüm mantık tek HTML dosyasında saf JavaScript ile yazılmıştır; harici kütüphane bağımlılığı yoktur.

---

## Geliştirici

**Yasir Eymen Kayabaşı**

Bu proje, önerme mantığı derslerinde kullanılmak üzere geliştirilmiştir.