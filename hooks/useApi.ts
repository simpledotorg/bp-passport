export default function useApi() {
  if (__DEV__) {
    const API_INDIA_ENDPOINT = 'https://api-demo.simple.org/api/v4'
    const API_BANGLADESH_ENDPOINT = 'https://api-demo.bd.simple.org/api/v4'
    const API_ETHIOPIA_ENDPOINT = 'https://api-demo.et.simple.org/api/v4'
    const API_SRI_LANKA_CURRENT_ENDPOINT =
      'https://api-demo.lk.simple.org/api/v4'
    const API_SRI_LANKA_FUTURE_ENDPOINT =
      'https://api-demo.lk.simple.org/api/v4'
    const MOCK_API_ENDPOINT = 'https://simple-mock.herokuapp.com/api'
    return {
      API_INDIA_ENDPOINT,
      API_BANGLADESH_ENDPOINT,
      API_ETHIOPIA_ENDPOINT,
      API_SRI_LANKA_CURRENT_ENDPOINT,
      API_SRI_LANKA_FUTURE_ENDPOINT,
      MOCK_API_ENDPOINT,
    }
  } else {
    const API_INDIA_ENDPOINT = 'https://api.simple.org/api/v4'
    const API_BANGLADESH_ENDPOINT = 'https://api.bd.simple.org/api/v4'
    const API_ETHIOPIA_ENDPOINT = 'https://api.et.simple.org/api/v4'
    const API_SRI_LANKA_CURRENT_ENDPOINT = 'https://api.lk.simple.org/api/v4'
    const API_SRI_LANKA_FUTURE_ENDPOINT =
      'https://api-simple.health.gov.lk/api/v4'
    const MOCK_API_ENDPOINT = 'https://simple-mock.herokuapp.com/api'
    return {
      API_INDIA_ENDPOINT,
      API_BANGLADESH_ENDPOINT,
      API_ETHIOPIA_ENDPOINT,
      API_SRI_LANKA_CURRENT_ENDPOINT,
      API_SRI_LANKA_FUTURE_ENDPOINT,
      MOCK_API_ENDPOINT,
    }
  }
}
