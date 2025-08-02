# Page snapshot

```yaml
- banner:
  - heading "Molecular Dynamics Visualization" [level=1]
  - paragraph: Visualize atom and molecule interactions for better understanding of physical chemistry
- main:
  - heading "Select Reaction Type" [level=2]
  - combobox:
    - option "Choose a reaction..." [disabled]
    - option "SN2 Reaction (Nucleophilic Substitution)" [selected]
    - option "Acid-Base Reaction"
    - option "Redox Reaction"
  - paragraph: A bimolecular nucleophilic substitution reaction where a nucleophile attacks a molecule, displacing a leaving group in a single step.
  - text: Nu⁻ + R-LG → R-Nu + LG⁻
  - button "Play"
  - checkbox "Freeze at step start"
  - text: Freeze at step start
  - slider: "0"
  - text: "Step 1 of 5: Initial State"
  - button "Show Electrons"
  - button "Zoom In"
  - button "Zoom Out"
  - button "Reset"
  - text: 1.0x C Br Cl
  - 'heading "Step 1: Initial State" [level=2]'
  - paragraph: The nucleophile (chloride ion) and substrate (bromomethane) are separated. The substrate has a partial positive charge on the carbon atom bonded to the leaving group (bromine).
  - heading "Key Points:" [level=4]
  - list:
    - listitem: The carbon-bromine bond is polarized with the carbon having a partial positive charge.
    - listitem: The nucleophile (chloride ion) has a negative charge and is attracted to the partially positive carbon.
  - heading "Energy Change:" [level=4]
  - paragraph: Starting at baseline energy level.
- contentinfo:
  - paragraph: © 2025 Molecular Dynamics Visualization Tool
```