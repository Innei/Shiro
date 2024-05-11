import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types'

import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

import { apiClient } from './request'
import { toast } from './toast'

class AuthnUtilsStatic {
  async createPassKey(name: string) {
    const registrationOptions =
      await apiClient.proxy.passkey.register.post<any>()
    let attResp: RegistrationResponseJSON
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startRegistration(registrationOptions)
    } catch (error: any) {
      // Some basic error handling
      if (error.name === 'InvalidStateError') {
        toast.error(
          'Error: Authenticator was probably already registered by user',
        )
      } else {
        toast.error(error.message)
      }

      return
    }

    try {
      Object.assign(attResp, {
        name,
      })
      const verificationResp =
        await apiClient.proxy.passkey.register.verify.post<any>({
          data: attResp,
        })
      if (verificationResp.verified) {
        toast.success('Successfully registered authenticator')
      } else {
        toast.error('Error: Could not verify authenticator')
      }
    } catch {
      toast.error('Error: Could not verify authenticator')
    }
  }

  async validate(test?: boolean) {
    const registrationOptions =
      await apiClient.proxy.passkey.authentication.post<any>()
    let attResp: AuthenticationResponseJSON
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startAuthentication(registrationOptions)
    } catch (error: any) {
      // Some basic error handling

      toast.error(error.message)

      return
    }

    if (test) {
      Object.assign(attResp, { test: true })
    }
    try {
      const verificationResp =
        await apiClient.proxy.passkey.authentication.verify.post<{
          verified: boolean
          token?: string
        }>({
          data: attResp,
        })
      if (verificationResp.verified) {
        toast.success('Successfully authentication by passkey')
      } else {
        toast.error('Error: Could not verify authenticator')
      }
      return verificationResp
    } catch (error: any) {
      toast.error(error.message)
    }
  }
}

export const AuthnUtils = new AuthnUtilsStatic()
