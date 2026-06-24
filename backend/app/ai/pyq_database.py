"""
PYQ (Previous Year Questions) Database for JEE
Contains categorized questions from JEE Main and Advanced
"""
from typing import Optional
from dataclasses import dataclass


@dataclass
class PYQQuestion:
    id: str
    year: int
    exam_type: str  # JEE Main, JEE Advanced
    subject: str
    chapter: str
    topic: str
    question: str
    options: list[str]
    correct_answer: int  # Index of correct option (0-3)
    difficulty: str  # easy, medium, hard
    solution: str
    hint: str


class PYQDatabase:
    """In-memory database of JEE PYQs organized by subject and chapter"""
    
    def __init__(self):
        self.questions: list[dict] = []
        self._load_questions()
    
    def _load_questions(self):
        """Load all PYQ questions"""
        
        # Physics Questions
        self.questions.extend([
            # Mechanics
            {
                "id": "phy_mech_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Mechanics",
                "topic": "Laws of Motion",
                "question": "A block of mass 5 kg is placed on an inclined plane of angle 37°. If the coefficient of friction is 0.4, find the acceleration of the block. (sin 37° = 0.6, cos 37° = 0.8)",
                "options": ["2.8 m/s²", "2.2 m/s²", "1.8 m/s²", "3.2 m/s²"],
                "correct_answer": 1,
                "difficulty": "medium",
                "solution": "Along the incline: ma = mg sin θ - μN = mg sin θ - μmg cos θ\na = g(sin 37° - 0.4 × cos 37°) = 10(0.6 - 0.32) = 2.8 m/s²",
                "hint": "Consider forces along and perpendicular to the inclined plane"
            },
            {
                "id": "phy_mech_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Physics",
                "chapter": "Mechanics",
                "topic": "Work, Energy, Power",
                "question": "A particle moves along a straight line from x = 0 to x = 4m under the influence of force F = (4-x) N. The work done by the force is:",
                "options": ["8 J", "12 J", "16 J", "4 J"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "W = ∫F dx = ∫₀⁴ (4-x) dx = [4x - x²/2]₀⁴ = 16 - 8 = 8 J",
                "hint": "Use the work integral W = ∫F·dx"
            },
            {
                "id": "phy_mech_003",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Mechanics",
                "topic": "Circular Motion",
                "question": "A car is moving on a circular track of radius 100 m with a speed of 20 m/s. What is the centripetal acceleration?",
                "options": ["2 m/s²", "4 m/s²", "0.4 m/s²", "40 m/s²"],
                "correct_answer": 1,
                "difficulty": "easy",
                "solution": "Centripetal acceleration ac = v²/r = (20)²/100 = 400/100 = 4 m/s²",
                "hint": "Use the formula for centripetal acceleration"
            },
            
            # Electromagnetism
            {
                "id": "phy_em_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Electromagnetism",
                "topic": "Electric Field",
                "question": "Two point charges +2μC and -2μC are placed at points A and B respectively, 20 cm apart. Find the electric field at the midpoint of AB.",
                "options": ["3.6 × 10⁶ N/C", "7.2 × 10⁶ N/C", "1.8 × 10⁶ N/C", "0 N/C"],
                "correct_answer": 1,
                "difficulty": "medium",
                "solution": "At midpoint, both fields are in same direction (from + to -)\nE = 2 × kq/r² = 2 × (9×10⁹ × 2×10⁻⁶)/(0.1)² = 7.2 × 10⁶ N/C",
                "hint": "Electric fields from both charges add up at the midpoint"
            },
            {
                "id": "phy_em_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Physics",
                "chapter": "Electromagnetism",
                "topic": "Magnetic Field",
                "question": "A wire carrying current 10A is bent into a circular loop of radius 7 cm. The magnetic field at the center of the loop is: (μ₀ = 4π × 10⁻⁷ T·m/A)",
                "options": ["8.9 × 10⁻⁵ T", "4.5 × 10⁻⁵ T", "1.8 × 10⁻⁵ T", "9.0 × 10⁻⁵ T"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "B = μ₀I/(2r) = (4π × 10⁻⁷ × 10)/(2 × 0.07) = 8.9 × 10⁻⁵ T",
                "hint": "Use the formula for magnetic field at center of circular loop"
            },
            
            # Thermodynamics
            {
                "id": "phy_thermo_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Thermodynamics",
                "topic": "First Law of Thermodynamics",
                "question": "An ideal gas undergoes an isobaric process. If 500 J of heat is supplied to the gas, and the gas does 200 J of work, what is the change in internal energy?",
                "options": ["700 J", "300 J", "500 J", "200 J"],
                "correct_answer": 1,
                "difficulty": "easy",
                "solution": "Using First Law: ΔU = Q - W = 500 - 200 = 300 J",
                "hint": "Apply the first law of thermodynamics: ΔU = Q - W"
            },
            {
                "id": "phy_thermo_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Physics",
                "chapter": "Thermodynamics",
                "topic": "Carnot Engine",
                "question": "A Carnot engine operates between temperatures 500K and 300K. If it produces 1000 J of work, how much heat is absorbed from the hot reservoir?",
                "options": ["2000 J", "2500 J", "1500 J", "3000 J"],
                "correct_answer": 1,
                "difficulty": "hard",
                "solution": "Efficiency η = 1 - T₂/T₁ = 1 - 300/500 = 0.4\nη = W/Q₁ → Q₁ = W/η = 1000/0.4 = 2500 J",
                "hint": "First calculate the Carnot efficiency, then use η = W/Q₁"
            },
            
            # Optics
            {
                "id": "phy_opt_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Optics",
                "topic": "Refraction",
                "question": "Light travels from a medium with refractive index 1.5 to air. What is the critical angle for total internal reflection?",
                "options": ["42°", "48°", "38°", "45°"],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "sin θc = n₂/n₁ = 1/1.5 = 2/3\nθc = sin⁻¹(2/3) ≈ 42°",
                "hint": "Use Snell's law at the critical angle where refracted angle is 90°"
            },
            
            # Modern Physics
            {
                "id": "phy_mod_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Physics",
                "chapter": "Modern Physics",
                "topic": "Photoelectric Effect",
                "question": "The threshold frequency for photoelectric emission from a metal is 6 × 10¹⁴ Hz. If light of frequency 8 × 10¹⁴ Hz falls on it, what is the maximum kinetic energy of the emitted electrons? (h = 6.6 × 10⁻³⁴ J·s)",
                "options": ["1.32 × 10⁻¹⁹ J", "2.64 × 10⁻¹⁹ J", "0.66 × 10⁻¹⁹ J", "3.96 × 10⁻¹⁹ J"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "KE_max = h(ν - ν₀) = 6.6 × 10⁻³⁴ × (8 - 6) × 10¹⁴ = 1.32 × 10⁻¹⁹ J",
                "hint": "Use Einstein's photoelectric equation: KE_max = hν - hν₀"
            },
        ])
        
        # Chemistry Questions
        self.questions.extend([
            # Organic Chemistry
            {
                "id": "chem_org_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Chemistry",
                "chapter": "Organic Chemistry",
                "topic": "Reactions of Aldehydes and Ketones",
                "question": "Which of the following compounds gives positive iodoform test?",
                "options": ["Methanal", "Ethanal", "Benzaldehyde", "Acetone"],
                "correct_answer": 1,
                "difficulty": "easy",
                "solution": "Iodoform test is positive for compounds having CH₃CO- group or CH₃CH(OH)- group. Ethanal (CH₃CHO) has CH₃CO- group.",
                "hint": "Think about which compound has the CH₃CO- or CH₃CH(OH)- group"
            },
            {
                "id": "chem_org_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Chemistry",
                "chapter": "Organic Chemistry",
                "topic": "Aromatic Compounds",
                "question": "Which of the following is the most stable carbocation?",
                "options": ["CH₃⁺", "C₆H₅CH₂⁺", "(C₆H₅)₂CH⁺", "(C₆H₅)₃C⁺"],
                "correct_answer": 3,
                "difficulty": "medium",
                "solution": "Carbocation stability increases with resonance stabilization. Triphenylmethyl cation (C₆H₅)₃C⁺ has maximum resonance structures due to three benzene rings.",
                "hint": "Consider resonance stabilization - more phenyl groups means more stability"
            },
            {
                "id": "chem_org_003",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Chemistry",
                "chapter": "Organic Chemistry",
                "topic": "Hydrocarbons",
                "question": "The product obtained when propyne reacts with dilute H₂SO₄ in presence of HgSO₄ is:",
                "options": ["Propan-1-ol", "Propan-2-ol", "Propanal", "Acetone"],
                "correct_answer": 3,
                "difficulty": "medium",
                "solution": "Propyne undergoes Markovnikov hydration. CH₃-C≡CH + H₂O → CH₃COCH₃ (Acetone) via enol intermediate",
                "hint": "This is acid-catalyzed hydration following Markovnikov's rule"
            },
            
            # Physical Chemistry
            {
                "id": "chem_phys_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Chemistry",
                "chapter": "Physical Chemistry",
                "topic": "Chemical Kinetics",
                "question": "For a first-order reaction, the half-life is 693 seconds. What is the rate constant?",
                "options": ["0.001 s⁻¹", "0.01 s⁻¹", "0.1 s⁻¹", "1 s⁻¹"],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "For first-order reaction: t₁/₂ = 0.693/k\nk = 0.693/693 = 0.001 s⁻¹",
                "hint": "Use the half-life formula for first-order reactions"
            },
            {
                "id": "chem_phys_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Chemistry",
                "chapter": "Physical Chemistry",
                "topic": "Electrochemistry",
                "question": "The standard electrode potential of Cu²⁺/Cu is +0.34 V and Zn²⁺/Zn is -0.76 V. The EMF of the cell Zn|Zn²⁺||Cu²⁺|Cu is:",
                "options": ["0.42 V", "1.10 V", "-1.10 V", "-0.42 V"],
                "correct_answer": 1,
                "difficulty": "medium",
                "solution": "E°cell = E°cathode - E°anode = 0.34 - (-0.76) = 1.10 V",
                "hint": "Identify cathode and anode based on standard reduction potentials"
            },
            {
                "id": "chem_phys_003",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Chemistry",
                "chapter": "Physical Chemistry",
                "topic": "Chemical Equilibrium",
                "question": "For the reaction N₂ + 3H₂ ⇌ 2NH₃, if Kp = 1.6 × 10⁻⁴ at 400°C, what is Kc? (R = 0.0821 L·atm/mol·K)",
                "options": ["0.5", "0.05", "5.0", "50"],
                "correct_answer": 0,
                "difficulty": "hard",
                "solution": "Kp = Kc(RT)^Δn where Δn = 2 - 4 = -2\nKc = Kp/(RT)^(-2) = 1.6 × 10⁻⁴ × (0.0821 × 673)² ≈ 0.5",
                "hint": "Use the relation between Kp and Kc: Kp = Kc(RT)^Δn"
            },
            
            # Inorganic Chemistry
            {
                "id": "chem_inorg_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Chemistry",
                "chapter": "Inorganic Chemistry",
                "topic": "Chemical Bonding",
                "question": "The hybridization of central atom in SF₆ is:",
                "options": ["sp³", "sp³d", "sp³d²", "sp³d³"],
                "correct_answer": 2,
                "difficulty": "easy",
                "solution": "SF₆ has 6 bonding pairs around S. Steric number = 6, hence sp³d² hybridization",
                "hint": "Count the number of electron pairs around the central atom"
            },
            {
                "id": "chem_inorg_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Chemistry",
                "chapter": "Inorganic Chemistry",
                "topic": "Coordination Compounds",
                "question": "The IUPAC name of [Co(NH₃)₄Cl₂]Cl is:",
                "options": [
                    "Tetraamminedichlorocobalt(III) chloride",
                    "Dichlorotetraamminecobalt(III) chloride",
                    "Tetraamminedichloridocobalt(III) chloride",
                    "Cobalt(III) tetraamminedichloride chloride"
                ],
                "correct_answer": 2,
                "difficulty": "medium",
                "solution": "Following IUPAC rules: ligands in alphabetical order, metal with oxidation state, counter ion. Ammine before chlorido alphabetically.",
                "hint": "Remember IUPAC naming: alphabetical order of ligands, then metal with oxidation state"
            },
        ])
        
        # Mathematics Questions
        self.questions.extend([
            # Calculus
            {
                "id": "math_calc_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Calculus",
                "topic": "Integration",
                "question": "∫ x·eˣ dx equals:",
                "options": ["xeˣ - eˣ + C", "xeˣ + eˣ + C", "(x-1)eˣ + C", "(x+1)eˣ + C"],
                "correct_answer": 2,
                "difficulty": "easy",
                "solution": "Using integration by parts: ∫xeˣdx = xeˣ - ∫eˣdx = xeˣ - eˣ + C = (x-1)eˣ + C",
                "hint": "Use integration by parts with u = x and dv = eˣdx"
            },
            {
                "id": "math_calc_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Mathematics",
                "chapter": "Calculus",
                "topic": "Differential Equations",
                "question": "The solution of dy/dx = y/x + tan(y/x) is:",
                "options": ["sin(y/x) = Cx", "cos(y/x) = Cx", "tan(y/x) = Cx", "cot(y/x) = Cx"],
                "correct_answer": 0,
                "difficulty": "hard",
                "solution": "Put y = vx, then dy/dx = v + x(dv/dx)\nv + x(dv/dx) = v + tan(v)\nx(dv/dx) = tan(v)\n∫cot(v)dv = ∫dx/x\nln|sin(v)| = ln|x| + ln|C|\nsin(y/x) = Cx",
                "hint": "This is a homogeneous differential equation. Use substitution y = vx"
            },
            {
                "id": "math_calc_003",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Calculus",
                "topic": "Limits",
                "question": "lim(x→0) (sin 5x)/(tan 3x) equals:",
                "options": ["5/3", "3/5", "1", "15"],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "lim(x→0) (sin 5x)/(tan 3x) = lim(x→0) [(sin 5x)/(5x)] × [5x/3x] × [3x/(tan 3x)]\n= 1 × (5/3) × 1 = 5/3",
                "hint": "Use the standard limits: lim(x→0) sin(x)/x = 1 and lim(x→0) tan(x)/x = 1"
            },
            
            # Algebra
            {
                "id": "math_alg_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Algebra",
                "topic": "Quadratic Equations",
                "question": "If α and β are roots of x² - 5x + 6 = 0, then (α² + β²) equals:",
                "options": ["13", "25", "36", "11"],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "α + β = 5, αβ = 6\nα² + β² = (α + β)² - 2αβ = 25 - 12 = 13",
                "hint": "Use the identity α² + β² = (α + β)² - 2αβ"
            },
            {
                "id": "math_alg_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Mathematics",
                "chapter": "Algebra",
                "topic": "Matrices and Determinants",
                "question": "If A is a 3×3 matrix such that |A| = 5, then |adj(A)| equals:",
                "options": ["5", "25", "125", "1/5"],
                "correct_answer": 1,
                "difficulty": "medium",
                "solution": "|adj(A)| = |A|^(n-1) where n is the order of matrix\n|adj(A)| = 5² = 25",
                "hint": "Use the property |adj(A)| = |A|^(n-1) for an n×n matrix"
            },
            {
                "id": "math_alg_003",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Algebra",
                "topic": "Complex Numbers",
                "question": "If z = (1 + i)/(1 - i), then z¹⁰⁰ equals:",
                "options": ["1", "-1", "i", "-i"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "z = (1+i)/(1-i) = (1+i)²/((1-i)(1+i)) = (1+2i-1)/2 = i\nz¹⁰⁰ = i¹⁰⁰ = (i⁴)²⁵ = 1²⁵ = 1",
                "hint": "Simplify z first, then use the cyclicity of i"
            },
            
            # Coordinate Geometry
            {
                "id": "math_coord_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Coordinate Geometry",
                "topic": "Straight Lines",
                "question": "The distance between parallel lines 3x + 4y = 5 and 6x + 8y = 15 is:",
                "options": ["1/2", "1/10", "5/2", "5/10"],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "First line: 3x + 4y - 5 = 0\nSecond line: 3x + 4y - 7.5 = 0 (dividing by 2)\nDistance = |c₁ - c₂|/√(a² + b²) = |5 - 7.5|/√(9+16) = 2.5/5 = 1/2",
                "hint": "Make coefficients of x and y same, then use the distance formula"
            },
            {
                "id": "math_coord_002",
                "year": 2022,
                "exam_type": "JEE Advanced",
                "subject": "Mathematics",
                "chapter": "Coordinate Geometry",
                "topic": "Conic Sections",
                "question": "The eccentricity of the ellipse x²/16 + y²/9 = 1 is:",
                "options": ["√7/4", "√7/3", "3/4", "7/16"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "a² = 16, b² = 9, so a = 4, b = 3\nFor ellipse: c² = a² - b² = 16 - 9 = 7, c = √7\ne = c/a = √7/4",
                "hint": "Use the formula e = c/a where c² = a² - b² for an ellipse"
            },
            
            # Trigonometry
            {
                "id": "math_trig_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Trigonometry",
                "topic": "Trigonometric Equations",
                "question": "The general solution of sin x = 1/2 is:",
                "options": [
                    "nπ + (-1)ⁿπ/6",
                    "2nπ + π/6",
                    "nπ + π/6",
                    "nπ/2 + π/6"
                ],
                "correct_answer": 0,
                "difficulty": "easy",
                "solution": "sin x = 1/2 = sin(π/6)\nGeneral solution: x = nπ + (-1)ⁿπ/6, n ∈ Z",
                "hint": "Use the general solution formula for sin x = sin α"
            },
            
            # Probability
            {
                "id": "math_prob_001",
                "year": 2023,
                "exam_type": "JEE Main",
                "subject": "Mathematics",
                "chapter": "Probability",
                "topic": "Conditional Probability",
                "question": "A bag contains 5 red and 3 blue balls. Two balls are drawn one after another without replacement. What is the probability that the second ball is blue given that the first ball is red?",
                "options": ["3/7", "3/8", "5/7", "5/8"],
                "correct_answer": 0,
                "difficulty": "medium",
                "solution": "P(2nd blue | 1st red) = 3/(5+3-1) = 3/7\nAfter removing 1 red ball, we have 4 red and 3 blue = 7 balls total",
                "hint": "After drawing the first red ball, count remaining balls"
            },
        ])
    
    def get_questions(
        self,
        subject: Optional[str] = None,
        chapter: Optional[str] = None,
        topic: Optional[str] = None,
        difficulty: Optional[str] = None,
        exam_type: Optional[str] = None,
        year: Optional[int] = None,
        limit: int = 10
    ) -> list[dict]:
        """
        Get questions based on filters.
        
        Args:
            subject: Filter by subject (Physics, Chemistry, Mathematics)
            chapter: Filter by chapter name (partial match)
            topic: Filter by topic (partial match)
            difficulty: Filter by difficulty (easy, medium, hard)
            exam_type: Filter by exam type (JEE Main, JEE Advanced)
            year: Filter by year
            limit: Maximum number of questions to return
        
        Returns:
            List of matching questions
        """
        results = self.questions.copy()
        
        if subject:
            results = [q for q in results if q["subject"].lower() == subject.lower()]
        
        if chapter:
            results = [q for q in results if chapter.lower() in q["chapter"].lower()]
        
        if topic:
            results = [q for q in results if topic.lower() in q["topic"].lower()]
        
        if difficulty:
            results = [q for q in results if q["difficulty"].lower() == difficulty.lower()]
        
        if exam_type:
            results = [q for q in results if exam_type.lower() in q["exam_type"].lower()]
        
        if year:
            results = [q for q in results if q["year"] == year]
        
        return results[:limit]
    
    def get_question_by_id(self, question_id: str) -> Optional[dict]:
        """Get a specific question by ID"""
        for q in self.questions:
            if q["id"] == question_id:
                return q
        return None
    
    def get_subjects(self) -> list[str]:
        """Get list of all subjects"""
        return list(set(q["subject"] for q in self.questions))
    
    def get_chapters(self, subject: Optional[str] = None) -> list[str]:
        """Get list of all chapters, optionally filtered by subject"""
        questions = self.questions
        if subject:
            questions = [q for q in questions if q["subject"].lower() == subject.lower()]
        return list(set(q["chapter"] for q in questions))
    
    def get_topics(self, subject: Optional[str] = None, chapter: Optional[str] = None) -> list[str]:
        """Get list of all topics, optionally filtered by subject and chapter"""
        questions = self.questions
        if subject:
            questions = [q for q in questions if q["subject"].lower() == subject.lower()]
        if chapter:
            questions = [q for q in questions if chapter.lower() in q["chapter"].lower()]
        return list(set(q["topic"] for q in questions))


# Singleton instance
_db_instance: PYQDatabase = None


def get_pyq_database() -> PYQDatabase:
    """Get or create the PYQ database singleton"""
    global _db_instance
    if _db_instance is None:
        _db_instance = PYQDatabase()
    return _db_instance
