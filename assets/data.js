/* Harriet's Mock Countdown: plan data.
   To change the plan, edit the DAYS list below. Each block is:
   [subject, title, what to do, what to use, links, blockCount(optional)] */

const SUBJECTS = {
  maths: { name: "Maths", colour: "--maths" },
  bio:   { name: "Biology", colour: "--bio" },
  chem:  { name: "Chemistry", colour: "--chem" },
  phys:  { name: "Physics", colour: "--phys" },
  eng:   { name: "English Literature", colour: "--eng" },
  lang:  { name: "English Language", colour: "--lang" },
  hist:  { name: "History", colour: "--hist" },
  fr:    { name: "French", colour: "--fr" }
};

const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

const L = {
  sparx:    ["Sparx Science", "https://sparxscience.com/"],
  aqaSci:   ["AQA Combined Science past papers", "https://www.aqa.org.uk/subjects/science/gcse/science-8464/assessment-resources"],
  seneca:   ["Seneca: free AQA French revision", "https://senecalearning.com/en-GB/blog/free-aqa-french-gcse-revision/"],
  frIdentity: ["BBC Bitesize: Identity and relationships", "https://www.bbc.co.uk/bitesize/topics/z667ywx"],
  frPresent:  ["BBC Bitesize: Present tense verbs", "https://www.bbc.co.uk/bitesize/topics/zdyxywx"],
  frCustoms:  ["BBC Bitesize: Customs and festivals", "https://www.bbc.co.uk/bitesize/topics/znn6g2p"],
  frPast:     ["BBC Bitesize: Past tense verbs", "https://www.bbc.co.uk/bitesize/topics/zwv6vj6"],
  macbeth:  ["BBC Bitesize: Macbeth", "https://www.bbc.com/bitesize/topics/zgq3dmn"],
  macbethBooklet: ["Macbeth revision booklet", "https://www.stokenewingtonschool.co.uk/asset/1911"],
  acc:      ["BBC Bitesize: A Christmas Carol", "https://www.bbc.com/bitesize/topics/zcs8qty"],
  accBooklet: ["A Christmas Carol revision booklet (PDF)", "https://www.iscaexeter.co.uk/assets/Documents/2017%20-%2018/English/A-CHRISTMAS-CAROL-REVISION-BOOKLET.pdf"],
  bb:       ["BBC Bitesize: Blood Brothers", "https://www.bbc.com/bitesize/topics/zxv7sg8"],
  bbNews:   ["Extension: BBC News article", "https://www.bbc.co.uk/news/uk-16361170"],
  pmtEng:   ["Physics & Maths Tutor: AQA English guides", "https://www.physicsandmathstutor.com/english-revision/gcse-aqa/"],
  smeLangP2: ["Save My Exams: Language Paper 2 past papers", "https://www.savemyexams.com/gcse/english-language/aqa/past-papers/paper-2"],
  aqaLangMS: ["AQA Paper 2 mark scheme (Nov 2022)", "https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/november/AQA-87002-MS-NOV22.PDF"],
  smeMedicine: ["Save My Exams: Medicine in Britain notes", "https://www.savemyexams.com/gcse/history/edexcel/18/topics/medicine-in-britain-c-1250-present"],
  t2uGermany: ["tutor2u: Weimar and Nazi Germany", "https://tutor2u.net/history/collections/edexcel-gcse-weimar-and-nazi-germany-1918-1939"],
  saltVideo: ["Video: making a salt (required practical)", "https://www.youtube.com/watch?v=9GH95172Js8"],
  tempVideo: ["Video: temperature changes (required practical)", "https://www.youtube.com/watch?v=tKxcQYZ2YH8"],
  drfrost:  ["Dr Frost Maths", "https://www.drfrost.org/"],
  mgHome:   ["Maths Genie", "https://www.mathsgenie.co.uk/"]
};

const DAYS = [
  { id: "tue20", date: "2026-10-20", name: "Tuesday 20 October", when: "Half term · 3 hours", blocks: [
    ["hist", "Medicine c1700 to c1900", "Jenner and the smallpox vaccine, Chadwick, the Public Health Acts, Pasteur and germ theory, Koch.",
     "Medicine knowledge organiser, flashcards, exercise book, revision guide, Teams.",
     [L.smeMedicine, ["Videos: Jenner, Pasteur and Koch", yt("Edexcel GCSE history medicine Jenner Pasteur Koch")]]],
    ["chem", "C1 Atoms, bonding and moles · C2 Periodic table", "Atomic structure, isotopes, electron shells, groups 0, 1 and 7. Not transition metals.",
     "Sparx Science: independent learning, AQA GCSE, Chemistry 4.1.",
     [L.sparx, ["Videos: atomic structure and the periodic table", yt("freesciencelessons atomic structure periodic table combined")]]],
    ["fr", "Identity and relationships · present tense", "Learn 15 key words on family and friends. Present tense of être, avoir, aller, faire and regular verbs.",
     "Exercise book and your French revision guide.",
     [L.frIdentity, L.frPresent, L.seneca]]
  ]},
  { id: "wed21", date: "2026-10-21", name: "Wednesday 21 October", when: "Half term · 3 hours", blocks: [
    ["fr", "Customs and festivals · past tense", "Perfect tense with avoir and être. Write one 90 word answer about a festival you celebrated.",
     "Class writing questions and your French revision guide.",
     [L.frCustoms, L.frPast, L.seneca]],
    ["phys", "P1 to P3 Energy", "Energy stores and equations, efficiency, specific heat capacity practical, energy resources.",
     "Sparx Science and the Paper 1 knowledge summary from your teacher.",
     [L.sparx, L.aqaSci, ["Videos: energy topics", yt("cognito GCSE physics energy stores efficiency specific heat capacity")]]],
    ["eng", "A Christmas Carol characters", "One side of A4 each on Scrooge, Bob Cratchit, Fezziwig and the three Ghosts. Quotes with analysis.",
     "Annotated A Christmas Carol and York Notes.",
     [L.acc, L.accBooklet]]
  ]},
  { id: "thu22", date: "2026-10-22", name: "Thursday 22 October", when: "Maths at school 10:00 to 12:00, plus one block", blocks: [
    ["maths", "Maths session at school", "Counts as two blocks. Ask about nth term sequences, angles in polygons, quadratics, expanding brackets, factorising and solving linear equations.",
     "Try a few questions from these sheets first so you know what to ask.",
     [["Expanding brackets (Corbett)", "https://corbettmaths.com/wp-content/uploads/2013/02/expanding-brackets-pdf1.pdf"],
      ["Video: expanding brackets", "https://youtu.be/E88KDkXeJrA"],
      ["Factorisation (Corbett)", "https://corbettmaths.com/wp-content/uploads/2022/10/Factorisation.pdf"],
      ["Video: factorising", "https://youtu.be/IFsWbLvx6yI"],
      ["Solving equations worksheet", "https://www.mathsgenie.co.uk/resources/3-solving-equations-ws.pdf"],
      ["Video: solving equations", "https://youtu.be/vNDpWDlWaRI"],
      ["Quadratics by factorising worksheet", "https://www.mathsgenie.co.uk/resources/5-solving-quadratics-by-factorising-ws.pdf"],
      ["Video: solving quadratics", "https://youtu.be/m-qyV6C56ec"],
      ["Sequences worksheet", "https://www.mathsgenie.co.uk/resources/4-sequences-ws.pdf"],
      ["Video: nth term", "https://youtu.be/Tv9ObyQOGAc"],
      ["Angles in polygons worksheet", "https://www.mathsgenie.co.uk/resources/4-angles-in-polygons.pdf"],
      ["Video: angles in polygons", "https://youtu.be/byBQy5GhPwE"]], 2],
    ["bio", "4.3 Infection and response · 4.4 Bioenergetics", "Communicable disease, defences, vaccines, antibiotics, non-communicable disease, photosynthesis and respiration.",
     "Biology Paper 1 revision booklet days 22 to 40. Sparx Science 4.3 and 4.4.",
     [L.sparx, ["Videos: infection and bioenergetics", yt("freesciencelessons infection and response bioenergetics combined")]]]
  ]},
  { id: "fri23", date: "2026-10-23", name: "Friday 23 October", when: "Half term · 3 hours", blocks: [
    ["hist", "Germany 1918 to 1923", "Legacy of WW1, Weimar constitution, Treaty of Versailles, Spartacist revolt, Kapp Putsch, Ruhr and hyperinflation.",
     "Germany knowledge organiser, flashcards, exercise book, revision guide, Teams.",
     [L.t2uGermany, ["Videos: Weimar Germany 1918 to 1923", yt("Edexcel GCSE Weimar Germany 1918 1923 revision")]]],
    ["chem", "C3 to C5", "Structure and bonding (not nanoparticles). Calculations up to concentration. Chemical changes (not titration). Making salts practical.",
     "Sparx Science Chemistry 4.2, 4.3 and 4.4.",
     [L.sparx, L.saltVideo]],
    ["eng", "Blood Brothers characters", "One side of A4 each on Mickey, Edward, Mrs Johnstone, Mrs Lyons and the Narrator. Quotes with analysis.",
     "Annotated play and York Notes.",
     [L.bb, L.bbNews]]
  ]},
  { gap: "Saturday 24 and Sunday 25 · weekend off" },
  { id: "mon26", date: "2026-10-26", name: "Monday 26 October", when: "Half term · 3 hours", blocks: [
    ["phys", "P4 to P7", "Circuits and V = IR, series and parallel, electricity in the home, density and particles, radioactivity and half life.",
     "Sparx Science and the Paper 1 knowledge summary.",
     [L.sparx, L.aqaSci, ["Videos: electricity, particles, atoms", yt("cognito GCSE physics electricity density radioactivity half life")]]],
    ["hist", "Medicine c1850 to now", "Snow and cholera, surgery, magic bullets, penicillin, the NHS, modern diagnosis and lifestyle factors.",
     "Medicine knowledge organiser, flashcards, exercise book, revision guide, Teams.",
     [L.smeMedicine, ["Videos: Snow, penicillin and the NHS", yt("Edexcel GCSE medicine John Snow penicillin NHS revision")]]],
    ["fr", "Speaking practice", "Answer five conversation questions aloud using sentence builders. Record yourself and play it back.",
     "Speaking preparation booklet of sentence builders. Practice questions from class.",
     [L.seneca, L.frIdentity]]
  ]},
  { id: "tue27", date: "2026-10-27", name: "Tuesday 27 October", when: "Half term · 3 hours", blocks: [
    ["chem", "C6 Electrolysis · C7 Energy changes", "Electrolysis and its practical. Exothermic and endothermic reactions. Not cells, batteries or fuel cells.",
     "Sparx Science Chemistry 4.4 and 4.5.",
     [L.sparx, L.tempVideo, ["Videos: electrolysis", yt("freesciencelessons electrolysis combined science")]]],
    ["maths", "Percentages, standard form, indices", "Percentage of an amount, reverse percentages, compound interest, standard form, index laws.",
     "Maths Genie worksheets, with the videos if you get stuck.",
     [["Percentages worksheet", "https://www.mathsgenie.co.uk/resources/3-percentages-ws.pdf"],
      ["Video: percentages", "https://youtu.be/d4Lrj3IS1NA"],
      ["Reverse percentages worksheet", "https://www.mathsgenie.co.uk/resources/5-reverse-percentages-ws.pdf"],
      ["Video: reverse percentages", "https://youtu.be/6_zZcLsmVJ4"],
      ["Compound interest worksheet", "https://www.mathsgenie.co.uk/resources/4-compound-interest-ws.pdf"],
      ["Video: compound interest", "https://youtu.be/1C0WUwl2LsU"],
      ["Standard form worksheet", "https://www.mathsgenie.co.uk/resources/5-standard-form-ws.pdf"],
      ["Video: standard form", "https://youtu.be/VWhtJRV29R4"],
      ["Indices worksheet", "https://www.mathsgenie.co.uk/resources/4-indices-ws.pdf"],
      ["Video: index laws", "https://youtu.be/D_Q2R-I0Q1Y"]]],
    ["lang", "Language Paper 2, Section A: reading", "Learn what Q1 to Q4 ask and how long each takes. Then answer Q2 (summary of differences) and Q3 (language) from one past paper.",
     "Your English book notes and the Pearson AQA English Language workbook.",
     [L.smeLangP2, L.pmtEng, L.aqaLangMS]]
  ]},
  { gap: "Wednesday 28 to Saturday 31 · away" },
  { id: "sun1", date: "2026-11-01", name: "Sunday 1 November", when: "Final session · 3 hours", blocks: [
    ["hist", "Germany 1923 to 1933", "Stresemann and the Golden Age, Munich Putsch, the Lean Years, the Depression and the rise of the Nazis.",
     "Germany knowledge organiser, flashcards, exercise book, revision guide, Teams.",
     [L.t2uGermany, ["Videos: Stresemann and the rise of the Nazis", yt("Edexcel GCSE Stresemann golden age rise of the Nazis revision")]]],
    ["bio", "4.1 Cell biology · 4.2 Organisation", "Cells, microscopy, diffusion, osmosis, active transport, enzymes, heart, lungs and heart disease.",
     "Biology Paper 1 revision booklet days 1 to 21. Sparx Science 4.1 and 4.2.",
     [L.sparx, ["Videos: cells and organisation", yt("freesciencelessons cell biology organisation combined")]]],
    ["lang", "Language Paper 2, Section B: viewpoint writing", "Plan for 5 minutes, then write a Q5 viewpoint answer in 40 minutes. Check spelling and punctuation at the end.",
     "Exercise book. Use a Q5 task from a past paper.",
     [L.smeLangP2, L.pmtEng]]
  ]}
];

/* Topics for the "Where I'm struggling" tracker */
const TOPICS = {
  maths: ["Expanding brackets", "Factorising", "Solving linear equations", "Solving quadratics", "nth term of sequences", "Angles in parallel lines", "Angles in polygons", "Percentages and reverse percentages", "Compound interest", "Standard form", "Index laws"],
  bio: ["Animal and plant cells", "Microscopy and magnification", "Diffusion, osmosis, active transport", "Enzymes and digestion", "Heart, blood and lungs", "Communicable disease", "Vaccines and antibiotics", "Photosynthesis", "Respiration"],
  chem: ["Atomic structure and isotopes", "Groups 0, 1 and 7", "Ionic and covalent bonding", "Moles and concentration", "Acids, alkalis and salts", "Making salts practical", "Electrolysis", "Exothermic and endothermic"],
  phys: ["Energy stores and equations", "Efficiency", "Specific heat capacity", "Energy resources", "Circuits and V = IR", "Mains electricity", "Density and particles", "Radioactivity and half life"],
  eng: ["Macbeth characters and quotes", "A Christmas Carol characters and quotes", "Blood Brothers characters and quotes", "Context and writer's purpose", "Essay structure"],
  lang: ["Paper 2 Q1 true statements", "Paper 2 Q2 summary", "Paper 2 Q3 language analysis", "Paper 2 Q4 comparing perspectives", "Paper 2 Q5 viewpoint writing", "Spelling and punctuation"],
  hist: ["Jenner and vaccination", "Chadwick and public health", "Pasteur and Koch", "Snow and cholera", "Penicillin and the NHS", "Treaty of Versailles", "Weimar constitution", "Hyperinflation and the Ruhr", "Stresemann's Golden Age", "Rise of the Nazis"],
  fr: ["Family and relationships vocab", "Festivals vocab", "Present tense", "Perfect tense (avoir and être)", "Speaking answers", "Writing 90 and 150 words"]
};

/* Every link in one place, for the Links page */
const LINKS = [
  ["General", [["Sparx Science", "https://sparxscience.com/"], ["Maths Genie", "https://www.mathsgenie.co.uk/"], ["Dr Frost Maths", "https://www.drfrost.org/"], ["Seneca Learning", "https://senecalearning.com/"], ["BBC Bitesize", "https://www.bbc.co.uk/bitesize"], ["Focus eLearning (physics practicals)", "https://www.focuseducational.com/login-to-focus-elearning/"]]],
  ["Maths", [["Expanding brackets (Corbett)", "https://corbettmaths.com/wp-content/uploads/2013/02/expanding-brackets-pdf1.pdf"], ["Expanding triple brackets", "https://www.mathsgenie.co.uk/resources/6-expanding-triple-brackets.pdf"], ["Factorisation (Corbett)", "https://corbettmaths.com/wp-content/uploads/2022/10/Factorisation.pdf"], ["Solving equations", "https://www.mathsgenie.co.uk/resources/3-solving-equations-ws.pdf"], ["Quadratics by factorising", "https://www.mathsgenie.co.uk/resources/5-solving-quadratics-by-factorising-ws.pdf"], ["Quadratic formula", "https://www.mathsgenie.co.uk/resources/7-quadratic-formula-ws.pdf"], ["Completing the square", "https://www.mathsgenie.co.uk/resources/9-completing-the-square-ws.pdf"], ["Sequences", "https://www.mathsgenie.co.uk/resources/4-sequences-ws.pdf"], ["Angles in parallel lines", "https://www.mathsgenie.co.uk/resources/4-angles-in-parallel-lines-ws.pdf"], ["Angles in polygons", "https://www.mathsgenie.co.uk/resources/4-angles-in-polygons.pdf"], ["Percentages", "https://www.mathsgenie.co.uk/resources/3-percentages-ws.pdf"], ["Reverse percentages", "https://www.mathsgenie.co.uk/resources/5-reverse-percentages-ws.pdf"], ["Compound interest", "https://www.mathsgenie.co.uk/resources/4-compound-interest-ws.pdf"], ["Standard form", "https://www.mathsgenie.co.uk/resources/5-standard-form-ws.pdf"], ["Indices", "https://www.mathsgenie.co.uk/resources/4-indices-ws.pdf"]]],
  ["Science", [["AQA Combined Science past papers", "https://www.aqa.org.uk/subjects/science/gcse/science-8464/assessment-resources"], ["Making a salt practical video", "https://www.youtube.com/watch?v=9GH95172Js8"], ["Temperature changes practical video", "https://www.youtube.com/watch?v=tKxcQYZ2YH8"], ["Cognito science videos", yt("cognito GCSE combined science")], ["Freesciencelessons videos", yt("freesciencelessons GCSE combined science")]]],
  ["English Literature", [["BBC Bitesize: Macbeth", "https://www.bbc.com/bitesize/topics/zgq3dmn"], ["Macbeth revision booklet", "https://www.stokenewingtonschool.co.uk/asset/1911"], ["BBC Bitesize: A Christmas Carol", "https://www.bbc.com/bitesize/topics/zcs8qty"], ["A Christmas Carol booklet (PDF)", "https://www.iscaexeter.co.uk/assets/Documents/2017%20-%2018/English/A-CHRISTMAS-CAROL-REVISION-BOOKLET.pdf"], ["BBC Bitesize: Blood Brothers", "https://www.bbc.com/bitesize/topics/zxv7sg8"], ["Poetry: Love and Relationships", "https://www.physicsandmathstutor.com/english-revision/gcse-aqa/love-and-relationships/"]]],
  ["English Language", [["Save My Exams: Paper 2 past papers", "https://www.savemyexams.com/gcse/english-language/aqa/past-papers/paper-2"], ["Physics & Maths Tutor: AQA English", "https://www.physicsandmathstutor.com/english-revision/gcse-aqa/"], ["AQA Paper 2 mark scheme (Nov 2022)", "https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2022/november/AQA-87002-MS-NOV22.PDF"]]],
  ["History", [["Save My Exams: Medicine in Britain", "https://www.savemyexams.com/gcse/history/edexcel/18/topics/medicine-in-britain-c-1250-present"], ["tutor2u: Weimar and Nazi Germany", "https://tutor2u.net/history/collections/edexcel-gcse-weimar-and-nazi-germany-1918-1939"], ["Microsoft Teams (class resources)", "https://teams.microsoft.com/"]]],
  ["French", [["Seneca: free AQA French", "https://senecalearning.com/en-GB/blog/free-aqa-french-gcse-revision/"], ["Identity and relationships", "https://www.bbc.co.uk/bitesize/topics/z667ywx"], ["Present tense verbs", "https://www.bbc.co.uk/bitesize/topics/zdyxywx"], ["Customs and festivals", "https://www.bbc.co.uk/bitesize/topics/znn6g2p"], ["Past tense verbs", "https://www.bbc.co.uk/bitesize/topics/zwv6vj6"], ["Future and conditional", "https://www.bbc.co.uk/bitesize/topics/zj3t3qt"]]]
];

/* Videos that play inside the site, per block ("dayid-blockNumber", counting from 0) */
const VIDEOS = {
  "tue20-0": [["Jenner and vaccination", "N62VqXEKnSk"], ["Public health in the 1800s", "fTIREIMBQk0"], ["Pasteur and germ theory", "oMNIQ_0_yCI"], ["Robert Koch", "ZHW6kdeX3cI"]],
  "tue20-1": [["The nuclear model of the atom", "cI2Shr8nns8"], ["Atomic number and mass number", "nyvVjJf7RAU"], ["Group 1", "Z9U0728-fPY"]],
  "tue20-2": [["French present tense in 5 minutes", "J1TyBDrYVOM"]],
  "wed21-0": [["Être or avoir in the perfect tense", "97VoMBmaDYk"]],
  "wed21-1": [["Energy stores and transfers", "JGwcDCeYRYo"], ["Efficiency", "KbrqbW0um0Y"]],
  "wed21-2": [["A Christmas Carol: top set analysis", "e98F6whQUFM"], ["Ghost of Christmas Past: key quotes", "uJNeHdlg1VU"], ["Scrooge in Stave Five", "Oe81CB3GADU"]],
  "thu22-1": [["Vaccination", "uPeZBhJYlnU"], ["Photosynthesis", "rAJGnS_ktk4"], ["Respiration", "ZKAaDbTP6Dc"]],
  "fri23-0": [["The Ruhr and hyperinflation", "z_-xakexp8E"], ["Hyperinflation in 1923", "kJmbLz-5Ubg"]],
  "fri23-1": [["Ionic bonding", "XbDtmORzKO8"]],
  "fri23-2": [["Blood Brothers: plot analysis", "XBEBP9Gvqew"], ["Mickey and Edward: key quotes", "v8vzvLbNeEQ"]],
  "mon26-0": [["Series circuits", "ZQurBlu35Fo"], ["Radioactive decay and half life", "wvgT52mwM3Y"]],
  "mon26-1": [["John Snow and cholera", "d3WKnHlXaBc"], ["Penicillin", "RsXHqYSIbbY"], ["Medicine in modern Britain", "Js2s8iwoNtQ"]],
  "tue27-0": [["Introducing electrolysis", "AhTRiL6xjBA"], ["Electrolysis required practical", "ukbtTTG1Kew"], ["Exothermic and endothermic", "4HS6D0hTzdg"]],
  "tue27-2": [["Paper 2, Question 2", "pFGLjE7fRGw"], ["Paper 2, Question 5", "NbEIo0Mq7bg"]],
  "sun1-0":  [["Stresemann and the Golden Age", "XSQbL-s9ky4"], ["Economic recovery in the 1920s", "z0iW8ChjE48"]],
  "sun1-1":  [["Eukaryotes and prokaryotes", "s9wf1Zf1AJM"], ["Osmosis required practical", "ZcYmb9A7Fu0"], ["The heart and circulation", "bpYaKM2hVFY"]],
  "sun1-2":  [["Paper 2, Question 5", "NbEIo0Mq7bg"], ["Question 5: updated edition", "lPcIVXhAp7M"]]
};
