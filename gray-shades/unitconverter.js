class UnitConverter {
    constructor(target = "#devatstack-unit-converter") {
        const root = document.querySelector(target);
        if (!root) {
            console.error(`Target element "${target}" not found.`);
            return;
        }
        root.innerHTML = "";
        const targetElement = this._elem("div", "devatstack-unit-converter");
        root.appendChild(targetElement);
        this.target = targetElement;

        // Inject Styles
        this.injectStyle();

        // Form data
        this.inputValue = 5;
        this.selectedUnit = "ml";

        this._render();
    }

    // Inject Styles
    injectStyle() {
        const css = `
                #devatstack-unit-converter {
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

.devatstack-unit-converter {
    padding: 15px;
    background: #2f2f2f;
    border-radius: 10px;
}

.devatstack-converter-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #ffffff;
    text-align: center;
}

.devatstack-converter-subtitle {
    font-size: 0.9rem;
    margin-bottom: 15px;
    color: #cccccc;
    text-align: center;
}

.devatstack-input-section {
    margin-bottom: 15px;
}

.devatstack-value-label {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 10px;
    color: #ffffff;
}

.devatstack-input-row {
    display: flex;
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

.devatstack-unit-dropdown {
    position: relative;
    display: inline-block;
}

.devatstack-unit-select {
    padding: 10px;
    background: #3f3f3f;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-size: 1rem;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
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

.devatstack-btn-convert {
    background: #ffffff;
    color: #2f2f2f;
}

.devatstack-btn-convert:hover {
    background: #e0e0e0;
}

.devatstack-btn-clear {
    background: #4f4f4f;
    color: #ffffff;
}

.devatstack-btn-clear:hover {
    background: #666666;
}

.devatstack-results {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.devatstack-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #3f3f3f;
    padding: 10px;
    border-radius: 5px;
}

.devatstack-result-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #cccccc;
}

.devatstack-result-value {
    display: flex;
    align-items: center;
    gap: 5px;
}

.devatstack-result-number {
    background: #4f4f4f;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
}

.devatstack-result-unit {
    font-size: 0.9rem;
    font-weight: 500;
    color: #ffffff;
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
            "devatstack-converter-title",
            "Unit Converter"
        );
        const subtitle = this._elem(
            "p",
            "devatstack-converter-subtitle",
            "Enter the value here to convert"
        );
        this.target.append(title, subtitle);

        // Input Section
        const inputSection = this._elem("div", "devatstack-input-section");
        const valueLabel = this._elem(
            "div",
            "devatstack-value-label",
            "Value"
        );

        const inputRow = this._elem("div", "devatstack-input-row");
        const valueInput = this._elem("input", "devatstack-value-input");
        valueInput.type = "number";
        valueInput.value = this.inputValue;
        valueInput.step = "any";
        valueInput.placeholder = "Enter value";
        valueInput.oninput = () => {
            this.inputValue = parseFloat(valueInput.value) || 0;
            this._updateResults();
        };

        const unitSelect = this._elem("select", "devatstack-unit-select");
        const units = [
            { value: "ml", label: "ml" },
            { value: "mg", label: "mg" },
            { value: "ul", label: "uL" },
            { value: "mcg", label: "mcg" },
        ];

        units.forEach((unit) => {
            const option = this._elem("option", null, unit.label);
            option.value = unit.value;
            if (unit.value === this.selectedUnit) option.selected = true;
            unitSelect.appendChild(option);
        });

        unitSelect.onchange = () => {
            this.selectedUnit = unitSelect.value;
            this._updateResults();
        };

        inputRow.append(valueInput, unitSelect);
        inputSection.append(valueLabel, inputRow);
        this.target.appendChild(inputSection);

        // Action Buttons
        const actionButtons = this._elem("div", "devatstack-action-buttons");
        const convertBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-convert",
            "Convert"
        );
        convertBtn.onclick = () => this._updateResults();

        const clearBtn = this._elem(
            "button",
            "devatstack-btn devatstack-btn-clear",
            "Clear"
        );
        clearBtn.onclick = () => {
            this.inputValue = 0;
            valueInput.value = "";
            this._updateResults();
        };

        actionButtons.append(convertBtn, clearBtn);
        this.target.appendChild(actionButtons);

        // Results Section
        const resultsDiv = this._elem("div", "devatstack-results");
        this.target.appendChild(resultsDiv);
        this.resultsContainer = resultsDiv;

        // Initial update
        this._updateResults();
    }

    _updateResults() {
        if (!this.resultsContainer) return;

        this.resultsContainer.innerHTML = "";

        if (this.inputValue <= 0) {
            return;
        }

        // Conversion logic based on the image
        const conversions = this._calculateConversions(
            this.inputValue,
            this.selectedUnit
        );

        // Create result rows for each conversion
        Object.entries(conversions).forEach(([unit, value]) => {
            if (unit !== this.selectedUnit) {
                const resultRow = this._elem("div", "devatstack-result-row");

                const label = this._elem("div", "devatstack-result-label");
                label.textContent = this._getUnitLabel(unit);

                const resultValue = this._elem("div", "devatstack-result-value");
                const number = this._elem(
                    "div",
                    "devatstack-result-number",
                    this._formatNumber(value)
                );
                const unitLabel = this._elem(
                    "div",
                    "devatstack-result-unit",
                    unit
                );

                resultValue.append(number, unitLabel);
                resultRow.append(label, resultValue);
                this.resultsContainer.appendChild(resultRow);
            }
        });
    }

    _calculateConversions(value, fromUnit) {
        // Based on the image conversions, assuming 5ml as base
        const conversions = {
            ml: value,
            mg: 0,
            ul: 0,
            mcg: 0,
        };

        switch (fromUnit) {
            case "ml":
                conversions.mg = value * 1000; // 5ml = 5000mg
                conversions.ul = value * 1000; // 5ml = 5000uL
                conversions.mcg = value * 1000000; // 5ml = 5000000mcg
                break;
            case "mg":
                conversions.ml = value / 1000; // 5000mg = 5ml
                conversions.ul = value; // 5000mg = 5000uL
                conversions.mcg = value * 1000; // 5000mg = 5000000mcg
                break;
            case "ul":
                conversions.ml = value / 1000; // 5000uL = 5ml
                conversions.mg = value; // 5000uL = 5000mg
                conversions.mcg = value * 1000; // 5000uL = 5000000mcg
                break;
            case "mcg":
                conversions.ml = value / 1000000; // 5000000mcg = 5ml
                conversions.mg = value / 1000; // 5000000mcg = 5000mg
                conversions.ul = value / 1000; // 5000000mcg = 5000uL
                break;
        }

        return conversions;
    }

    _getUnitLabel(unit) {
        const labels = {
            ml: "Millilitres(ml)",
            mg: "Milligrams(mg)",
            ul: "Microlitres(uL)",
            mcg: "Micrograms(mcg)",
        };
        return labels[unit] || unit;
    }

    _formatNumber(num) {
        if (num === 0) return "0";
        if (Math.abs(num) >= 1000000) return num.toLocaleString();
        if (Math.abs(num) >= 1000) return num.toLocaleString();
        if (Math.abs(num) >= 1) return num.toFixed(0);
        return num.toFixed(4);
    }

    _elem(tag, cls, inner) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (inner !== undefined) el.innerHTML = inner;
        return el;
    }
}

// Initialize the converter
new UnitConverter("#devatstack-unit-converter");