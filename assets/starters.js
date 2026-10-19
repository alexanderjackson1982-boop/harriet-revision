/* Packs built from Harriet's school feedback. Marked focus: true so they show first. */
const FOCUS_PACKS = {
  sciSkills: { subject: "sci", focus: true, name: "Science skills: methods, comparing, graphs", cards: [
    ["Writing a practical method: what must it include?", "1. Equipment list. 2. Numbered steps in order. 3. What you will MEASURE and WHAT WITH (e.g. temperature with a thermometer). 4. What you keep the same. 5. Repeat and calculate a mean."],
    ["Independent, dependent and control variables", "Independent: the one you change. Dependent: the one you measure. Control: the ones you keep the same so it's a fair test."],
    ["Osmosis practical: what do you measure, and with what?", "Mass of each potato cylinder before and after, using a balance. Calculate percentage change in mass. Keep cylinders the same size (cork borer), blot dry, leave for the same time in each sugar solution."],
    ["Making a salt practical: method", "Warm the acid in a beaker. Add insoluble base (e.g. copper oxide) until no more dissolves. Filter (funnel and filter paper) to remove the excess. Heat the filtrate in an evaporating basin, then leave to crystallise."],
    ["Temperature change practical: what do you measure?", "Temperature with a thermometer before and after mixing, in a polystyrene cup with a lid (to reduce energy loss). Calculate the temperature change."],
    ["Electrolysis practical: what do you observe and test?", "Use inert (graphite) electrodes. Look for bubbles or metal on each electrode. Test gases: hydrogen squeaky pop, oxygen relights a glowing splint, chlorine bleaches damp litmus."],
    ["Specific heat capacity practical: what do you measure?", "Mass of the block (balance), temperature rise (thermometer), energy supplied (joulemeter, or V × I × t). Then c = ΔE ÷ (m × Δθ). Insulate the block."],
    ["Photosynthesis rate practical: method", "Put pondweed in water at set distances from a lamp. Count oxygen bubbles (or measure gas volume) in a set time. Keep temperature and carbon dioxide the same."],
    ["How to answer an ‘advantages and disadvantages’ question", "Give at least one advantage AND one disadvantage, each with a reason using science words. If asked to evaluate, finish with a judgement: ‘Overall… because…’."],
    ["Words that show you're comparing", "whereas, however, both, more than, less than, similarly. Make every point about BOTH things."],
    ["Example: advantages and disadvantages of wind turbines", "Advantages: renewable, no carbon dioxide released while generating. Disadvantages: unreliable (depends on wind), noise and visual pollution, high set-up cost."],
    ["Reading a value from a graph: 4 steps", "1. Read the axis labels and units. 2. Work out what one small square is worth. 3. Use a ruler to go from the axis to the line and across. 4. Write the value WITH units."],
    ["Describing a trend in a graph", "Say the overall pattern (increases / decreases), quote two values with units from the graph, and say where the pattern changes (e.g. ‘levels off at 40 °C’)."],
    ["Finding a rate or gradient from a graph", "Draw a large triangle on the straight part. Gradient = change in y ÷ change in x. Include units (e.g. cm³/s)."]
  ]},
  disease: { subject: "bio", focus: true, name: "Disease, growth and vaccines", cards: [
    ["How does tobacco mosaic virus (TMV) affect plant growth?", "It causes a mosaic pattern of discoloured leaves. Less chlorophyll means less photosynthesis, so less glucose for growth. The plant is stunted."],
    ["How does rose black spot affect plant growth?", "A fungus. Purple or black spots on leaves, which turn yellow and drop early. Fewer leaves means less photosynthesis, so the plant grows less. Spread by water and wind; treat with fungicide and remove affected leaves."],
    ["The chain to explain any disease reducing growth", "Pathogen damages leaves or cells → less chlorophyll or leaf area → less photosynthesis → less glucose → less energy from respiration and fewer materials (e.g. proteins, cellulose) for new cells → slower growth."],
    ["Measles", "Virus. Fever and red rash. Spread by droplets from sneezes and coughs. Prevented by vaccination."],
    ["HIV", "Virus. Attacks the immune system's white blood cells; can lead to AIDS. Spread by sexual contact and body fluids. Controlled with antiretroviral drugs."],
    ["Salmonella", "Bacterium. Food poisoning: fever, cramps, vomiting, diarrhoea, caused by toxins. Poultry are vaccinated to control it."],
    ["How does a vaccine give immunity? (4 steps)", "1. Contains dead or inactive pathogen. 2. Its antigens make white blood cells (lymphocytes) produce specific antibodies. 3. Memory cells stay in the blood. 4. If the real pathogen enters, antibodies are made much faster and in larger numbers, so you don't get ill."],
    ["Antigens and antibodies: what's the difference?", "Antigens are proteins on the surface of a pathogen. Antibodies are proteins made by white blood cells that lock on to one specific antigen."],
    ["Three ways white blood cells defend the body", "Phagocytosis (engulfing pathogens), producing antibodies, producing antitoxins."],
    ["What is herd immunity?", "When most people are vaccinated, the pathogen can't spread easily, which protects people who aren't immune."],
    ["Advantage and disadvantage of vaccination", "Advantage: prevents illness and can stop epidemics. Disadvantage: possible side effects (e.g. sore arm, rarely a bad reaction), and they don't always give immunity."]
  ]},
  bonding: { subject: "chem", focus: true, name: "Bonding and metals", cards: [
    ["Ionic bonding: what happens?", "Between a metal and a non-metal. The metal loses electrons to become a positive ion; the non-metal gains them to become a negative ion. Opposite ions are held by strong electrostatic attraction."],
    ["Ionic bonding example: sodium chloride", "Sodium loses 1 electron → Na⁺. Chlorine gains 1 electron → Cl⁻. Both now have full outer shells."],
    ["Properties of ionic compounds and why", "Giant lattice. High melting points: lots of energy needed to overcome strong attractions. Conduct when melted or dissolved (ions free to move), but not as solids."],
    ["Covalent bonding: what happens?", "Between non-metals. Atoms share pairs of electrons to get full outer shells."],
    ["Simple covalent molecules (e.g. water, CO₂): properties and why", "Low melting and boiling points because only weak forces between molecules need breaking (not the covalent bonds). Don't conduct electricity."],
    ["Giant covalent structures (diamond, graphite, silicon dioxide)", "Very high melting points: many strong covalent bonds must break. Graphite conducts because of delocalised electrons; diamond doesn't."],
    ["Metallic bonding: describe the structure", "A giant structure of positive metal ions in a ‘sea’ of delocalised electrons, held by strong electrostatic attraction."],
    ["Why do metals conduct electricity and heat?", "The delocalised electrons can move through the structure, carrying charge and energy."],
    ["Why do metals have high melting points?", "Strong metallic bonds: lots of energy is needed to overcome the attraction between ions and delocalised electrons."],
    ["Why are pure metals malleable?", "The layers of ions can slide over each other."],
    ["Why are alloys harder than pure metals?", "Atoms of different sizes distort the layers, so they can't slide over each other as easily."],
    ["Ionic vs covalent vs metallic in one line each", "Ionic: electrons transferred (metal + non-metal). Covalent: electrons shared (non-metals). Metallic: ions in a sea of delocalised electrons (metals)."]
  ]},
  analysis: { subject: "eng", focus: true, name: "Developing analysis: suggests and implies", cards: [
    ["The analysis ladder: 4 steps for every quote", "1. Short quote. 2. What it literally says. 3. What it SUGGESTS (the image or metaphor). 4. What it IMPLIES about the character or theme, and why the writer chose it."],
    ["Sentence starters for ‘suggests’", "This suggests…, The image of … connotes…, This evokes…, The metaphor presents … as…"],
    ["Sentence starters for ‘implies’", "This implies…, Shakespeare / Dickens may be hinting that…, The reader could infer…, On a deeper level…"],
    ["Zooming in on one word", "Pick the most powerful word. Give two or three of its connotations, then link them to the character or theme."],
    ["Offering a second interpretation", "However, it could also suggest…, which presents … as…"],
    ["Linking to the writer's purpose", "Shakespeare / Dickens / Russell uses this to warn, criticise or show the audience that…"],
    ["Develop it: “O, full of scorpions is my mind”", "Says: his mind is full of scorpions. Suggests: thoughts that sting, poison and won't keep still. Implies: guilt and paranoia torture him from inside; Shakespeare shows that murder brings no peace."],
    ["Develop it: “solitary as an oyster”", "Says: Scrooge is alone. Suggests: hard, closed, shut away from others. Implies: an oyster can hold a pearl, so Dickens hints there is goodness inside Scrooge waiting to be revealed."],
    ["Develop it: “But be the serpent under’t”", "Says: hide like a snake under a flower. Suggests: hidden danger behind innocence. Implies: links Lady Macbeth to the devil in Eden; she tempts Macbeth into sin as the serpent tempted Eve."],
    ["Develop it: “Out, damned spot!”", "Says: she wants a stain gone. Suggests: guilt she can't wash away. Implies: a reversal of her earlier ‘a little water clears us of this deed’; Shakespeare shows guilt destroying the mind."],
    ["Develop it: “I wear the chain I forged in life”", "Says: Marley carries a chain. Suggests: being trapped and weighed down. Implies: our greedy choices build our own punishment; Dickens warns readers to change before it's too late."]
  ]}
};

/* Starter flashcard packs. Each card is [front, back]. Harriet can add these to her own cards with one tap. */
const BASE_PACKS = {
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

const STARTERS = Object.assign({}, FOCUS_PACKS, BASE_PACKS);
