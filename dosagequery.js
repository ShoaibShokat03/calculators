class DosageCalculator {
    constructor(target = "#devatstack-dosage-calculator") {
        const root = document.querySelector(target);
        if (!root) {
            console.error(`Target element "${target}" not found.`);
            return;
        }
        root.innerHTML = "";
        const targetElement = this._elem("div", "devatstack-dosage-calculator");
        root.appendChild(targetElement);
        this.target = targetElement;

        // Inject Styles
        this.injectStyle();

        // Form data
        this.vialAmount = 5; // Default vial in mg
        this.desiredDose = 250; // Default desired dose in mcg
        this.maxBacWater = 5; // Default max BAC water ml for table (dynamic up to this)

        this._render();
    }

    // Inject Styles (similar to unit converter, gray shades)
    injectStyle() {
        const css = `
            #devatstack-dosage-calculator {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background: #2f2f2f;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                color: #ffffff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            }

            .devatstack-dosage-calculator {
                padding: 15px;
                background: #2f2f2f;
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
                background: #3f3f3f;
                border: none;
                border-radius: 5px;
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
                background: #3f3f3f;
                padding: 10px;
                border-radius: 5px;
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
                background: #ffffff;
                color: #2f2f2f;
            }

            .devatstack-btn-calculate:hover {
                background: #e0e0e0;
            }

            .devatstack-btn-clear {
                background: #4f4f4f;
                color: #ffffff;
            }

            .devatstack-btn-clear:hover {
                background: #666666;
            }

            .devatstack-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }

            .devatstack-table th,
            .devatstack-table td {
                padding: 10px;
                text-align: left;
                background: #3f3f3f;
                border-radius: 5px;
                color: #ffffff;
                font-size: 0.9rem;
            }

            .devatstack-table th {
                background: #4f4f4f;
                font-weight: bold;
            }

            .devatstack-table tr:not(:last-child) td {
                margin-bottom: 5px;
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
            "Dosage Query"
        );
        this.target.appendChild(title);

        // Input Sections
        // Vial Amount Input
        const vialSection = this._elem("div", "devatstack-input-section");
        const vialLabel = this._elem(
            "div",
            "devatstack-input-label",
            "I have a vial of"
        );
        const vialRow = this._elem("div", "devatstack-input-row");
        const vialInput = this._elem("input", "devatstack-value-input");
        vialInput.type = "number";
        vialInput.value = this.vialAmount;
        vialInput.step = "any";
        vialInput.placeholder = "Enter mg";
        vialInput.oninput = () => {
            this.vialAmount = parseFloat(vialInput.value) || 0;
            this._updateTable();
        };
        const vialUnit = this._elem("div", "devatstack-unit-label", "mg");
        vialRow.append(vialInput, vialUnit);
        vialSection.append(vialLabel, vialRow);

        // Desired Dose Input
        const doseSection = this._elem("div", "devatstack-input-section");
        const doseLabel = this._elem(
            "div",
            "devatstack-input-label",
            "and the doses I want"
        );
        const doseRow = this._elem("div", "devatstack-input-row");
        const doseInput = this._elem("input", "devatstack-value-input");
        doseInput.type = "number";
        doseInput.value = this.desiredDose;
        doseInput.step = "any";
        doseInput.placeholder = "Enter mcg";
        doseInput.oninput = () => {
            this.desiredDose = parseFloat(doseInput.value) || 0;
            this._updateTable();
        };
        const doseUnit = this._elem("div", "devatstack-unit-label", "mcg");
        doseRow.append(doseInput, doseUnit);
        doseSection.append(doseLabel, doseRow);

        this.target.append(vialSection, doseSection);

        // Action Buttons
        const actionButtons = this._elem("div", "devatstack-action-buttons");
        const calculateBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-calculate",
            "Calculate"
        );
        calculateBtn.onclick = () => this._updateTable();

        const clearBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-clear",
            "Clear"
        );
        clearBtn.onclick = () => {
            this.vialAmount = 0;
            this.desiredDose = 0;
            vialInput.value = "";
            doseInput.value = "";
            this._updateTable();
        };

        actionButtons.append(calculateBtn, clearBtn);
        this.target.appendChild(actionButtons);

        // Table Container
        const tableContainer = this._elem("div", "devatstack-table-container");
        this.target.appendChild(tableContainer);
        this.tableContainer = tableContainer;

        // Initial update
        this._updateTable();
    }

    _updateTable() {
        if (!this.tableContainer) return;

        this.tableContainer.innerHTML = "";

        if (this.vialAmount <= 0 || this.desiredDose <= 0) {
            return;
        }

        // Create table
        const table = this._elem("table", "devatstack-table");
        const thead = this._elem("thead");
        const headerRow = this._elem("tr");
        headerRow.append(
            this._elem("th", null, "Volume of BAC Water (ml)"),
            this._elem("th", null, "Ticks (IU)"),
            this._elem("th", null, "Dose (ml)")
        );
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = this._elem("tbody");

        // Assuming dynamic from 1 to maxBacWater ml (can be adjusted)
        for (let bacMl = 1; bacMl <= this.maxBacWater; bacMl++) {
            const { iu, doseMl } = this._calculateDosage(bacMl);

            const row = this._elem("tr");
            row.append(
                this._elem("td", null, bacMl.toString()),
                this._elem("td", null, this._formatNumber(iu)),
                this._elem("td", null, this._formatNumber(doseMl))
            );
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        this.tableContainer.appendChild(table);
    }

    _calculateDosage(bacMl) {
        // Vial in mg to mcg: vialAmount * 1000
        const totalMcg = this.vialAmount * 1000;
        const concentration = totalMcg / bacMl; // mcg/ml
        const doseMl = this.desiredDose / concentration;
        const iu = doseMl * 100; // Assuming 100 IU per ml syringe
        return { iu, doseMl };
    }

    _formatNumber(num) {
        if (num === 0) return "0";
        if (Math.abs(num) >= 1000) return num.toLocaleString();
        if (Math.abs(num) >= 1) return num.toFixed(0);
        return num.toFixed(2); // For doses like 0.05
    }

    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner !== undefined) el.innerHTML = inner;
        return el;
    }
}

// Initialize the calculator
new DosageCalculator("#devatstack-dosage-calculator");