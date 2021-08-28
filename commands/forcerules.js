class RuleEnforcement_Plugin {
    #IsEnabled;

    constructor() {
        this.#IsEnabled = false;
    }

    rfGetEnabled() {
        return this.#IsEnabled;
    }
    
    rfToggle() {
        this.#IsEnabled = !this.#IsEnabled;
        return this.#IsEnabled;
    }
}

module.exports = RuleEnforcement_Plugin;