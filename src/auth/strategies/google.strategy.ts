import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientID || process.env.GOOGLE_CLIENT_ID!,
      clientSecret:
        googleConfig.clientSecret || process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: googleConfig.callbackURL || process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      passReqToCallback: false, // ✅ Explicitly define this
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const user = await this.authService.validateGoogleUser({
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName ?? '',
      password: '',
    });

    if (!user) {
      throw new UnauthorizedException('Google account not linked or invalid.');
    }

    done(null, user);
  }
}
