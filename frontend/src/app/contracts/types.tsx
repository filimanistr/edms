export type Counterparty = {
  id: number
  name: string
}

export type Service = {
  id: number
  name: string
}

export type Template = {
  id: number
  name: string
  service: number
}

export type ContractPreview = {
  name?: string
  contract?: object
  template__name?: string
  user?: object
}

export interface Data {
  counterparties: Counterparty[];
  templates: Template[];
  services: Service[];
}
