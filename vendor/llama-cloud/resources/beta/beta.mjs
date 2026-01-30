// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as AgentDataAPI from "./agent-data.mjs";
import * as ParseConfigurationsAPI from "./parse-configurations.mjs";
import { ParseConfigurations, } from "./parse-configurations.mjs";
import * as SheetsAPI from "./sheets.mjs";
import { Sheets, } from "./sheets.mjs";
import * as SplitAPI from "./split.mjs";
import { Split, } from "./split.mjs";
import * as BatchAPI from "./batch/batch.mjs";
import { Batch, } from "./batch/batch.mjs";
import * as DirectoriesAPI from "./directories/directories.mjs";
import { Directories, } from "./directories/directories.mjs";
export class Beta extends APIResource {
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
Beta.ParseConfigurations = ParseConfigurations;
Beta.Sheets = Sheets;
Beta.Directories = Directories;
Beta.Batch = Batch;
Beta.Split = Split;
//# sourceMappingURL=beta.mjs.map