class Rules {
    constructor() {
        if (!this.rules) {
            this.rules = new Map();
            return {
                rules: this.rules
            };
        }
        return {
            rules: this.rules
        };
    }
}
module.exports = new Rules();

