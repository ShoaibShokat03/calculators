class ReversePeptideCalculator {
    constructor(target = "#devatstack-reverse-peptide-calculator") {
        const root = document.querySelector(target);
        if (!root) {
            console.error(`Target element "${target}" not found.`);
            return;
        }
        root.innerHTML = "";
        const targetElement = this._elem("div", "devatstack-reverse-peptide-calculator");
        root.appendChild(targetElement);
        this.target = targetElement;

        // Inject Styles (gray shades)
        this.injectStyle();

        // Form data
        this.vialMg = 55; // Default vial in mg
        this.dosageMcg = 250; // Default dosage in mcg
        this.units = 100; // Default units

        this._render();
    }

    // Inject Styles (similar to previous, gray shades)
    injectStyle() {
        const css = `
            #devatstack-reverse-peptide-calculator {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(145deg, #606060 0%, #303030 100%);
                border-radius: 12px;
                font-family: Arial, sans-serif;
                color: #ffffff;
                border: 1px solid #DAA520;
                box-shadow: none;
            }

            .devatstack-reverse-peptide-calculator {
                padding: 15px;
                background: transparent;
                border-radius: 10px;
            }

            .devatstack-calculator-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 10px;
                color: #ffffff;
                text-align: center;
            }

            .devatstack-input-section {
                margin-bottom: 15px;
            }

            .devatstack-input-label {
                font-size: 1rem;
                font-weight: 500;
                margin-bottom: 10px;
                color: #ffffff;
            }

            .devatstack-input-row {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 10px;
            }

            .devatstack-value-input {
                flex: 1;
                padding: 10px;
                background: #202020;
                border: 1px solid #DAA520;
                border-radius: 8px;
                color: #ffffff;
                font-size: 1rem;
                text-align: center;
                outline: none;
            }

            .devatstack-value-input::placeholder {
                color: #999999;
            }

            .devatstack-unit-label {
                font-size: 1rem;
                font-weight: 500;
                color: #ffffff;
                background: #202020;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #DAA520;
            }

            .devatstack-action-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .devatstack-btn {
                flex: 1;
                padding: 10px;
                border-radius: 5px;
                border: none;
                font-size: 0.9rem;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }

            .devatstack-btn-calculate {
                background: #808080;
                color: #ffffff;
                border: 1px solid #DAA520;
            }

            .devatstack-btn-calculate:hover {
                background: #606060;
            }

            .devatstack-btn-clear {
                background: #505050;
                color: #ffffff;
                border: 1px solid #DAA520;
            }

            .devatstack-btn-clear:hover {
                background: #404040;
            }

            .devatstack-result-section {
                margin-top: 15px;
                background: rgba(48, 48, 48, 0.8);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #DAA520;
            }

            .devatstack-result-title {
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom: 10px;
                color: #ffffff;
            }

            .devatstack-result-text {
                font-size: 1rem;
                color: #ffffff;
                margin-bottom: 5px;
            }
            /* Gold focus outlines */
            .devatstack-value-input:focus,
            .devatstack-btn:focus {
                outline: 2px solid #DAA520;
                outline-offset: 2px;
                border-color: #DAA520;
            }

            .devatstack-result-note {
                font-size: 0.9rem;
                color: #cccccc;
            }
        `;

        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Main render function
    _render() {
        this.target.innerHTML = "";

        // Title
        const title = this._elem(
            "h2",
            "devatstack-calculator-title",
            "Reverse Peptide Calculator"
        );
        this.target.appendChild(title);

        // Input Sections
        // Vial Mg Input
        const vialSection = this._elem("div", "devatstack-input-section");
        const vialLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Enter Peptide Vial Contents (in mg)"
        );
        const vialSubLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Peptide Vial (mg)"
        );
        vialSubLabel.style.fontSize = "0.9rem";
        vialSubLabel.style.marginBottom = "5px";
        const vialRow = this._elem("div", "devatstack-input-row");
        const vialInput = this._elem("input", "devatstack-value-input");
        vialInput.type = "number";
        vialInput.value = this.vialMg;
        vialInput.step = "any";
        vialInput.placeholder = "Enter mg";
        vialInput.oninput = () => {
            this.vialMg = parseFloat(vialInput.value) || 0;
            this._updateResult();
        };
        vialRow.appendChild(vialInput);
        vialSection.append(vialLabel, vialSubLabel, vialRow);

        // Dosage Mcg Input
        const dosageSection = this._elem("div", "devatstack-input-section");
        const dosageLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Enter Dosage (in micrograms, mcg)"
        );
        const dosageSubLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Dosage (per dose)"
        );
        dosageSubLabel.style.fontSize = "0.9rem";
        dosageSubLabel.style.marginBottom = "5px";
        const dosageRow = this._elem("div", "devatstack-input-row");
        const dosageInput = this._elem("input", "devatstack-value-input");
        dosageInput.type = "number";
        dosageInput.value = this.dosageMcg;
        dosageInput.step = "any";
        dosageInput.placeholder = "Enter mcg";
        dosageInput.oninput = () => {
            this.dosageMcg = parseFloat(dosageInput.value) || 0;
            this._updateResult();
        };
        const dosageUnit = this._elem("div", "devatstack-unit-label", "mcg");
        dosageRow.append(dosageInput, dosageUnit);
        dosageSection.append(dosageLabel, dosageSubLabel, dosageRow);

        // Units Input
        const unitsSection = this._elem("div", "devatstack-input-section");
        const unitsLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Enter Desired Units To Draw"
        );
        const unitsSubLabel = this._elem(
            "div",
            "devatstack-input-label",
            "Units"
        );
        unitsSubLabel.style.fontSize = "0.9rem";
        unitsSubLabel.style.marginBottom = "5px";
        const unitsRow = this._elem("div", "devatstack-input-row");
        const unitsInput = this._elem("input", "devatstack-value-input");
        unitsInput.type = "number";
        unitsInput.value = this.units;
        unitsInput.step = "any";
        unitsInput.placeholder = "Enter units";
        unitsInput.oninput = () => {
            this.units = parseFloat(unitsInput.value) || 0;
            this._updateResult();
        };
        const unitsUnit = this._elem("div", "devatstack-unit-label", "units");
        unitsRow.append(unitsInput, unitsUnit);
        unitsSection.append(unitsLabel, unitsSubLabel, unitsRow);

        this.target.append(vialSection, dosageSection, unitsSection);

        // Action Buttons
        const actionButtons = this._elem("div", "devatstack-action-buttons");
        const calculateBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-calculate",
            "Calculate"
        );
        calculateBtn.onclick = () => this._updateResult();

        const clearBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-clear",
            "Clear"
        );
        clearBtn.onclick = () => {
            this.vialMg = 0;
            this.dosageMcg = 0;
            this.units = 0;
            vialInput.value = "";
            dosageInput.value = "";
            unitsInput.value = "";
            this._updateResult();
        };

        actionButtons.append(calculateBtn, clearBtn);
        this.target.appendChild(actionButtons);

        // Result Section
        const resultSection = this._elem("div", "devatstack-result-section");
        this.target.appendChild(resultSection);
        this.resultContainer = resultSection;

        // Initial update
        this._updateResult();
    }

    _updateResult() {
        if (!this.resultContainer) return;

        this.resultContainer.innerHTML = "";

        if (this.vialMg <= 0 || this.dosageMcg <= 0 || this.units <= 0) {
            return;
        }

        const bacMl = this._calculateBacWater();
        const bacUnits = bacMl * 100; // Assuming 1 ml = 100 units

        const resultTitle = this._elem(
            "div",
            "devatstack-result-title",
            "Required BAC Water For Peptide Reconstitution"
        );

        const resultText = this._elem(
            "div",
            "devatstack-result-text",
            `Reconstitute your peptide vial using ${bacMl.toFixed(2)} ml of BAC water.`
        );

        const resultNote = this._elem(
            "div",
            "devatstack-result-note",
            `(Where ${bacMl.toFixed(2)} ml = ${bacUnits.toFixed(0)} units of BAC water.)`
        );

        this.resultContainer.append(resultTitle, resultText, resultNote);
    }

    _calculateBacWater() {
        // Formula: B = (V * 10 * U) / D
        // Where V in mg, D in mcg, U in units, B in ml
        // Derived from: total mcg = V * 1000
        // dose volume ml = U / 100
        // concentration mcg/ml = total mcg / B
        // dose mcg = concentration * dose volume = D
        return (this.vialMg * 10 * this.units) / this.dosageMcg;
    }

    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner !== undefined) el.innerHTML = inner;
        return el;
    }
}

// Initialize the calculator
new ReversePeptideCalculator("#devatstack-reverse-peptide-calculator");