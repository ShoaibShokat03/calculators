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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    // background: linear-gradient(135deg, #606060 0%, #303030 100%);
    min-height: 100vh;
}
.devatstack-unit-converter {
    max-width: 450px;
    width: 100%;
    padding: 25px;
    background: linear-gradient(135deg, #606060 0%, #303030 100%);
    border-radius: 15px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #f0f0f0;
    border:1px solid #f0f0f0;
    // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
.devatstack-converter-title {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: #f0f0f0;
}
.devatstack-converter-subtitle {
    font-size: 1rem;
    margin-bottom: 25px;
    color: rgba(240, 240, 240, 0.9);
    font-weight: 400;
}
.devatstack-input-section {
    margin-bottom: 25px;
}
.devatstack-value-label {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #f0f0f0;
}
.devatstack-input-row {
    display: flex;
    gap: 0;
    margin-bottom: 20px;
}
.devatstack-value-input {
    flex: 1;
    padding: 15px 20px;
    background: rgba(48, 48, 48, 0.2);
    border: none;
    color: #f0f0f0;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
    border-radius: 25px 0 0 25px;
    outline: none;
}
.devatstack-value-input::placeholder {
    color: rgba(240, 240, 240, 0.6);
}
.devatstack-unit-dropdown {
    position: relative;
    display: inline-block;
}
.devatstack-unit-select {
    padding: 15px 20px;
    background: rgba(48, 48, 48, 0.3);
    border: none;
    color: #f0f0f0;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 0 25px 25px 0;
    cursor: pointer;
    outline: none;
    min-width: 80px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 35px;
}
.devatstack-action-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 25px;
}
.devatstack-btn {
    flex: 1;
    padding: 12px 20px;
    border-radius: 25px;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.devatstack-btn-convert {
    background: #f0f0f0;
    color: #303030;
}
.devatstack-btn-convert:hover {
    background: #d0d0d0;
    transform: translateY(-1px);
}
.devatstack-btn-clear {
    background: rgba(240, 240, 240, 0.2);
    color: #f0f0f0;
    border: 1px solid rgba(240, 240, 240, 0.3);
}
.devatstack-btn-clear:hover {
    background: rgba(240, 240, 240, 0.3);
    transform: translateY(-1px);
}
.devatstack-results {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.devatstack-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(48, 48, 48, 0.2);
    padding: 15px 20px;
    border-radius: 25px;
    backdrop-filter: blur(10px);
}
.devatstack-result-label {
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(240, 240, 240, 0.9);
}
.devatstack-result-value {
    display: flex;
    align-items: center;
    gap: 0;
}
.devatstack-result-number {
    background: rgba(48, 48, 48, 0.3);
    padding: 12px 18px;
    border-radius: 20px 0 0 20px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f0f0;
    min-width: 100px;
    text-align: center;
}
.devatstack-result-unit {
    background: rgba(48, 48, 48, 0.4);
    padding: 12px 15px;
    border-radius: 0 20px 20px 0;
    font-size: 1rem;
    font-weight: 500;
    color: #f0f0f0;
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
            "h1",
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