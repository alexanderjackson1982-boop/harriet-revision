/* Starter flashcard packs. Each card is [front, back]. Harriet can add these to her own cards with one tap. */
const STARTERS = {
  eng: { name: "Macbeth quotes", cards: [
    ["“Fair is foul, and foul is fair”: who says it, and what does it show?", "The Witches (Act 1, Scene 1). Things are not what they seem: appearance versus reality."],
    ["“Stars, hide your fires; / Let not light see my black and deep desires”", "Macbeth (Act 1, Scene 4). He hides his ambition to be king, even from himself."],
    ["“Look like th’ innocent flower, / But be the serpent under’t”", "Lady Macbeth (Act 1, Scene 5). Deception; the serpent links her to the devil in Eden."],
    ["“Unsex me here”", "Lady Macbeth (Act 1, Scene 5). She asks spirits to remove her feminine qualities so she can be cruel."],
    ["“Is this a dagger which I see before me”", "Macbeth (Act 2, Scene 1). A hallucination before Duncan's murder: his mind is already troubled."],
    ["“Will all great Neptune’s ocean wash this blood / Clean from my hand?”", "Macbeth (Act 2, Scene 2). Guilt: he feels nothing can clean away the murder."],
    ["“O, full of scorpions is my mind, dear wife!”", "Macbeth (Act 3, Scene 2). His mind is tormented by fear and guilt."],
    ["“Out, damned spot! out, I say!”", "Lady Macbeth (Act 5, Scene 1). Sleepwalking, she can't wash away imagined blood: guilt destroys her."],
    ["“Tomorrow, and tomorrow, and tomorrow”", "Macbeth (Act 5, Scene 5), after Lady Macbeth dies. Life feels meaningless."],
    ["“Macduff was from his mother’s womb / Untimely ripp’d”", "Macduff (Act 5, Scene 8). The prophecy was a trick: he was not “of woman born”."],
    ["“This dead butcher and his fiend-like queen”", "Malcolm (Act 5, Scene 8). How Scotland remembers the Macbeths: order is restored."],
    ["“Thou shalt get kings, though thou be none”", "The Witches to Banquo (Act 1, Scene 3). Leads Macbeth to fear Banquo and his sons."]
  ]},
  acc: { subject: "eng", name: "A Christmas Carol quotes", cards: [
    ["“solitary as an oyster”", "Stave 1, about Scrooge. Isolated and closed off, but with the hope of a pearl inside."],
    ["“Are there no prisons? … And the Union workhouses?”", "Scrooge, Stave 1. He thinks the poor should be dealt with by harsh institutions."],
    ["“decrease the surplus population”", "Scrooge, Stave 1. Echoes Malthus. The Ghost of Christmas Present throws it back at him."],
    ["“I wear the chain I forged in life”", "Marley's Ghost, Stave 1. We create our own punishment through greed."],
    ["“This boy is Ignorance. This girl is Want.”", "Ghost of Christmas Present, Stave 3. Dickens's warning to society about neglecting poor children."],
    ["“God bless us, every one!”", "Tiny Tim. Goodness and hope despite poverty."],
    ["“I will honour Christmas in my heart, and try to keep it all the year.”", "Scrooge, Stave 4. His promise to change."],
    ["“as merry as a schoolboy”", "Scrooge, Stave 5. His transformation: joyful and young again."]
  ]},
  hist: { name: "Medieval medicine (c1250 to c1700)", cards: [
    ["What was the Theory of the Four Humours?", "From Hippocrates. The body has four humours (blood, phlegm, yellow bile, black bile). Illness comes from an imbalance."],
    ["What was Galen's Theory of Opposites?", "Treat an illness with its opposite, e.g. a cold illness with something hot like pepper."],
    ["What is miasma?", "The belief that bad air causes disease. People carried posies or pomanders and burned herbs."],
    ["Black Death: when, and what did people think caused it?", "1348. God's punishment, miasma, the position of the planets, or humour imbalance. About a third of people died."],
    ["Who looked after the sick in medieval England?", "Physicians (university trained), apothecaries, barber surgeons, and women at home. Hospitals were mostly run by the Church."],
    ["Vesalius: what and when?", "1543, ‘On the Fabric of the Human Body’. Dissections proved Galen wrong on anatomy."],
    ["William Harvey: what and when?", "1628. Showed blood circulates around the body, pumped by the heart."],
    ["Who was Thomas Sydenham?", "The ‘English Hippocrates’ (1600s). Observed and recorded symptoms carefully to identify diseases."],
    ["Great Plague of 1665: what did the government do?", "Quarantine of houses, red crosses on doors, killing cats and dogs, banning public gatherings."],
    ["How did the printing press help medicine?", "From the 1440s, books could be copied quickly, so new ideas like Vesalius's spread faster."]
  ]},
  germany: { subject: "hist", name: "Weimar Germany dates", cards: [
    ["Article 48", "Let the President rule by decree in an emergency."],
    ["Article 231", "The Treaty of Versailles ‘war guilt’ clause."],
    ["Spartacist Revolt", "January 1919. Communist uprising in Berlin, crushed by the Freikorps."],
    ["Kapp Putsch", "March 1920. Right-wing uprising, defeated by a general strike."],
    ["Occupation of the Ruhr", "January 1923, by France and Belgium after missed reparations."],
    ["Munich Putsch", "November 1923. Hitler's failed attempt to seize power."],
    ["Rentenmark", "November 1923. Stresemann's new currency that ended hyperinflation."],
    ["Dawes Plan", "1924. US loans and reduced reparation payments."],
    ["Locarno Pact and joining the League of Nations", "1925 and 1926."],
    ["Young Plan", "1929. Cut total reparations and gave Germany longer to pay."],
    ["Wall Street Crash", "October 1929. US loans recalled, leading to the Depression."],
    ["Hitler becomes Chancellor", "30 January 1933."]
  ]},
  phys: { name: "Physics equations", cards: [
    ["Kinetic energy", "Ek = ½ × m × v²"],
    ["Gravitational potential energy", "Ep = m × g × h"],
    ["Elastic potential energy", "Ee = ½ × k × e²"],
    ["Efficiency", "useful output ÷ total input (× 100 for a percentage)"],
    ["Power (energy)", "P = E ÷ t"],
    ["Specific heat capacity", "ΔE = m × c × Δθ"],
    ["Potential difference", "V = I × R"],
    ["Charge", "Q = I × t"],
    ["Electrical power", "P = I × V, or P = I² × R"],
    ["Energy transferred (electricity)", "E = P × t, or E = Q × V"],
    ["Density", "ρ = m ÷ V"]
  ]},
  chem: { name: "Chemistry key facts", cards: [
    ["Relative charges of proton, neutron, electron", "+1, 0, −1"],
    ["Group 1 metal + water →", "metal hydroxide + hydrogen"],
    ["Acid + alkali →", "salt + water"],
    ["Acid + metal carbonate →", "salt + water + carbon dioxide"],
    ["Concentration (g/dm³)", "mass (g) ÷ volume (dm³)"],
    ["OIL RIG", "Oxidation Is Loss (of electrons), Reduction Is Gain"],
    ["Test for hydrogen", "Lit splint: squeaky pop"],
    ["Test for oxygen", "Relights a glowing splint"],
    ["Test for carbon dioxide", "Turns limewater cloudy"],
    ["Test for chlorine", "Bleaches damp litmus paper"]
  ]},
  bio: { name: "Biology key facts", cards: [
    ["Function of the nucleus", "Contains genetic material that controls the cell"],
    ["Function of mitochondria", "Where aerobic respiration happens"],
    ["Function of ribosomes", "Where proteins are made"],
    ["Function of chloroplasts", "Absorb light for photosynthesis"],
    ["Diffusion", "Spreading of particles from high to low concentration"],
    ["Amylase, protease, lipase break down…", "Starch, proteins, lipids (fats)"],
    ["Aerobic respiration word equation", "glucose + oxygen → carbon dioxide + water"],
    ["Photosynthesis word equation", "carbon dioxide + water → glucose + oxygen"],
    ["Name a viral, bacterial, fungal and protist disease", "Measles; salmonella; rose black spot; malaria"]
  ]},
  maths: { name: "Maths formulas", cards: [
    ["Area of a circle", "πr²"],
    ["Circumference", "πd (or 2πr)"],
    ["Sum of interior angles of an n-sided polygon", "(n − 2) × 180°"],
    ["Interior angle + exterior angle =", "180°"],
    ["Quadratic formula", "x = (−b ± √(b² − 4ac)) ÷ 2a"],
    ["Compound interest", "amount = P × (1 + r/100)ⁿ"],
    ["aᵐ × aⁿ, aᵐ ÷ aⁿ, (aᵐ)ⁿ", "aᵐ⁺ⁿ, aᵐ⁻ⁿ, aᵐⁿ"],
    ["a⁰ and a⁻ⁿ", "1 and 1 ÷ aⁿ"],
    ["Pythagoras", "a² + b² = c²"],
    ["Speed", "distance ÷ time"]
  ]},
  fr: { name: "French verbs", cards: [
    ["être (present)", "je suis, tu es, il est, nous sommes, vous êtes, ils sont"],
    ["avoir (present)", "j'ai, tu as, il a, nous avons, vous avez, ils ont"],
    ["aller (present)", "je vais, tu vas, il va, nous allons, vous allez, ils vont"],
    ["faire (present)", "je fais, tu fais, il fait, nous faisons, vous faites, ils font"],
    ["I went", "je suis allé(e)"],
    ["I ate", "j'ai mangé"],
    ["I saw", "j'ai vu"],
    ["I did / made", "j'ai fait"],
    ["I drank", "j'ai bu"],
    ["Three ways to give an opinion", "à mon avis…, je pense que…, je trouve que…"]
  ]},
  lang: { name: "Language Paper 2 essentials", cards: [
    ["Q1: marks and time", "4 marks, about 5 minutes. Choose four true statements."],
    ["Q2: what and marks", "Summary of differences between the sources. 8 marks, about 8 minutes."],
    ["Q3: what and marks", "Language analysis of one source. 12 marks, about 12 minutes."],
    ["Q4: what and marks", "Compare writers' perspectives and methods. 16 marks, about 20 minutes."],
    ["Q5: what and marks", "Viewpoint writing. 40 marks (24 content, 16 accuracy), about 45 minutes."],
    ["Persuasive techniques", "Direct address, anecdote, facts, opinions, rhetorical questions, the rule of three, statistics, emotive language"]
  ]}
};
