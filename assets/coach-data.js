/* Exam Technique Coach: content.
   Questions here are written for practice in a GCSE style. They are not official exam-board questions or mark schemes. */

/* Reasons for losing marks, used by the mistake log and self-marking */
const REASONS = {
  knowledge: "Knowledge gap",
  misread: "Misread the question",
  command: "Misunderstood the command word",
  explain: "Explanation not developed enough",
  analysis: "Weak analysis",
  terms: "Wrong or missing key words",
  calc: "Calculation error",
  working: "Missing working",
  evidence: "Poor use of evidence"
};

/* English analysis skills tracked over time (from school feedback) */
const SKILLS = [
  ["literal", "Explained the literal meaning"],
  ["assoc", "Explored the associations of a key word or image"],
  ["suggest", "Explained what those associations suggest"],
  ["imply", "Developed a deeper or alternative implication"],
  ["evidence", "Supported it with the text or context"],
  ["beyond", "Went beyond factual description"]
];

/* Guided analysis workouts: each step has a prompt and a model to compare with */
const WORKOUTS = [
  { id: "oyster", text: "A Christmas Carol, Stave 1", quote: "solitary as an oyster", key: "oyster",
    steps: [
      ["What does it literally say?", "Scrooge keeps himself to himself, like an oyster does."],
      ["What do you associate with an oyster?", "A hard shell; clamped tightly shut; cold and wet; very hard to open. But an oyster can also hold a pearl hidden inside."],
      ["What do those associations suggest about Scrooge?", "He is closed off from other people, hard to reach and protects himself from any warmth or contact."],
      ["What else could it imply? Go deeper.", "The pearl hints that something valuable is hidden inside him. Dickens may be preparing the reader for Scrooge's redemption: like an oyster, he can be opened, and what is inside is worth finding."]
    ]},
  { id: "vaulting", text: "Macbeth, Act 1 Scene 7", quote: "Vaulting ambition, which o'erleaps itself", key: "vaulting",
    steps: [
      ["What does it literally say?", "Macbeth's ambition jumps so high that it overshoots and falls."],
      ["What do you associate with ‘vaulting’?", "Leaping up onto a horse, or over an obstacle; a big, energetic jump; overreaching; the risk of falling on the other side."],
      ["What do those associations suggest?", "Ambition is the only thing pushing Macbeth on, and it is reckless and out of control."],
      ["What else could it imply? Go deeper.", "Macbeth already seems to know where this leads: ambition that overreaches destroys itself. Shakespeare foreshadows his downfall, and Macbeth admits he has no good reason to kill Duncan except this ambition."]
    ]},
  { id: "flint", text: "A Christmas Carol, Stave 1", quote: "Hard and sharp as flint, from which no steel had ever struck out generous fire", key: "flint",
    steps: [
      ["What does it literally say?", "Scrooge is hard and sharp like a flint stone, and nothing has ever made a warm spark come from him."],
      ["What do you associate with flint?", "Cold, grey, hard stone; sharp edges that can cut. But flint is also used to make sparks and start fires when struck with steel."],
      ["What do those associations suggest?", "Scrooge is unfeeling and harsh, and his words or actions can hurt other people."],
      ["What else could it imply? Go deeper.", "Flint CAN make fire, so the warmth is possible: it just hasn't been ‘struck out’ yet. Dickens hints that the right force (the ghosts) could bring out Scrooge's generosity."]
    ]},
  { id: "stars", text: "Macbeth, Act 1 Scene 4", quote: "Stars, hide your fires; / Let not light see my black and deep desires", key: "black",
    steps: [
      ["What does it literally say?", "Macbeth asks the stars to stop shining so his wishes can't be seen."],
      ["What do you associate with light and dark here?", "Light: goodness, truth, God, being seen. Dark (‘black and deep’): evil, secrecy, sin, something hidden far down."],
      ["What do those associations suggest?", "He wants to hide his ambition to be king, because he knows it is wrong."],
      ["What else could it imply? Go deeper.", "He may even be hiding the thought from himself and from heaven. The light/dark imagery shows his conscience is still working, and sets up the play's theme of appearance versus reality."]
    ]}
];

/* "Spot the key word" checks */
const KEYWORD_CHECKS = [
  { q: "In “O, full of scorpions is my mind”, which word is most worth zooming in on?", a: ["mind", "scorpions", "my", "O"], c: 1, why: "‘Scorpions’ carries the image: stinging, poison, restlessness. You could also explore ‘full’ (there is no room for peace)." },
  { q: "In “solitary as an oyster”, which word carries the image to explore?", a: ["solitary", "as", "oyster", "an"], c: 2, why: "‘Oyster’ gives you associations to unpack: a hard shell, clamped shut, but a possible pearl inside." },
  { q: "In “I wear the chain I forged in life”, which word most develops the meaning?", a: ["wear", "forged", "life", "I"], c: 1, why: "‘Forged’ shows Marley made the chain himself, link by link, through his own choices. ‘Chain’ is the image; ‘forged’ develops it." }
];

/* Improve-a-paragraph tasks */
const IMPROVE = [
  { id: "imp-oyster", weak: "In Stave 1 Dickens describes Scrooge as “solitary as an oyster”. This is a simile. This shows that he is lonely.",
    problem: "It names the technique and gives one simple meaning, but never explores the oyster image or what it might imply.",
    model: "Dickens's simile “solitary as an oyster” suggests Scrooge is clamped shut against the world: hard, cold and difficult to reach. However, oysters can hide pearls, which implies that something valuable is buried inside him. This prepares the reader for his transformation, suggesting Dickens believes even the hardest people can be opened up and changed." },
  { id: "imp-scorpions", weak: "Macbeth says “O, full of scorpions is my mind”. This is a metaphor. It means he is worried.",
    problem: "Correct but factual. ‘Worried’ is too mild, and the scorpions are never explored.",
    model: "The metaphor “full of scorpions” suggests thoughts that sting and poison Macbeth from within, crawling restlessly so he cannot settle. The word “full” implies there is no room left for peace. Coming as he plans Banquo's murder, it implies his guilt and paranoia are growing, not fading: Shakespeare presents his crimes as their own punishment." }
];

/* Worked examples: basic → partial → developed */
const ENGLISH_EXAMPLES = [
  { q: "How does the writer present the character through the metaphor “He was a lion”?",
    levels: [
      ["Factual", "The writer says he is a lion, which means he is brave.", "Correct, but it gives one obvious meaning and stops."],
      ["Partly analytical", "By comparing him to a lion, the writer suggests bravery and strength, showing he is a leader.", "Better: it explores the image a little and links it to character."],
      ["Developed", "By comparing the character to a lion, the writer suggests bravery and strength. However, lions can also represent aggression and danger, implying that his courage might make him intimidating or unpredictable.", "Strongest: it explores more than one association and develops an implication. It stays rooted in the image: lions really are both brave and dangerous."]
    ]},
  { q: "How does Shakespeare present Macbeth's state of mind in “O, full of scorpions is my mind, dear wife!”?",
    levels: [
      ["Factual", "Macbeth says his mind is full of scorpions, which means he is worried.", "Accurate but describes rather than analyses. ‘Worried’ undersells the image."],
      ["Partly analytical", "The metaphor “full of scorpions” suggests Macbeth's thoughts are painful and dangerous, showing he is anxious.", "Better: it explains what the metaphor suggests, but doesn't develop why it matters at this point in the play."],
      ["Developed", "The metaphor suggests thoughts that sting and poison him, crawling restlessly so he cannot settle. The word “full” implies there is no room for peace. As he is planning Banquo's murder, it implies his guilt and paranoia are growing: Shakespeare shows that murder brings him no rest.", "Strongest: it zooms in on two words, explores associations, and links the implication to the plot and a theme."]
    ]}
];

/* Command words. Expectations vary between subjects and exam boards: always check the question and your teacher's guidance. */
const COMMANDS = [
  { w: "State", means: "Give a short, clear fact.", expects: "A brief answer. No explanation needed.", eg: ["State one function of the nucleus. [1]", "It contains genetic material that controls the cell."], mistake: "Writing a long answer, or giving two answers where one is wrong (that can cancel the mark).",
    check: { q: "“State the unit of power.” Which answer fits?", a: ["Watt", "Power is the rate of energy transfer, which is measured in watts because…"], c: 0, why: "‘State’ wants the fact only." } },
  { w: "Identify", means: "Pick out or name something, often from information you're given.", expects: "A name or a choice, not a description.", eg: ["Identify the independent variable in this investigation. [1]", "The temperature of the water."], mistake: "Describing the experiment instead of naming the variable.",
    check: { q: "“Identify the control variable.” Which answer fits?", a: ["The volume of acid", "We kept things the same so the test was fair"], c: 0, why: "Name the specific variable." } },
  { w: "Describe", means: "Say what something is like or what happens, in detail.", expects: "Accurate detail. Reasons are not needed. For graphs, use numbers.", eg: ["Describe the pattern shown in the graph. [2]", "The rate increases from 2 to 12 units between 10 °C and 40 °C, then falls to 1 unit at 60 °C."], mistake: "Explaining why (no marks), or describing a graph without quoting any data.",
    check: { q: "“Describe the trend in the graph.” Which answer is better?", a: ["It goes up because the enzyme works faster.", "It increases from 2 to 12 units between 10 °C and 40 °C."], c: 1, why: "Describe = what happens, with data. The reason belongs to an ‘explain’ question." } },
  { w: "Explain", means: "Give reasons: why or how something happens.", expects: "A linked chain of steps using ‘because’, ‘so’, ‘which means’.", eg: ["Explain why metals conduct electricity. [2]", "Metals contain delocalised electrons, which can move through the structure and carry charge."], mistake: "Stating the outcome without the mechanism, e.g. ‘because they are metals’.",
    check: { q: "“Explain why a vaccinated person doesn't get ill.” Which answer explains?", a: ["Because they had the vaccine.", "Memory cells make the right antibodies quickly, so the pathogen is destroyed before symptoms."], c: 1, why: "An explanation gives the mechanism, step by step." } },
  { w: "Compare", means: "Give similarities and/or differences between two things.", expects: "Every point mentions BOTH things, using words like ‘whereas’ or ‘both’.", eg: ["Compare ionic and covalent bonding. [2]", "In ionic bonding electrons are transferred, whereas in covalent bonding they are shared."], mistake: "Writing about each thing separately so the comparison is never made.",
    check: { q: "Which is a real comparison?", a: ["Wind is renewable. Gas releases carbon dioxide.", "Wind is renewable, whereas gas is non-renewable."], c: 1, why: "A comparison links both in the same point." } },
  { w: "Analyse", means: "Break something down to show how it works. In English, how language creates meaning and effects.", expects: "Zoom in on words or methods and explain their effect, not just name them.", eg: ["Analyse how the writer uses language to present Scrooge. [8]", "“Solitary as an oyster” suggests he is clamped shut… but oysters hide pearls, implying…"], mistake: "Feature-spotting: ‘this is a simile’ with no effect explained.",
    check: { q: "Which is analysis?", a: ["The writer uses a simile.", "The simile suggests he is shut off, but also implies hidden value."], c: 1, why: "Analysis explains the effect and meaning, not just the label." } },
  { w: "Evaluate", means: "Weigh up strengths and weaknesses, then make a judgement.", expects: "Both sides, with reasons, and a clear conclusion.", eg: ["Evaluate the use of wind turbines to generate electricity. [6]", "Advantages… disadvantages… Overall, wind is a good option alongside reliable sources because…"], mistake: "Listing pros and cons with no final judgement.",
    check: { q: "What must an ‘evaluate’ answer end with?", a: ["A summary of the facts", "A judgement with a reason"], c: 1, why: "Evaluate means you decide, and say why." } },
  { w: "Justify", means: "Support a choice or conclusion with evidence.", expects: "Your decision plus evidence, often data from the question.", eg: ["Which material is the best insulator? Justify your answer. [2]", "Material B, because its temperature fell by only 5 °C compared with 12 °C for A."], mistake: "Making the choice but giving no evidence.",
    check: { q: "“Which is best? Justify your answer.” Which earns the marks?", a: ["B is best.", "B is best because it lost the least heat: 5 °C compared with 12 °C."], c: 1, why: "Justify = choice + evidence." } },
  { w: "Discuss", means: "Explore a topic from different points of view.", expects: "Several sides or factors, developed, often leading to a view.", eg: ["Discuss the impact of the Treaty of Versailles on Germany.", "Explore territorial, military and economic effects, and how Germans reacted."], mistake: "Writing a one-sided answer.",
    check: { q: "A ‘discuss’ answer should…", a: ["Give one strong point", "Explore more than one side or factor"], c: 1, why: "Discussion means range." } },
  { w: "Calculate", means: "Work out a numerical answer.", expects: "Working shown, correct answer, and units where needed.", eg: ["Calculate the kinetic energy of a 2 kg ball moving at 3 m/s. [2]", "Ek = ½ × 2 × 3² = 9 J"], mistake: "Writing just the answer: if it's wrong, you lose the method marks too. Also missing units.",
    check: { q: "Why should you always show working?", a: ["It looks neater", "You can still earn method marks if the final answer is wrong"], c: 1, why: "Method marks are why working matters." } }
];

/* Mark allocations: how to judge depth. These are guides, not rigid rules. */
const MARKS = [
  ["1 mark", "Usually one precise fact, word, value or choice. Be short and exact."],
  ["2 marks", "Often a point plus a reason or detail, or two linked facts. In maths, often working plus answer."],
  ["3 marks", "Usually a short chain: a point, developed with how or why, and a consequence. In maths, several steps of working."],
  ["4 marks", "A fuller explanation with several linked steps, or two developed points. Check whether it asks for two things."],
  ["6 marks", "Often marked by level (quality), not by counting points. A clear, logical, well-organised answer using correct key words. Methods must be complete enough to follow."],
  ["Extended (8+ marks)", "Marked by level. Developed analysis or argument, supported with evidence, organised clearly. Quality beats quantity."]
];
const MARK_RULES = [
  "Answer the actual question: underline the command word and the topic before writing.",
  "Use the right key words: ‘antibodies’, not ‘fighters’; ‘delocalised electrons’, not ‘free stuff’.",
  "In maths and science calculations, show your working and give units.",
  "Develop explanations: link each step with ‘because’, ‘so’ or ‘which means’.",
  "Support arguments with evidence: a quote, a figure, or data from the question.",
  "Check every part is answered: questions with ‘and’ often want two things."
];
const MARK_CHECKS = [
  { q: "“Explain why sodium chloride has a high melting point. [3]” Which answer is likely to score more?", a: ["It has strong bonds.", "It is a giant lattice with strong electrostatic attraction between oppositely charged ions, so lots of energy is needed to overcome it."], c: 1, why: "Three marks need a developed chain: structure, force, energy." },
  { q: "A 6-mark method question is usually marked…", a: ["By counting six separate facts", "By the overall quality and completeness of the method"], c: 1, why: "Longer answers are often level-marked: can someone follow your method and get valid results?" },
  { q: "“Work out the original price. [3]” You got the final answer wrong. What could still earn marks?", a: ["Nothing", "Correct working shown"], c: 1, why: "Method marks reward correct steps." }
];

/* Exam-style practice questions with marking guidance (self-marked) */
const EXAMQ = [
  // Biology
  { id: "vac-state", mod: "bio", subj: "bio", topic: "How vaccines give immunity", cmd: "State", marks: 1,
    q: "State what a vaccine contains.",
    guide: ["Dead or inactive (weakened) pathogens, or parts of them (antigens)"],
    model: "Dead or inactive forms of a pathogen.",
    mistakes: ["Saying it contains antibodies or antibiotics."] },
  { id: "vac-explain", basic: "The vaccine stops you from getting the disease.", feedback: "This states the outcome but not how it happens. An ‘explain’ question needs the steps: antigens → white blood cells → specific antibodies → memory cells → faster response.", mod: "bio", subj: "bio", topic: "How vaccines give immunity", cmd: "Explain", marks: 4,
    q: "Explain how vaccination can protect someone against future infection by a pathogen.",
    guide: ["The vaccine contains dead or inactive pathogens (antigens)", "White blood cells (lymphocytes) are stimulated", "They produce specific antibodies", "Memory cells remain in the blood", "If infected later, antibodies are produced rapidly and in large numbers", "The pathogen is destroyed before the person becomes ill"],
    model: "The vaccine contains a dead or inactive form of the pathogen. Its antigens stimulate white blood cells to produce specific antibodies, and memory cells are made. If the real pathogen enters the body later, the memory cells make the right antibodies much more quickly and in greater numbers, so the pathogen is destroyed before it can make the person ill.",
    mistakes: ["Stopping at ‘it stops you getting ill’: that's the outcome, not the explanation.", "Saying the vaccine contains antibodies.", "Missing the words ‘specific’, ‘memory cells’ or ‘rapidly’."],
    note: "Compare this with the ‘State’ question: one wants a fact, this one wants the whole chain." },
  { id: "tmv", basic: "The virus makes the leaves go patchy so the plant doesn't grow as well.", feedback: "Describes the symptom but never links it to photosynthesis or glucose. Each step needs a ‘so’.", mod: "bio", subj: "bio", topic: "Disease and plant growth (TMV, rose black spot)", cmd: "Explain", marks: 4,
    q: "Tobacco mosaic virus (TMV) causes a mosaic pattern of discoloured patches on leaves. Explain why plants infected with TMV grow less than healthy plants.",
    guide: ["Discoloured parts of the leaf have less chlorophyll", "So less light is absorbed", "So the rate of photosynthesis is lower", "So less glucose is made", "Glucose is needed for respiration (energy) and to make new cells / proteins / cellulose for growth"],
    model: "The discoloured areas contain less chlorophyll, so less light is absorbed for photosynthesis. With a lower rate of photosynthesis, the plant makes less glucose. Glucose is needed for respiration to release energy and to make substances such as cellulose and proteins for new cells, so the plant grows less.",
    mistakes: ["Saying the virus ‘eats’ the plant.", "Saying there is ‘no’ photosynthesis: it is reduced.", "Not linking glucose to growth."] },
  { id: "blackspot", mod: "bio", subj: "bio", topic: "Disease and plant growth (TMV, rose black spot)", cmd: "Explain", marks: 3,
    q: "Rose black spot is a fungal disease that causes leaves to turn yellow and drop early. Explain how this affects the growth of the plant.",
    guide: ["Fewer leaves / less leaf area", "Less photosynthesis", "Less glucose for growth (respiration or building new cells)"],
    model: "Infected leaves fall off early, so the plant has less leaf area. This means less photosynthesis takes place, so less glucose is produced for respiration and for making new cells, and the plant grows less.",
    mistakes: ["Only describing the symptoms (spots, yellow leaves) without explaining the effect on growth."] },
  // Chemistry
  { id: "nacl-mp", basic: "Because it has strong bonds.", feedback: "Too vague: which bonds, between what? Name the structure and the force, then say why that needs a lot of energy.", mod: "chem", subj: "chem", topic: "Ionic and covalent bonding", cmd: "Explain", marks: 3,
    q: "Explain why sodium chloride has a high melting point.",
    guide: ["Giant ionic lattice", "Strong electrostatic forces of attraction between oppositely charged ions", "Lots of energy needed to overcome these forces"],
    model: "Sodium chloride has a giant ionic lattice. There are strong electrostatic forces of attraction between the oppositely charged ions, acting in all directions, so a lot of energy is needed to overcome them.",
    mistakes: ["Calling it ‘molecules’.", "Saying ‘strong bonds’ without saying what attracts what.", "Mixing up ionic and covalent."] },
  { id: "ch4-bp", mod: "chem", subj: "chem", topic: "Ionic and covalent bonding", cmd: "Explain", marks: 2,
    q: "Methane (CH₄) is a simple covalent molecule. Explain why methane has a low boiling point.",
    guide: ["Weak intermolecular forces between molecules", "Only a small amount of energy needed to overcome them (the covalent bonds do not break)"],
    model: "There are only weak intermolecular forces between methane molecules, so little energy is needed to overcome them. The strong covalent bonds inside the molecules don't break when it boils.",
    mistakes: ["Saying the covalent bonds break when it boils. This is the most common mistake on this topic."] },
  { id: "bond-compare", mod: "chem", subj: "chem", topic: "Ionic and covalent bonding", cmd: "Compare", marks: 2,
    q: "Compare how electrons are involved in ionic bonding and covalent bonding.",
    guide: ["Ionic: electrons are transferred (from metal to non-metal), forming ions", "Covalent: pairs of electrons are shared (between non-metals)"],
    model: "In ionic bonding, electrons are transferred from a metal atom to a non-metal atom to form ions, whereas in covalent bonding non-metal atoms share pairs of electrons.",
    mistakes: ["Describing each separately without comparing.", "Saying ionic bonds ‘share’ electrons."] },
  { id: "metal-cond", mod: "chem", subj: "chem", topic: "Metal structure and properties", cmd: "Explain", marks: 2,
    q: "Explain why copper is a good conductor of electricity.",
    guide: ["Copper has delocalised electrons", "These can move through the structure, carrying charge"],
    model: "Copper contains delocalised electrons, which are free to move through the metal structure and carry electrical charge.",
    mistakes: ["Saying ions move (that's for molten or dissolved ionic compounds)."] },
  { id: "alloy", mod: "chem", subj: "chem", topic: "Metal structure and properties", cmd: "Explain", marks: 3,
    q: "Explain why alloys are harder than pure metals.",
    guide: ["Pure metals have layers of atoms that can slide over each other", "Alloys contain atoms of different sizes", "These distort the layers, so they can't slide as easily"],
    model: "In a pure metal the atoms are arranged in layers that can slide over each other. An alloy contains atoms of different sizes, which distort the layers, making it harder for them to slide, so the alloy is harder.",
    mistakes: ["Saying alloys are ‘stronger because they're mixed’ without explaining the layers."] },
  // Working scientifically
  { id: "osmosis-method", basic: "Put potato in sugar water and see what happens to it.", feedback: "Nobody could repeat this. It doesn't say what is measured, with what, for how long, or what is kept the same.", mod: "sci", subj: "sci", topic: "Writing methods for required practicals", cmd: "Describe", marks: 6,
    q: "Describe a method to investigate the effect of sugar concentration on the mass of potato pieces.",
    guide: ["Cut potato into equal-sized pieces (e.g. cork borer and knife)", "Measure the starting mass of each piece using a balance", "Place pieces in different sugar concentrations (and water), same volume each", "Leave for the same time at the same temperature", "Remove, blot dry, and measure the final mass", "Calculate the percentage change in mass (and repeat for reliability)"],
    model: "1. Use a cork borer and knife to cut potato cylinders of the same size. 2. Blot them dry and measure the mass of each with a balance. 3. Put one piece into each of several boiling tubes containing the same volume of sugar solution at different concentrations (including distilled water). 4. Leave them for the same time (e.g. 24 hours) at the same temperature. 5. Remove each piece, blot dry, and measure the final mass. 6. Calculate the percentage change in mass and repeat for each concentration.",
    note: "6-mark answers are usually marked on overall quality: could someone follow your method and get valid results? Use the ticks as a guide.",
    mistakes: ["Not saying what is measured (mass) or with what (balance).", "Forgetting to keep the piece size and time the same.", "Not blotting dry before weighing."] },
  { id: "variables", mod: "sci", subj: "sci", topic: "Writing methods for required practicals", cmd: "Identify", marks: 3,
    q: "A student investigates how the temperature of water affects how quickly sugar dissolves. They use the same mass of sugar each time and stir at the same rate. Identify the independent, dependent and one control variable.",
    guide: ["Independent: temperature of the water", "Dependent: time taken for the sugar to dissolve", "Control: mass of sugar (or stirring rate, volume of water)"],
    model: "Independent: temperature of the water. Dependent: time for the sugar to dissolve. Control: the mass of sugar used.",
    mistakes: ["Swapping independent and dependent.", "Writing ‘time’ without saying time for what."] },
  { id: "wind-compare", basic: "Wind is good because it's green, but it's bad because it's not always windy.", feedback: "‘Green’ isn't a scientific reason, and there's no comparison with gas. Use ‘whereas’ to link both.", mod: "sci", subj: "sci", topic: "Comparing advantages and disadvantages", cmd: "Compare", marks: 4,
    q: "Give two advantages and two disadvantages of generating electricity using wind turbines compared with a gas-fired power station.",
    guide: ["Advantage: renewable, won't run out (gas is non-renewable)", "Advantage: no carbon dioxide released while generating (gas releases CO₂, linked to global warming)", "Disadvantage: unreliable, depends on the wind (gas can be turned on when needed)", "Disadvantage: noise or visual pollution / needs a lot of land or many turbines"],
    model: "Wind turbines are renewable, whereas gas will run out, and they release no carbon dioxide while generating, whereas burning gas does. However, wind is unreliable because it depends on the weather, whereas a gas power station can be switched on when demand is high. Turbines can also cause noise and visual pollution.",
    mistakes: ["Saying ‘it's green’ or ‘eco-friendly’ instead of the scientific reason.", "Not comparing with gas at all."] },
  { id: "graph-read", mod: "sci", subj: "sci", topic: "Reading data from graphs", cmd: "Read", marks: 1, num: { ans: 9, tol: 0.5, unit: "arbitrary units" }, graph: "enzyme",
    q: "Use the graph. What is the rate of reaction at 30 °C?",
    guide: ["9 (arbitrary units), read accurately from the line"],
    model: "9 arbitrary units.",
    mistakes: ["Not checking the scale on the axis.", "Reading from the wrong axis."] },
  { id: "graph-describe", mod: "sci", subj: "sci", topic: "Reading data from graphs", cmd: "Describe", marks: 3, graph: "enzyme",
    q: "Describe the pattern shown in the graph.",
    guide: ["Rate increases as temperature increases from 10 °C to about 40 °C", "Highest rate (optimum) at about 40 °C, about 12 units", "Rate then decreases quickly, to about 1 unit at 60 °C (data quoted)"],
    model: "The rate increases from 2 units at 10 °C to a maximum of 12 units at about 40 °C. Above 40 °C the rate falls quickly, to about 1 unit at 60 °C.",
    mistakes: ["Explaining (enzymes denature) when the question only says describe.", "No numbers from the graph."] },
  { id: "graph-explain", mod: "sci", subj: "sci", topic: "Reading data from graphs", cmd: "Explain", marks: 2, graph: "enzyme",
    q: "Explain why the rate of reaction decreases above 40 °C.",
    guide: ["The enzyme is denatured at high temperature", "The active site changes shape, so the substrate no longer fits"],
    model: "Above 40 °C the enzyme starts to denature: the shape of its active site changes, so the substrate no longer fits and fewer reactions happen.",
    mistakes: ["Saying the enzyme is ‘killed’ (enzymes aren't alive).", "Not mentioning the active site."] },
  // English (self-assessed with the analysis checklist)
  { id: "eng-acc", mod: "eng", subj: "eng", topic: "Explaining what a quote suggests and implies", cmd: "Analyse", marks: 4,
    q: "Write a paragraph analysing how Dickens presents Scrooge in the phrase “Hard and sharp as flint”.",
    guide: ["Explains the literal comparison", "Explores associations of flint (cold, hard, cuts, makes sparks)", "Explains what this suggests about Scrooge", "Develops an implication (warmth could be ‘struck out’; possibility of change)"],
    model: "Dickens compares Scrooge to flint, a stone that is cold, hard and sharp enough to cut, suggesting he is unfeeling and wounds people with his harshness. However, flint is also used to strike sparks and light fires. The phrase continues ‘from which no steel had ever struck out generous fire’, implying warmth is possible but no one has yet drawn it out. This hints at Scrooge's later transformation.",
    note: "There's no single right answer. Your interpretation must come from the words and the text.",
    mistakes: ["Naming ‘simile’ and stopping.", "Using ‘this suggests’ but then repeating the literal meaning."] },
  // History
  { id: "hist-hyper", basic: "Because the government printed too much money.", feedback: "True, but it's only the last link. Explain why they printed money: reparations → Ruhr → strike → printing.", mod: "hist", subj: "hist", topic: "Hyperinflation and the Ruhr", cmd: "Explain", marks: 4,
    q: "Explain why there was hyperinflation in Germany in 1923.",
    guide: ["Germany missed reparations payments", "France and Belgium occupied the Ruhr (January 1923)", "Workers went on strike (passive resistance), and the government kept paying them", "The government printed money, so prices rose rapidly as money lost its value"],
    model: "When Germany failed to pay reparations, France and Belgium occupied the Ruhr in January 1923. German workers went on strike in passive resistance, and the government continued to pay them, while losing goods and taxes from the Ruhr. To cover this, the government printed more money, so its value collapsed and prices rose rapidly: hyperinflation.",
    mistakes: ["Answering only ‘they printed money’ without explaining why."] },
  // Maths
  { id: "maths-reverse", basic: "68 × 1.15 = £78.20", feedback: "Wrong method: 15% of the SALE price isn't the same as 15% of the original. £68 is 85% of the original.", mod: "maths", subj: "maths", topic: "Percentages and reverse percentages", cmd: "Calculate", marks: 3, num: { ans: 80, tol: 0.01, unit: "£" },
    q: "A coat costs £68 after a 15% reduction. Work out the original price. Show your working.",
    guide: ["Recognises £68 is 85% of the original (100% − 15%)", "Divides: 68 ÷ 0.85", "Answer: £80"],
    model: "100% − 15% = 85%, so 0.85 × original = 68. Original = 68 ÷ 0.85 = £80.",
    mistakes: ["Adding 15% to £68 (gives £78.20). That finds 115% of the sale price, not the original."] }
];

/* Exam coach modules */
const MODULES = [
  { id: "eng", subj: "eng", title: "Analysing quotations", sub: "Move from ‘what it says’ to ‘what it suggests and implies’", focus: true },
  { id: "bio", subj: "bio", title: "Vaccines and disease", sub: "Explain, don't just state" },
  { id: "chem", subj: "chem", title: "Bonding and metals", sub: "Ionic, covalent, metallic: properties explained" },
  { id: "sci", subj: "sci", title: "Methods, comparing and graphs", sub: "Working scientifically" },
  { id: "cmd", subj: "lang", title: "Command words", sub: "What the question is really asking" },
  { id: "marks", subj: "maths", title: "Marks and depth", sub: "How much to write for 1 to 6+ marks" },
  { id: "hist", subj: "hist", title: "History: explain questions", sub: "Build a causal chain" },
  { id: "maths", subj: "maths", title: "Maths: show your working", sub: "Earn method marks" }
];

const MODULE_TEXT = {
  bio: { explain: "A vaccine contains dead or inactive pathogens. Their antigens trigger white blood cells to make specific antibodies, and memory cells stay behind. If the real pathogen arrives, antibodies are made fast and in large numbers, so you don't get ill. Diseases reduce growth when they damage leaves: less chlorophyll or leaf area → less photosynthesis → less glucose → less material and energy for new cells.",
    checks: [
      { t: "How vaccines give immunity", q: "What do white blood cells make in response to antigens?", a: ["Antibiotics", "Antibodies", "Antigens", "Vaccines"], c: 1, why: "Antibodies lock on to a specific antigen." },
      { t: "How vaccines give immunity", q: "Why is the response faster the second time?", a: ["The pathogen is weaker", "Memory cells recognise the antigen", "Antibiotics are already in the blood", "The vaccine is still active"], c: 1, why: "Memory cells trigger a rapid, large antibody response." },
      { t: "Disease and plant growth (TMV, rose black spot)", q: "TMV reduces growth mainly because…", a: ["It blocks the roots", "Less chlorophyll means less photosynthesis", "It uses up the plant's water", "It makes the plant too hot"], c: 1, why: "Less photosynthesis → less glucose for growth." }
    ]},
  chem: { explain: "Ionic bonding: a metal transfers electrons to a non-metal, making oppositely charged ions held by strong electrostatic attraction in a giant lattice. Covalent bonding: non-metals share pairs of electrons. Simple molecules have weak forces BETWEEN molecules (low melting points); giant covalent structures have many strong bonds (high melting points). Metals: positive ions in a sea of delocalised electrons. The electrons move (conduction); the bonds are strong (high melting points); layers slide (malleable); alloys distort the layers (harder).",
    checks: [
      { t: "Ionic and covalent bonding", q: "When water boils, what is overcome?", a: ["Covalent bonds", "Weak forces between molecules", "Ionic bonds", "Metallic bonds"], c: 1, why: "The covalent bonds inside each molecule stay intact." },
      { t: "Metal structure and properties", q: "Why are pure metals malleable?", a: ["Delocalised electrons", "Layers of ions slide over each other", "Weak bonds", "They're molecules"], c: 1, why: "Alloys stop this sliding, so they're harder." },
      { t: "Ionic and covalent bonding", q: "Why does molten sodium chloride conduct?", a: ["Delocalised electrons", "Ions are free to move", "Molecules move", "It contains metal"], c: 1, why: "In a solid the ions are fixed; melted or dissolved, they can move." }
    ]},
  sci: { explain: "A method someone could follow: equipment, numbered steps, WHAT you measure and WITH WHAT, what you keep the same, and repeats. Variables: independent (you change), dependent (you measure), control (kept the same). When comparing, every point mentions both things. With graphs: check the axes and scale, read carefully with a ruler, and always quote numbers with units.",
    graphNote: "The graph below uses example data for practice." ,
    checks: [
      { t: "Writing methods for required practicals", q: "Which piece of equipment measures mass?", a: ["Measuring cylinder", "Balance", "Thermometer", "Stopwatch"], c: 1, why: "Measuring cylinder = volume; thermometer = temperature; stopwatch = time." },
      { t: "Writing methods for required practicals", q: "The dependent variable is the one you…", a: ["Change", "Measure", "Keep the same", "Ignore"], c: 1, why: "It depends on the independent variable." },
      { t: "Reading data from graphs", q: "One small square on an axis covers 5 units over 10 squares. What is one square worth?", a: ["5", "0.5", "2", "50"], c: 1, why: "5 ÷ 10 = 0.5 units per square. Always check the scale first." }
    ]},
  hist: { explain: "‘Explain why’ questions in History want causes linked into a chain: this happened, which led to that, which caused this. Use specific dates, names and facts as evidence.", checks: [] },
  maths: { explain: "Many maths marks are for method. Write each step clearly, even when you use a calculator. If your final answer is wrong, correct working can still earn marks. Check the answer makes sense (is the original price bigger than the sale price?).", checks: [] }
};

/* Example graph data (practice only) */
const GRAPHS = {
  enzyme: { title: "Rate of an enzyme reaction at different temperatures (example data)", x: "Temperature in °C", y: "Rate of reaction (arbitrary units)",
    pts: [[10, 2], [20, 5], [30, 9], [40, 12], [50, 6], [60, 1]], xmax: 60, ymax: 14, xstep: 10, ystep: 2 }
};

/* ===== Stage 2: reasoning across subjects ===== */
REASONS.apply = "Couldn't apply it to this question";

/* Five kinds of error, so patterns show up across subjects */
const ERROR_TYPES = {
  knowledge: { name: "Knowledge", desc: "didn't know or remember it", reasons: ["knowledge"] },
  understanding: { name: "Understanding", desc: "remembered it but couldn't explain it", reasons: ["explain"] },
  application: { name: "Application", desc: "knew it but couldn't use it in this question", reasons: ["apply"] },
  analysis: { name: "Analysis", desc: "found the evidence but didn't explain its significance", reasons: ["analysis", "evidence"] },
  technique: { name: "Exam technique", desc: "knew it but didn't show it in the answer", reasons: ["command", "misread", "terms", "calc", "working"] }
};
/* A small, practical suggestion for each kind of error */
const ERROR_ADVICE = {
  knowledge: "Short, regular flashcard sessions for these topics.",
  understanding: "Practise ‘explain’ questions: link each step with ‘so’ or ‘because’.",
  application: "Try questions that use the same idea in a new context.",
  analysis: "Practise saying why a piece of evidence matters, not just what it says.",
  technique: "Read the question twice and check the command word and marks before writing."
};

/* What kind of answer a question wants */
const QTYPES = {
  recall: ["Recall a fact", "Short and precise. No explanation needed."],
  interpret: ["Read or interpret evidence", "Use what's in front of you: a graph, table, source or quote. Separate what it shows from what you can infer."],
  describe: ["Describe", "Say what happens or what it is like, with detail or data. No reasons needed."],
  explain: ["Explain how or why", "Give reasons as a linked chain: this happens, so that happens, because…"],
  compare: ["Compare", "Every point mentions both things, using ‘whereas’ or ‘both’."],
  analyse: ["Analyse", "Zoom in on methods or words and explain their effect and meaning."],
  evaluate: ["Judge or evaluate", "Weigh the evidence and reach a supported conclusion."],
  calculate: ["Calculate", "Choose the method, show each step, give units, check it makes sense."]
};
const TYPE_FROM_CMD = { State: "recall", Identify: "recall", Read: "interpret", Infer: "interpret", Describe: "describe", Explain: "explain", Compare: "compare", Analyse: "analyse", Evaluate: "evaluate", Justify: "evaluate", Calculate: "calculate" };

/* The five transferable exam skills */
const SKILL5 = {
  understand: "Understanding the question",
  explain: "Developing explanations",
  evidence: "Interpreting evidence",
  conclude: "Supporting conclusions",
  review: "Reviewing your own thinking"
};

/* Subject-specific feedback for a step that was missed */
const FIX = {
  eng: p => `Not there yet: ${p}. Think about what the word or image suggests, and why the writer chose it.`,
  bio: p => `Your chain is missing this step: ${p}. Show how it leads to the next step with ‘so’.`,
  chem: p => `Missing: ${p}. Name the particles and the force, then say what that means for energy.`,
  phys: p => `Missing: ${p}. Link the physics idea to the result it causes.`,
  sci: p => `Missing: ${p}. Someone following your answer would need this.`,
  hist: (p, q) => q && q.type === "interpret" ? `Not shown yet: ${p}. Link what you infer to a specific detail in the source.` : `You haven't shown: ${p}. Explain how this led to the outcome, not just that it happened.`,
  maths: p => `Show this step: ${p}. Method marks depend on the steps being visible.`,
  lang: p => `Missing: ${p}.`,
  fr: p => `Missing: ${p}.`
};

/* Example data tables for practice (not real experimental results) */
const TABLES = {
  insulation: { title: "Temperature drop of hot water in beakers wrapped in different materials, over 10 minutes (example data)",
    head: ["Material", "Start temperature (°C)", "End temperature (°C)", "Drop (°C)"],
    rows: [["A", "80", "62", "18"], ["B", "80", "71", "9"], ["C", "80", "68", "12"]] },
  pets: { title: "Number of pets owned by 20 students (example data)", head: ["Number of pets", "Frequency"], rows: [["0", "6"], ["1", "8"], ["2", "4"], ["3", "2"]] }
};

EXAMQ.push(
  // History: causation, consequence, significance, sources, change
  { id: "hist-versailles", mod: "hist", subj: "hist", topic: "Treaty of Versailles", cmd: "Explain", marks: 4,
    basic: "The Treaty of Versailles made Germans angry.",
    feedback: "True, but it doesn't say WHY they were angry or what that led to. Name the terms, then explain the consequence.",
    q: "Explain why the Treaty of Versailles caused resentment towards the Weimar Republic.",
    guide: ["Germany had to accept blame for the war (the war guilt clause, Article 231)", "Germany had to pay reparations (£6.6 billion), a huge economic burden", "Germany lost land and its army was limited to 100,000 men", "Weimar politicians signed it, so they were blamed: the ‘November Criminals’ / ‘stab in the back’ idea"],
    model: "The Treaty of Versailles created resentment because Germany was forced to accept responsibility for the war under Article 231 and pay £6.6 billion in reparations. Germans also saw losing territory and having the army cut to 100,000 men as humiliating. Because Weimar politicians had signed the treaty, many Germans blamed the new government, calling them the ‘November Criminals’, which weakened support for the Republic.",
    mistakes: ["Listing terms of the treaty without saying why they caused anger.", "Forgetting the link to the Weimar government, which the question asks about."] },
  { id: "hist-source", mod: "hist", subj: "hist", topic: "Hyperinflation and the Ruhr", cmd: "Infer", marks: 2,
    source: "Source A: a description of a photograph taken in Germany in 1923. It shows children playing with large bundles of banknotes, stacking them like building blocks.",
    q: "Give one thing you can infer from Source A about Germany in 1923, and the detail from the source that supports it.",
    guide: ["An inference: money had become almost worthless because of hyperinflation", "Supporting detail from the source: children using bundles of banknotes as toys"],
    model: "I can infer that German money had become almost worthless in 1923 because of hyperinflation. The source shows children stacking bundles of banknotes like building blocks, suggesting the notes had so little value they could be used as toys.",
    note: "‘Shows’ is what you can see in the source. ‘Infer’ is what you can work out from it. Strong answers do both and link them.",
    mistakes: ["Only describing the source (children playing with money) without making an inference.", "Making an inference with no detail from the source to support it."] },
  { id: "hist-snow", mod: "hist", subj: "hist", topic: "Snow and cholera", cmd: "Explain", marks: 4,
    q: "Explain why John Snow's work on cholera in 1854 was significant.",
    guide: ["He linked cholera deaths to one water pump on Broad Street, using a map of cases as evidence", "This challenged the miasma (bad air) theory", "It showed the importance of clean water, influencing later public health improvements", "But it wasn't fully accepted at first: no one could yet explain what in the water caused it (germ theory came in 1861)"],
    model: "Snow's work was significant because he mapped cholera deaths and showed they clustered around the Broad Street pump, linking the disease to contaminated water rather than bad air. This challenged miasma theory and showed why clean water mattered, which helped support later public health reforms. However, its impact was limited at first, because without germ theory he couldn't explain exactly what in the water caused cholera.",
    mistakes: ["Retelling the story of the pump without explaining why it mattered.", "Overclaiming: saying Snow immediately changed government policy."] },
  { id: "hist-change", mod: "hist", subj: "hist", topic: "Chadwick and public health", cmd: "Explain", marks: 4,
    q: "Explain why public health in Britain improved in the second half of the 1800s.",
    guide: ["Evidence of the problem: Chadwick's 1842 report linked poor living conditions to disease", "Science: Pasteur's germ theory (1861) showed what caused disease", "Events: the ‘Great Stink’ (1858) led to Bazalgette's new sewers in London", "Government: more working men could vote (1867), and the 1875 Public Health Act made councils act"],
    model: "Public health improved partly because Chadwick's 1842 report gave evidence that poor conditions caused disease. Pasteur's germ theory in 1861 then explained how disease spread. The ‘Great Stink’ of 1858 pushed Parliament to fund Bazalgette's sewers. After 1867 more working men could vote, so governments had more reason to act, and the 1875 Public Health Act made councils provide clean water and proper drainage.",
    mistakes: ["Describing what improved instead of explaining why.", "Giving one cause only."] },
  // Maths: method choice, worded problems, interpreting data, checking
  { id: "maths-pct", mod: "maths", subj: "maths", topic: "Percentages and reverse percentages", cmd: "Calculate", marks: 2, num: { ans: 36, tol: 0.01, unit: "£" },
    q: "Work out 15% of £240.", guide: ["10% = £24 and 5% = £12 (or 0.15 × 240)", "Answer: £36"], model: "0.15 × 240 = £36.", mistakes: ["Dividing by 15."] },
  { id: "maths-worded", mod: "maths", subj: "maths", topic: "Percentages and reverse percentages", cmd: "Calculate", marks: 3, num: { ans: 129.6, tol: 0.01, unit: "£" },
    q: "A phone costs £180. In a sale it is reduced by 20%. A week later, a further 10% is taken off the sale price. How much does it cost now?",
    guide: ["Uses a multiplier for 20% off: 180 × 0.8 = £144", "Then 10% off the new price: 144 × 0.9", "Answer: £129.60"],
    model: "180 × 0.8 = 144. 144 × 0.9 = 129.6, so £129.60.",
    mistakes: ["Taking 30% off the original price (£126). The second discount is taken off the sale price, not the original.", "Writing £129.6 instead of £129.60 for money."] },
  { id: "maths-ratio", mod: "maths", subj: "maths", topic: "Percentages and reverse percentages", cmd: "Calculate", marks: 2, num: { ans: 45, tol: 0.01, unit: "£" },
    q: "Share £72 in the ratio 5 : 3. How much is the larger share?", guide: ["Total parts 5 + 3 = 8, so one part = 72 ÷ 8 = £9", "Larger share = 5 × 9 = £45"], model: "8 parts, so 1 part = £9. 5 × 9 = £45.", mistakes: ["Dividing 72 by 5."] },
  { id: "maths-mean", mod: "maths", subj: "maths", topic: "Averages from a frequency table", cmd: "Calculate", marks: 3, num: { ans: 1.1, tol: 0.001, unit: "pets" }, table: "pets",
    q: "Use the table. Work out the mean number of pets per student.",
    guide: ["Multiplies each number of pets by its frequency (0, 8, 8, 6)", "Total pets = 22", "Divides by 20 students: 1.1"],
    model: "(0×6) + (1×8) + (2×4) + (3×2) = 22. 22 ÷ 20 = 1.1 pets.",
    mistakes: ["Dividing by 4 (the number of rows) instead of 20 (the number of students).", "Adding the frequencies instead of multiplying."] },
  // Physics: calculations, explanations, evaluating evidence
  { id: "phys-ke", mod: "phys", subj: "phys", topic: "Energy stores and equations", cmd: "Calculate", marks: 2, num: { ans: 135000, tol: 1, unit: "J" },
    q: "Calculate the kinetic energy of a 1200 kg car travelling at 15 m/s.", guide: ["Ek = ½ × 1200 × 15²", "= 135 000 J"], model: "Ek = ½ × m × v² = 0.5 × 1200 × 225 = 135 000 J.", mistakes: ["Forgetting to square the speed.", "Missing units."] },
  { id: "phys-vir", mod: "phys", subj: "phys", topic: "Circuits and V = IR", cmd: "Calculate", marks: 2, num: { ans: 12, tol: 0.01, unit: "V" },
    q: "A current of 0.5 A flows through a 24 Ω resistor. Calculate the potential difference across it.", guide: ["V = I × R = 0.5 × 24", "= 12 V"], model: "V = 0.5 × 24 = 12 V.", mistakes: ["Dividing instead of multiplying."] },
  { id: "phys-loft", mod: "phys", subj: "phys", topic: "Energy stores and equations", cmd: "Explain", marks: 3,
    basic: "Insulation keeps the heat in.", feedback: "Too vague for 3 marks. Say what property insulation has, which energy transfer it reduces, and the effect on the bill.",
    q: "Explain why adding thicker loft insulation can reduce a home's heating bills.",
    guide: ["Insulation has a low thermal conductivity", "It reduces the rate of energy transfer (by conduction) through the roof to the surroundings", "So less energy needs to be supplied by the heating to keep the house warm"],
    model: "Loft insulation has a low thermal conductivity, so it reduces the rate at which energy is transferred through the roof to the surroundings. The house stays warm for longer, so less energy has to be supplied by the heating system, which lowers the bills.",
    mistakes: ["Saying insulation ‘stops cold getting in’.", "Not linking the reduced energy transfer to the cost."] },
  { id: "phys-evidence", mod: "phys", subj: "phys", topic: "Energy stores and equations", cmd: "Justify", marks: 3, table: "insulation",
    q: "A student concludes that material B is the best insulator. Is this conclusion supported by the data? Justify your answer.",
    guide: ["Yes: B had the smallest temperature drop", "Quotes data: 9 °C for B, compared with 12 °C for C and 18 °C for A", "Limitation: only one set of results, so repeats are needed to be confident (or check all beakers had the same volume and thickness of material)"],
    model: "Yes, the data supports it. Beaker B's temperature dropped by only 9 °C, compared with 12 °C for C and 18 °C for A, so the least energy was transferred to the surroundings. However, there's only one set of results, so the student should repeat the test to be more confident.",
    mistakes: ["Saying ‘yes’ with no numbers.", "Not mentioning any limitation of the evidence."] }
);
MODULES.splice(MODULES.findIndex(m => m.id === "hist"), 0, { id: "phys", subj: "phys", title: "Physics: calculations and evidence", sub: "Equations, explanations and judging data" });
MODULES.find(m => m.id === "hist").sub = "Causes, consequences, significance and sources";
MODULES.find(m => m.id === "hist").title = "History: causes, sources and significance";
MODULES.find(m => m.id === "maths").title = "Maths: methods and problems";
MODULES.find(m => m.id === "maths").sub = "Choose the method, show working, check it makes sense";

MODULE_TEXT.hist = { explain: "History questions reward reasoning, not just facts. Causation: explain HOW a cause led to the event. Consequence: what changed as a result, and for whom. Significance: why it mattered then and later. Sources: separate what a source SHOWS from what you can INFER, and support every inference with a detail. Use specific dates, names and figures as evidence.",
  checks: [
    { t: "Treaty of Versailles", q: "Which answer explains a cause rather than just stating it?", a: ["The Treaty of Versailles made Germans angry.", "The war guilt clause humiliated Germans, so many blamed the Weimar politicians who signed it."], c: 1, why: "The second shows how the cause led to the result." },
    { t: "Hyperinflation and the Ruhr", q: "A source shows people pushing wheelbarrows of banknotes in 1923. Which is an inference?", a: ["People are pushing wheelbarrows.", "Money had lost so much value that huge amounts were needed to buy things."], c: 1, why: "An inference goes beyond what you can see." },
    { t: "Snow and cholera", q: "Why do historians call an event ‘significant’?", a: ["Because it is old", "Because it had important effects at the time or later"], c: 1, why: "Significance is about impact and consequences." }
  ]};
MODULE_TEXT.maths = { explain: "Most marks in maths are for method. 1. Read the question and pick out the numbers that matter. 2. Choose the method (multiplier, ratio parts, reverse percentage…). 3. Write each step, even with a calculator. 4. Check the answer makes sense: an original price should be bigger than a sale price; a mean should sit within the data.",
  checks: [
    { t: "Percentages and reverse percentages", q: "A price goes up by 20% to £96. Which method finds the original price?", a: ["96 × 0.8", "96 ÷ 1.2", "96 − 20", "96 × 1.2"], c: 1, why: "After a 20% increase the price is 120% of the original, so divide by 1.2. Answer: £80." },
    { t: "Percentages and reverse percentages", q: "Someone works out an original price as £57.80 for a coat now on sale at £68. How do you know it's wrong?", a: ["It has pence in it", "The original price must be more than the sale price"], c: 1, why: "Always sense-check: a reduction makes things cheaper." },
    { t: "Index laws", q: "Which is the quickest correct method for 15% of £60?", a: ["10% = 6, 5% = 3, total £9", "60 ÷ 15 = 4"], c: 0, why: "Build up from 10% and 5%, or use 0.15 × 60." }
  ]};
MODULE_TEXT.phys = { explain: "Physics questions often combine a calculation with an explanation or a judgement about data. For calculations: write the equation, substitute, give units. For explanations: name the property, the energy transfer, and the effect. For evidence: quote the numbers, say whether they support the conclusion, and name a limitation.",
  checks: [
    { t: "Energy stores and equations", q: "In Ek = ½mv², what happens to kinetic energy if speed doubles?", a: ["It doubles", "It quadruples", "It halves", "It stays the same"], c: 1, why: "Speed is squared: 2² = 4." },
    { t: "Circuits and V = IR", q: "Which rearrangement gives resistance?", a: ["R = V × I", "R = V ÷ I", "R = I ÷ V"], c: 1, why: "From V = IR, divide both sides by I." },
    { t: "Energy stores and equations", q: "A conclusion is based on one set of results. What's the main weakness?", a: ["It can't be trusted to be repeatable", "It is definitely wrong"], c: 0, why: "Repeats show whether results are reliable." }
  ]};

/* Fill in the question type and skills for every question */
EXAMQ.forEach(q => {
  q.type = q.type || TYPE_FROM_CMD[q.cmd] || "explain";
  if (q.mod === "eng" && q.cmd === "Analyse") q.type = "analyse";
  q.sk = { recall: [], interpret: ["evidence"], describe: ["evidence"], explain: ["explain"], compare: ["conclude"], analyse: ["evidence", "explain"], evaluate: ["evidence", "conclude"], calculate: [] }[q.type] || [];
});
/* Science areas flagged in school feedback */
["bio", "chem", "sci"].forEach(id => { const m = MODULES.find(x => x.id === id); if (m) m.focus = true; });
