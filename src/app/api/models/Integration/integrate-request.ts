import { IntegrationSource } from "./integration-source";

export interface IntegrateRequest {
    source: IntegrationSource;
    file: File;
}
