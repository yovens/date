/* =========================================================
   ✏️  CONFIGURATION — tout ce que tu dois modifier est ici
   ========================================================= */
window.INVITE = {

  // Prénom de la personne invitée.
  // Astuce : tu peux aussi le mettre dans le lien → ...?pou=Sarah
  // (le lien a priorité sur cette valeur)
  herName: "",
  herFallback: "toi",          // affiché si aucun prénom n'est donné

  // Ton prénom (apparaît sur l'enveloppe, le billet et l'agenda)
  fromName: "Mr_Y",

  // Où tu reçois la réponse
  notify: {
    // Ton email (service gratuit FormSubmit, voir README)
    // Après activation, tu peux remplacer l'email par l'alias secret que FormSubmit t'envoie.
    email: "jocelynyouvens48@gmail.com",
    // Ton numéro WhatsApp au format international, chiffres uniquement (ex : 50934123456)
    whatsapp: "40160335"
  },

  intro: "J'ai une question importante à te poser. Prends ton temps… mais pas trop.",
  question: "Est-ce que tu veux sortir avec moi ?",

  // Messages quand elle essaie d'appuyer sur « Non »
  noMessages: [
    "Hmm… t'es sûre ? 🤨",
    "Raté ! Essaie encore 😏",
    "Erreur 404 : bouton « Non » introuvable",
    "Ce bouton est en maintenance 🛠️",
    "Le « Non » est parti en vacances 🏖️",
    "Même le bouton a peur de te dire non",
    "Tu vas te fatiguer avant moi 😌",
    "J'ai codé ce site, je connais toutes les astuces",
    "Tu as remarqué ? Le « Oui » grossit 👀",
    "Allez… le « Oui » t'attend juste là 👉",
    "Dernière chance de faire le bon choix 😇"
  ],
  // Après ce nombre d'essais, le bouton « Non » devient « Oui »
  noLimit: 12,

  // Nombre de jours proposés à partir de demain
  dayRange: 21,

  times: ["12:00", "14:00", "16:00", "18:00", "19:00", "20:00"],

  activities: [
    { label: "Restaurant",        emoji: "🍷", desc: "Un bon dîner, juste nous deux" },
    { label: "Cinéma",            emoji: "🎬", desc: "Film + pop-corn partagé" },
    { label: "Plage",             emoji: "🏖️", desc: "Soleil, mer et coucher de soleil" },
    { label: "Balade",            emoji: "🌿", desc: "Marcher, parler, rire" },
    { label: "Café & dessert",    emoji: "🍰", desc: "Simple et sucré" },
    { label: "Surprends-moi",     emoji: "🎁", desc: "Je te fais confiance" }
  ],

  foods: [
    { label: "Manje lakay",      emoji: "🍛", desc: "Griot, riz collé, banane pesée" },
    { label: "Pizza",            emoji: "🍕", desc: "Le grand classique" },
    { label: "Burger",           emoji: "🍔", desc: "Avec des frites, évidemment" },
    { label: "Fruits de mer",    emoji: "🦐", desc: "Lambi, poisson, crevettes" },
    { label: "Sushi",            emoji: "🍣", desc: "Pour les baguettes" },
    { label: "Juste un dessert", emoji: "🍨", desc: "Glace et douceurs" }
  ],

  meet: [
    { label: "Viens me chercher",     emoji: "🚗" },
    { label: "On se retrouve là-bas", emoji: "📍" }
  ],

  dress: [
    { label: "Décontracté",   emoji: "👟" },
    { label: "Chic",          emoji: "✨" },
    { label: "Surprends-moi", emoji: "🎲" }
  ],

  // Durée prévue du date (pour l'agenda), en heures
  durationHours: 3
};
