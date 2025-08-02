// Sample reaction data for molecular dynamics visualization

export const reactionTypes = [
  {
    id: 'sn2',
    name: 'SN2 Reaction (Nucleophilic Substitution)',
    description: 'A bimolecular nucleophilic substitution reaction where a nucleophile attacks a molecule, displacing a leaving group in a single step.',
    equation: 'Nu⁻ + R-LG → R-Nu + LG⁻',
    steps: [
      {
        title: 'Initial State',
        description: 'The nucleophile (chloride ion) and substrate (bromomethane) are separated. The substrate has a partial positive charge on the carbon atom bonded to the leaving group (bromine).',
        keyPoints: [
          'The carbon-bromine bond is polarized with the carbon having a partial positive charge.',
          'The nucleophile (chloride ion) has a negative charge and is attracted to the partially positive carbon.',
        ],
        energyChange: 'Starting at baseline energy level.',
        molecules: [
          {
            // Bromomethane (CH3Br)
            atoms: [
              { element: 'C', position: [2, 0, 0], showLabel: true },
              { element: 'H', position: [2, 1, 0] },
              { element: 'H', position: [2.94, -0.5, 0] },
              { element: 'H', position: [1.06, -0.5, 0] },
              { element: 'Br', position: [2, -1.5, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4 },
            ],
          },
          {
            // Chloride ion (Cl-)
            atoms: [
              { element: 'Cl', position: [-2, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
        ],
      },
      {
        title: 'Approach',
        description: 'The nucleophile approaches the substrate from the side opposite to the leaving group, following the principles of orbital overlap.',
        keyPoints: [
          'The nucleophile approaches from the back side (opposite to the leaving group).',
          'This approach allows for optimal orbital overlap.',
          'The reaction follows a backside attack mechanism.',
        ],
        energyChange: 'Energy begins to increase as the molecules approach each other.',
        molecules: [
          {
            // Bromomethane with approaching chloride
            atoms: [
              { element: 'C', position: [1, 0, 0], showLabel: true },
              { element: 'H', position: [1, 1, 0] },
              { element: 'H', position: [1.94, -0.5, 0] },
              { element: 'H', position: [0.06, -0.5, 0] },
              { element: 'Br', position: [1, -1.5, 0], showLabel: true },
              { element: 'Cl', position: [-1, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4 },
            ],
          },
        ],
      },
      {
        title: 'Electron Interaction',
        description: 'The lone pair electrons on the nucleophile begin to interact with the empty orbital on the carbon atom, while the C-Br bonding electrons start to shift.',
        keyPoints: [
          'The nucleophile\'s lone pair electrons are attracted to the carbon\'s empty orbital.',
          'The C-Br bond electrons begin to move toward the bromine atom.',
          'This electron movement initiates the bond formation and breaking process.',
        ],
        energyChange: 'Energy continues to increase as electron reorganization begins.',
        molecules: [
          {
            // Showing electron interaction with visual cues
            atoms: [
              { element: 'C', position: [0.5, 0, 0], showLabel: true },
              { element: 'H', position: [0.5, 1, 0] },
              { element: 'H', position: [1.44, -0.5, 0] },
              { element: 'H', position: [-0.44, -0.5, 0] },
              { element: 'Br', position: [0.5, -1.6, 0], showLabel: true },
              { element: 'Cl', position: [-0.5, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4, color: '#ffaa88' }, // Slightly weakening bond (light red)
              { from: 0, to: 5, color: '#aaffaa' },  // Beginning to form bond (light green)
            ],
            electrons: [
              { atomIndex: 0, count: 4, highlight: true }, // Carbon electrons
              { atomIndex: 4, count: 7, highlight: true }, // Bromine electrons
              { atomIndex: 5, count: 7, highlight: true },  // Attacking chlorine electrons
            ],
          },
        ],
      },
      {
        title: 'Transition State',
        description: 'A transition state forms where the nucleophile begins forming a bond with the carbon while the carbon-leaving group bond begins to break.',
        keyPoints: [
          'The carbon atom is partially bonded to both the nucleophile and the leaving group.',
          'The carbon adopts a trigonal bipyramidal geometry.',
          'This is the highest energy point in the reaction pathway.',
        ],
        energyChange: 'Maximum energy point (transition state) where bonds are partially formed and broken.',
        molecules: [
          {
            // Transition state
            atoms: [
              { element: 'C', position: [0, 0, 0], showLabel: true },
              { element: 'H', position: [0, 1, 0] },
              { element: 'H', position: [0.87, -0.5, 0] },
              { element: 'H', position: [-0.87, -0.5, 0] },
              { element: 'Br', position: [0, -1.8, 0], showLabel: true },
              { element: 'Cl', position: [0, 1.8, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4, color: '#ff8888' }, // Weakening bond (red)
              { from: 0, to: 5, color: '#88ff88' },  // Forming bond (green)
            ],
          },
        ],
      },
      {
        title: 'Product Formation',
        description: 'The nucleophile-carbon bond is fully formed, and the carbon-leaving group bond is completely broken, resulting in the products.',
        keyPoints: [
          'The leaving group (bromide ion) departs with the electron pair from its bond to carbon.',
          'The nucleophile (chloride) is now bonded to the carbon.',
          'The stereochemistry at the carbon is inverted (if it was a stereocenter).',
        ],
        energyChange: 'Energy decreases as the stable products form.',
        molecules: [
          {
            // Chloromethane (CH3Cl)
            atoms: [
              { element: 'C', position: [-1, 0, 0], showLabel: true },
              { element: 'H', position: [-1, 1, 0] },
              { element: 'H', position: [-0.06, -0.5, 0] },
              { element: 'H', position: [-1.94, -0.5, 0] },
              { element: 'Cl', position: [-1, -1.5, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4 },
            ],
          },
          {
            // Bromide ion (Br-)
            atoms: [
              { element: 'Br', position: [2, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
        ],
      },
    ],
  },
  {
    id: 'acid-base',
    name: 'Acid-Base Reaction',
    description: 'A proton transfer reaction between an acid and a base, resulting in the formation of a conjugate base and conjugate acid.',
    equation: 'HA + B ⇌ A⁻ + HB⁺',
    steps: [
      {
        title: 'Initial State',
        description: 'The acid (HA) and base (B) are separated. The acid has a polarized H-A bond with the hydrogen having a partial positive charge.',
        keyPoints: [
          'The acid has a polarized H-A bond.',
          'The base has a lone pair of electrons that can accept a proton.',
        ],
        energyChange: 'Starting at baseline energy level.',
        molecules: [
          {
            // Acid (HA) - Using HCl as example
            atoms: [
              { element: 'H', position: [-1.5, 0, 0], showLabel: true },
              { element: 'Cl', position: [-2.5, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
            ],
          },
          {
            // Base (B) - Using NH3 as example
            atoms: [
              { element: 'N', position: [2, 0, 0], showLabel: true },
              { element: 'H', position: [2.5, 0.87, 0] },
              { element: 'H', position: [2.5, -0.87, 0] },
              { element: 'H', position: [1, 0, 0] },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
            ],
          },
        ],
      },
      {
        title: 'Approach',
        description: 'The base approaches the acid, with the lone pair on the base oriented toward the acidic hydrogen.',
        keyPoints: [
          'The lone pair on the base is attracted to the partially positive hydrogen of the acid.',
          'The molecules orient for optimal interaction.',
        ],
        energyChange: 'Energy begins to increase as the molecules approach each other.',
        molecules: [
          {
            // Acid and base approaching
            atoms: [
              { element: 'H', position: [-0.8, 0, 0], showLabel: true },
              { element: 'Cl', position: [-1.8, 0, 0], showLabel: true },
              { element: 'N', position: [1, 0, 0], showLabel: true },
              { element: 'H', position: [1.5, 0.87, 0] },
              { element: 'H', position: [1.5, -0.87, 0] },
              { element: 'H', position: [0, 0, 0] },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 2, to: 3 },
              { from: 2, to: 4 },
              { from: 2, to: 5 },
            ],
          },
        ],
      },
      {
        title: 'Electron Donation',
        description: 'The lone pair electrons on the nitrogen begin to interact with the hydrogen, while the H-Cl bonding electrons start to move toward chlorine.',
        keyPoints: [
          'The nitrogen\'s lone pair electrons are donated toward the hydrogen atom.',
          'The H-Cl bond electrons begin to shift toward the chlorine atom.',
          'This electron movement facilitates the proton transfer process.',
        ],
        energyChange: 'Energy increases as electron reorganization occurs.',
        molecules: [
          {
            // Showing electron donation with visual cues
            atoms: [
              { element: 'H', position: [-0.4, 0, 0], showLabel: true },
              { element: 'Cl', position: [-1.4, 0, 0], showLabel: true },
              { element: 'N', position: [0.8, 0, 0], showLabel: true },
              { element: 'H', position: [1.3, 0.87, 0] },
              { element: 'H', position: [1.3, -0.87, 0] },
              { element: 'H', position: [-0.2, 0, 0] },
            ],
            bonds: [
              { from: 0, to: 1, color: '#ffaa88' }, // Weakening H-Cl bond (light red)
              { from: 0, to: 2, color: '#aaffaa' }, // Forming N-H bond (light green)
              { from: 2, to: 3 },
              { from: 2, to: 4 },
              { from: 2, to: 5 },
            ],
            electrons: [
              { atomIndex: 1, count: 7, highlight: true }, // Chlorine electrons
              { atomIndex: 2, count: 5, highlight: true },  // Nitrogen lone pair
            ],
          },
        ],
      },
      {
        title: 'Transition State',
        description: 'A transition state forms where the proton is partially bonded to both the acid and the base.',
        keyPoints: [
          'The proton is shared between the acid and base.',
          'The original H-A bond is weakening while the H-B bond is forming.',
          'This is the highest energy point in the reaction pathway.',
        ],
        energyChange: 'Maximum energy point (transition state) where the proton is being transferred.',
        molecules: [
          {
            // Transition state
            atoms: [
              { element: 'H', position: [0, 0, 0], showLabel: true },
              { element: 'Cl', position: [-1, 0, 0], showLabel: true },
              { element: 'N', position: [1, 0, 0], showLabel: true },
              { element: 'H', position: [1.5, 0.87, 0] },
              { element: 'H', position: [1.5, -0.87, 0] },
              { element: 'H', position: [1.5, 0, 0.87] },
            ],
            bonds: [
              { from: 0, to: 1, color: '#ff8888' }, // Weakening bond (red)
              { from: 0, to: 2, color: '#88ff88' }, // Forming bond (green)
              { from: 2, to: 3 },
              { from: 2, to: 4 },
              { from: 2, to: 5 },
            ],
          },
        ],
      },
      {
        title: 'Product Formation',
        description: 'The proton transfer is complete, resulting in the formation of the conjugate base (A-) and conjugate acid (HB+).',
        keyPoints: [
          'The proton has been fully transferred from the acid to the base.',
          'The original acid has become its conjugate base.',
          'The original base has become its conjugate acid.',
        ],
        energyChange: 'Energy decreases as the stable products form.',
        molecules: [
          {
            // Conjugate base (A-) - Cl-
            atoms: [
              { element: 'Cl', position: [-2, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
          {
            // Conjugate acid (HB+) - NH4+
            atoms: [
              { element: 'N', position: [2, 0, 0], showLabel: true },
              { element: 'H', position: [2.5, 0.87, 0] },
              { element: 'H', position: [2.5, -0.87, 0] },
              { element: 'H', position: [1, 0, 0] },
              { element: 'H', position: [2.5, 0, 0.87] },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'redox',
    name: 'Redox Reaction',
    description: 'A reaction involving the transfer of electrons between species, resulting in changes in oxidation states.',
    equation: 'Oxidation: A → A⁺ + e⁻, Reduction: B + e⁻ → B⁻',
    steps: [
      {
        title: 'Initial State',
        description: 'The reducing agent (electron donor) and oxidizing agent (electron acceptor) are separated.',
        keyPoints: [
          'The reducing agent has electrons available for donation.',
          'The oxidizing agent has the ability to accept electrons.',
        ],
        energyChange: 'Starting at baseline energy level.',
        molecules: [
          {
            // Reducing agent (Na)
            atoms: [
              { element: 'Na', position: [-2, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
          {
            // Oxidizing agent (Cl2)
            atoms: [
              { element: 'Cl', position: [1.5, 0, 0], showLabel: true },
              { element: 'Cl', position: [2.5, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
            ],
          },
        ],
      },
      {
        title: 'Approach',
        description: 'The reducing agent and oxidizing agent approach each other, preparing for electron transfer.',
        keyPoints: [
          'The molecules orient for optimal electron transfer.',
          'The electron from the reducing agent begins to interact with the oxidizing agent.',
        ],
        energyChange: 'Energy begins to increase as the molecules approach each other.',
        molecules: [
          {
            // Approaching molecules
            atoms: [
              { element: 'Na', position: [-1, 0, 0], showLabel: true },
              { element: 'Cl', position: [0.5, 0, 0], showLabel: true },
              { element: 'Cl', position: [1.5, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 1, to: 2 },
            ],
          },
        ],
      },
      {
        title: 'Electron Mobilization',
        description: 'The valence electron from sodium begins to move toward the chlorine molecule, while the Cl-Cl bond starts to weaken in preparation for electron acceptance.',
        keyPoints: [
          'Sodium\'s valence electron becomes more mobile and starts moving toward chlorine.',
          'The Cl-Cl bond begins to polarize as it prepares to accept the electron.',
          'This represents the beginning of the oxidation-reduction process.',
        ],
        energyChange: 'Energy increases as electron reorganization begins.',
        molecules: [
          {
            // Showing electron mobilization with visual cues
            atoms: [
              { element: 'Na', position: [-0.7, 0, 0], showLabel: true },
              { element: 'Cl', position: [0.3, 0, 0], showLabel: true },
              { element: 'Cl', position: [1.3, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 1, to: 2, color: '#ffaa88' }, // Weakening Cl-Cl bond (light red)
            ],
            electrons: [
              { atomIndex: 0, count: 1, highlight: true }, // Sodium valence electron
              { atomIndex: 1, count: 7, highlight: true }, // Chlorine electrons
              { atomIndex: 2, count: 7, highlight: true },  // Chlorine electrons
            ],
          },
        ],
      },
      {
        title: 'Electron Transfer',
        description: 'The electron is transferred from the reducing agent to the oxidizing agent.',
        keyPoints: [
          'The reducing agent loses an electron (oxidation).',
          'The oxidizing agent gains an electron (reduction).',
          'This changes the oxidation states of both species.',
        ],
        energyChange: 'Energy fluctuates during electron transfer.',
        molecules: [
          {
            // Electron transfer state
            atoms: [
              { element: 'Na', position: [-0.5, 0, 0], showLabel: true },
              { element: 'Cl', position: [0.5, 0, 0], showLabel: true },
              { element: 'Cl', position: [1.5, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 1, to: 2, color: '#ff8888' }, // Weakening bond (red)
            ],
          },
        ],
      },
      {
        title: 'Product Formation',
        description: 'The electron transfer is complete, resulting in the formation of ions and new bonds.',
        keyPoints: [
          'The reducing agent has been oxidized to a cation.',
          'The oxidizing agent has been reduced and may form a new species.',
          'The products have different properties than the reactants.',
        ],
        energyChange: 'Energy decreases as the stable products form.',
        molecules: [
          {
            // Sodium ion (Na+)
            atoms: [
              { element: 'Na', position: [-2, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
          {
            // Chloride ions (Cl-)
            atoms: [
              { element: 'Cl', position: [1, 0, 0], showLabel: true },
              { element: 'Cl', position: [3, 0, 0], showLabel: true },
            ],
            bonds: [],
          },
        ],
      },
    ],
  },
  {
    id: 'radical-chain',
    name: 'Free Radical Chain Reaction',
    description: 'A multi-step reaction involving <tooltip term="radical">radical</tooltip> intermediates that propagate through <tooltip term="initiation">initiation</tooltip>, <tooltip term="propagation">propagation</tooltip>, and <tooltip term="termination">termination</tooltip> steps.',
    equation: 'Initiation: Cl₂ → 2Cl• | Propagation: Cl• + CH₄ → HCl + CH₃• | CH₃• + Cl₂ → CH₃Cl + Cl•',
    steps: [
      {
        title: 'Initiation Step',
        description: '<tooltip term="homolytic cleavage">Homolytic cleavage</tooltip> of <tooltip term="chlorine molecule">chlorine molecule</tooltip> produces two <tooltip term="chlorine radicals">chlorine radicals</tooltip>. Each chlorine atom gets one <tooltip term="electron">electron</tooltip> from the broken <tooltip term="covalent bond">bond</tooltip>.',
        keyPoints: [
          'The Cl-Cl <tooltip term="covalent bond">bond</tooltip> breaks <tooltip term="homolytically">homolytically</tooltip>, with each atom keeping one <tooltip term="electron">electron</tooltip>.',
          'This creates two highly reactive <tooltip term="chlorine radicals">chlorine radicals</tooltip> (Cl•).',
          'Energy input (heat or light) is required to break the <tooltip term="covalent bond">bond</tooltip>.',
        ],
        energyChange: 'Energy input required to break the Cl-Cl bond homolytically.',
        molecules: [
          {
            // Chlorine molecule (Cl2)
            atoms: [
              { element: 'Cl', position: [-1, 0, 0], showLabel: true },
              { element: 'Cl', position: [1, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1, color: '#1FF01F' },
            ],
            electrons: [
              { atomIndex: 0, count: 7, highlight: false },
              { atomIndex: 1, count: 7, highlight: false },
            ],
          },
        ],
      },
      {
        title: 'Radical Formation',
        description: 'The <tooltip term="chlorine molecule">chlorine molecule</tooltip> <tooltip term="covalent bond">bond</tooltip> breaks, forming two separate <tooltip term="chlorine radicals">chlorine radicals</tooltip> with <tooltip term="unpaired electrons">unpaired electrons</tooltip>.',
        keyPoints: [
          'Two <tooltip term="chlorine radicals">chlorine radicals</tooltip> are now formed, each with an <tooltip term="unpaired electron">unpaired electron</tooltip>.',
          'The <tooltip term="radicals">radicals</tooltip> are highly <tooltip term="reactive">reactive</tooltip> due to the <tooltip term="unpaired electron">unpaired electron</tooltip>.',
          'These <tooltip term="radicals">radicals</tooltip> will seek to pair their <tooltip term="electrons">electrons</tooltip> by reacting with other <tooltip term="molecules">molecules</tooltip>.',
        ],
        energyChange: 'High energy state due to unpaired electrons on the radicals.',
        molecules: [
          {
            // First chlorine radical
            atoms: [
              { element: 'Cl', position: [-2, 0, 0], showLabel: true },
            ],
            bonds: [],
            electrons: [
              { atomIndex: 0, count: 7, highlight: true, unpaired: 1 },
            ],
            radicals: [
              { atomIndex: 0, isRadical: true },
            ],
          },
          {
            // Second chlorine radical
            atoms: [
              { element: 'Cl', position: [2, 0, 0], showLabel: true },
            ],
            bonds: [],
            electrons: [
              { atomIndex: 0, count: 7, highlight: true, unpaired: 1 },
            ],
            radicals: [
              { atomIndex: 0, isRadical: true },
            ],
          },
        ],
      },
      {
        title: 'Propagation Step 1',
        description: 'A <tooltip term="chlorine radical">chlorine radical</tooltip> attacks <tooltip term="methane">methane</tooltip>, <tooltip term="abstracting">abstracting</tooltip> a <tooltip term="hydrogen atom">hydrogen atom</tooltip> to form <tooltip term="hydrogen chloride">HCl</tooltip> and a <tooltip term="methyl radical">methyl radical</tooltip>.',
        keyPoints: [
          'The <tooltip term="chlorine radical">chlorine radical</tooltip> <tooltip term="abstracts">abstracts</tooltip> a <tooltip term="hydrogen">hydrogen</tooltip> from <tooltip term="methane">methane</tooltip>.',
          'This forms <tooltip term="hydrogen chloride">hydrogen chloride</tooltip> (HCl) and a <tooltip term="methyl radical">methyl radical</tooltip> (CH₃•).',
          'The reaction is <tooltip term="exothermic">exothermic</tooltip> and drives the <tooltip term="chain reaction">chain reaction</tooltip> forward.',
        ],
        energyChange: 'Energy released as the strong H-Cl bond forms.',
        molecules: [
          {
            // Methane and chlorine radical approaching
            atoms: [
              { element: 'C', position: [0, 0, 0], showLabel: true },
              { element: 'H', position: [0, 1, 0] },
              { element: 'H', position: [0.87, -0.5, 0] },
              { element: 'H', position: [-0.87, -0.5, 0] },
              { element: 'H', position: [0, 0, 1], showLabel: true },
              { element: 'Cl', position: [-2, 0, 1], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 0, to: 3 },
              { from: 0, to: 4, color: '#ffaa88' }, // Weakening C-H bond
            ],
            electrons: [
              { atomIndex: 0, count: 4, highlight: false },
              { atomIndex: 5, count: 7, highlight: true, unpaired: 1 },
            ],
            radicals: [
              { atomIndex: 5, isRadical: true },
            ],
          },
        ],
      },
      {
        title: 'Propagation Step 2',
        description: 'The <tooltip term="methyl radical">methyl radical</tooltip> reacts with another <tooltip term="chlorine molecule">chlorine molecule</tooltip>, forming <tooltip term="methyl chloride">methyl chloride</tooltip> and regenerating a <tooltip term="chlorine radical">chlorine radical</tooltip>.',
        keyPoints: [
          'The <tooltip term="methyl radical">methyl radical</tooltip> attacks a <tooltip term="chlorine molecule">chlorine molecule</tooltip>.',
          'This forms <tooltip term="methyl chloride">methyl chloride</tooltip> (CH₃Cl) and regenerates a <tooltip term="chlorine radical">chlorine radical</tooltip>.',
          'The regenerated <tooltip term="radical">radical</tooltip> can continue the <tooltip term="chain reaction">chain reaction</tooltip>.',
        ],
        energyChange: 'Energy released as the C-Cl bond forms, regenerating reactive radical.',
        molecules: [
          {
            // Products: HCl and methyl radical + Cl2
            atoms: [
              { element: 'H', position: [-3, 0, 0], showLabel: true },
              { element: 'Cl', position: [-4, 0, 0], showLabel: true },
              { element: 'C', position: [0, 0, 0], showLabel: true },
              { element: 'H', position: [0, 1, 0] },
              { element: 'H', position: [0.87, -0.5, 0] },
              { element: 'H', position: [-0.87, -0.5, 0] },
              { element: 'Cl', position: [2, 0, 0], showLabel: true },
              { element: 'Cl', position: [3, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 }, // HCl
              { from: 2, to: 3 }, // CH3 radical
              { from: 2, to: 4 },
              { from: 2, to: 5 },
              { from: 6, to: 7, color: '#ffaa88' }, // Cl2 about to react
            ],
            electrons: [
              { atomIndex: 2, count: 4, highlight: true, unpaired: 1 }, // Methyl radical
              { atomIndex: 6, count: 7, highlight: false },
              { atomIndex: 7, count: 7, highlight: false },
            ],
            radicals: [
              { atomIndex: 2, isRadical: true },
            ],
          },
        ],
      },
      {
        title: 'Chain Propagation Products',
        description: 'The <tooltip term="chain reaction">chain reaction</tooltip> produces <tooltip term="methyl chloride">methyl chloride</tooltip> and regenerates a <tooltip term="chlorine radical">chlorine radical</tooltip> to continue the cycle.',
        keyPoints: [
          '<tooltip term="Methyl chloride">Methyl chloride</tooltip> (CH₃Cl) is formed as the main <tooltip term="product">product</tooltip>.',
          'A new <tooltip term="chlorine radical">chlorine radical</tooltip> is generated to continue the <tooltip term="chain">chain</tooltip>.',
          'This cycle can repeat hundreds or thousands of times.',
        ],
        energyChange: 'Net energy release drives the overall reaction forward.',
        molecules: [
          {
            // Final products of one cycle
            atoms: [
              { element: 'H', position: [-3, 0, 0], showLabel: true },
              { element: 'Cl', position: [-4, 0, 0], showLabel: true },
              { element: 'C', position: [0, 0, 0], showLabel: true },
              { element: 'H', position: [0, 1, 0] },
              { element: 'H', position: [0.87, -0.5, 0] },
              { element: 'H', position: [-0.87, -0.5, 0] },
              { element: 'Cl', position: [0, -1.5, 0], showLabel: true },
              { element: 'Cl', position: [3, 0, 0], showLabel: true },
            ],
            bonds: [
              { from: 0, to: 1 }, // HCl
              { from: 2, to: 3 }, // CH3Cl
              { from: 2, to: 4 },
              { from: 2, to: 5 },
              { from: 2, to: 6 },
            ],
            electrons: [
              { atomIndex: 7, count: 7, highlight: true, unpaired: 1 }, // New Cl radical
            ],
            radicals: [
              { atomIndex: 7, isRadical: true },
            ],
          },
        ],
      },
    ],
  }
];
