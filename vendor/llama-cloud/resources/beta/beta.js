"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beta = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const AgentDataAPI = tslib_1.__importStar(require("./agent-data.js"));
const ParseConfigurationsAPI = tslib_1.__importStar(require("./parse-configurations.js"));
const parse_configurations_1 = require("./parse-configurations.js");
const SheetsAPI = tslib_1.__importStar(require("./sheets.js"));
const sheets_1 = require("./sheets.js");
const SplitAPI = tslib_1.__importStar(require("./split.js"));
const split_1 = require("./split.js");
const BatchAPI = tslib_1.__importStar(require("./batch/batch.js"));
const batch_1 = require("./batch/batch.js");
const DirectoriesAPI = tslib_1.__importStar(require("./directories/directories.js"));
const directories_1 = require("./directories/directories.js");
class Beta extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.agentData = new AgentDataAPI.AgentData(this._client);
        this.parseConfigurations = new ParseConfigurationsAPI.ParseConfigurations(this._client);
        this.sheets = new SheetsAPI.Sheets(this._client);
        this.directories = new DirectoriesAPI.Directories(this._client);
        this.batch = new BatchAPI.Batch(this._client);
        this.split = new SplitAPI.Split(this._client);
    }
}
exports.Beta = Beta;
Beta.ParseConfigurations = parse_configurations_1.ParseConfigurations;
Beta.Sheets = sheets_1.Sheets;
Beta.Directories = directories_1.Directories;
Beta.Batch = batch_1.Batch;
Beta.Split = split_1.Split;
//# sourceMappingURL=beta.js.map