export interface Medication {
  id: string
  name: string
  rxnorm_code?: string
  dosage?: string
  is_protocol_drug: boolean
  created_at?: string /* 2019-07-08T18:51:27.255Z */
  updated_at?: string /* 2019-07-08T18:51:27.255Z */
}

/*
{
"id": "string",
"deleted_at": "2020-04-20T15:13:37Z",
"created_at": "2020-04-20T15:13:37Z",
"updated_at": "2020-04-20T15:13:37Z",
"name": "string",
"dosage": "string",
"rxnorm_code": "string",
"is_protocol_drug": true,
"is_deleted": true,
"patient_id": "string",
"facility_id": "string"
} */
