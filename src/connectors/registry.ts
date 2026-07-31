import { DocumentChunk } from '../types';
import { IConnector } from './base';

export class ConnectorRegistry {
  private static instance: ConnectorRegistry;
  private connectors: Map<string, IConnector> = new Map();

  public static getInstance(): ConnectorRegistry {
    if (!ConnectorRegistry.instance) {
      ConnectorRegistry.instance = new ConnectorRegistry();
    }
    return ConnectorRegistry.instance;
  }

  public register(connector: IConnector): void {
    this.connectors.set(connector.getSourceSystem(), connector);
  }

  public get(sourceSystem: string): IConnector | undefined {
    return this.connectors.get(sourceSystem);
  }

  public list(): IConnector[] {
    return Array.from(this.connectors.values());
  }

  public async initializeAll(): Promise<void> {
    for (const connector of this.connectors.values()) {
      await connector.initialize();
    }
  }

  public async syncAll(): Promise<DocumentChunk[]> {
    const allChunks: DocumentChunk[] = [];
    for (const connector of this.connectors.values()) {
      const chunks = await connector.toDocumentChunks();
      allChunks.push(...chunks);
    }
    return allChunks;
  }

  public clear(): void {
    this.connectors.clear();
  }
}
