# 💌 Invitation Date

Yon ti sit pou envite yon moun soti avè w : li louvri yon anvlòp, li reponn **Oui** (bouton **Non** an ap kouri 😂), li chwazi jou a, lè a, aktivite a ak manje a, epi ou resevwa tout repons li yo **sou email ou**, ak WhatsApp kòm opsyon sekou.

---

## 📁 Estrikti pwojè a

```
date-invitation/
├── index.html        → paj la (tout ekran yo)
├── css/
│   └── style.css     → tout style ak animasyon yo
├── js/
│   ├── config.js     → ✏️ SÈL FICHYE OU BEZWEN MODIFYE
│   └── app.js        → lojik la (bouton Non, etap yo, voye email)
└── README.md
```

---

## ✏️ 1. Konfigirasyon (`js/config.js`)

| Chan | Sa pou w mete |
|---|---|
| `fromName` | Non w (li parèt sou anvlòp la, tikè a ak ajanda a) |
| `herName` | Non li. Ou ka kite l vid epi mete l nan lyen an (gade pi ba) |
| `notify.email` | Email kote w vle resevwa repons lan |
| `notify.whatsapp` | Nimewo WhatsApp ou, chif sèlman, ak kòd peyi a. Egzanp : `50934123456` |
| `noMessages` | Ti mesaj komik ki parèt chak fwa li eseye peze **Non** |
| `noLimit` | Apre konbyen eseye bouton **Non** an tounen **Oui 🙈** |
| `times`, `activities`, `foods`… | Chwa yo. Ajoute, retire oswa chanje sa w vle |

---

## 📧 2. Aktive email la (FormSubmit, gratis)

Sit la sèvi ak **[FormSubmit](https://formsubmit.co)** pou voye email san sèvè, epi li pa bezwen kont.

1. Mete email ou nan `notify.email`.
2. Mete sit la an liy (etap 3), louvri l **ou menm**, epi ale jiska bout pou w konfime yon fo date.
3. Ou ap resevwa yon email **"Confirm your email"** nan men FormSubmit. Klike sou **Activate Form**. ⚠️ Gade nan Spam tou.
4. Kounye a tout repons yo ap rive sou email ou, ak sijè sa a :
   > 🎉 Frè, ou gen yon date! Sarah di WI

   Epi mesaj la gen ladan l :
   > Frè! Nou gen yon date la wi 😎🔥 Sarah aksepte envitasyon w lan. Li te eseye peze NON 7 fwa anvan l rann tèt li 😂. Prepare w, pa fè nou wont!

   Apre sa ou jwenn yon tablo ak : ki jou, ki lè, aktivite a, manje a, kijan n ap kontre, stil la, ti mesaj li, WhatsApp li, konbyen fwa li te eseye di NON, ak lè li louvri lèt la.

> 🔒 **Konsèy :** email ou ap parèt nan kòd sous la. Apre aktivasyon an, FormSubmit voye yon **alias sekrè** ba ou (yon seri lèt ak chif). Ranplase email ou pa alias sa a nan `config.js` pou moun pa wè vrè adrès ou.

---

## 🚀 3. Mete l an liy (GitHub Pages)

1. Kreye yon nouvo depo sou GitHub (egzanp `invitation`).
2. Mete tout fichye yo ladan l (`index.html`, dosye `css/` ak `js/`).
3. Ale nan **Settings → Pages → Deploy from a branch → `main` / root → Save**.
4. Apre 1 a 2 minit, lyen an pare : `https://<non-itilizatè>.github.io/invitation/`

---

## 🔗 4. Lyen pèsonalize

Ajoute non li nan lyen an :

```
https://<non-itilizatè>.github.io/invitation/?pou=Sarah
```

Anvlòp la ap ekri **"Pour Sarah"**, epi email ou resevwa a ap di **"Sarah di WI"**. Ou ka voye menm sit la bay plizyè moun… men fè atansyon 😏

---

## 🧪 5. Teste l

- Sit la sonje repons lan sou telefòn li. Si l louvri lyen an ankò, li tonbe dirèk sou tikè a ak rebou a.
- Pou w teste l plizyè fwa sou pwòp telefòn ou, ajoute `?reset=1` nan lyen an :
  `.../invitation/?pou=Sarah&reset=1`
- Si `notify.email` toujou gen `ton-email@gmail.com` ladan l, sit la mache an **mòd tès** : li pa voye okenn email, epi l afiche yon ti nòt anba.

---

## ✨ Sa ki ladan l

- Anvlòp ki louvri ak tenm, so lapòs ak dat jou a
- Bouton **Non** ki kouri (sou telefòn ak sou òdinatè), 11 mesaj komik, epi bouton **Oui** a ki vin pi gwo chak fwa
- Apre 12 eseye, bouton **Non** an tounen **Oui 🙈**
- 4 etap ak ba pwogresyon : jou + lè, aktivite, manje, detay (kijan n ap kontre, stil, non, WhatsApp, ti mesaj)
- Rekapitilasyon kote li ka modifye chak liy
- Tikè "Admission · 2 personnes" ak rebou (jou / è / minit)
- Bouton **Ajouter à mon agenda** (Google Calendar)
- Bouton **WhatsApp** ak mesaj la deja ekri. Si email la pa pati, bouton sa a vin bouton prensipal la
- Konfeti an fòm kè, ti kè k ap flote nan fon an
- Responsive (fèt pou telefòn an premye), epi li respekte paramèt "redwi animasyon"
- Aperçu lyen an (titre ak deskripsyon) lè w pataje l sou WhatsApp
