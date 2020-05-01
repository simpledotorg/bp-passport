export interface Medication {
  name: string
  rxnorm_code?: string
  dosage?: string
  is_protocol_drug?: boolean
  offline?: boolean
  days?: {}
}
